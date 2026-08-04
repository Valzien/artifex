<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\NotificationService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function conversations(): JsonResponse
    {
        $conversations = Conversation::where('client_id', auth()->id())
            ->with('freelancer:id,name,avatar,is_online')
            ->latest('last_message_at')
            ->get()
            ->map(function ($conv) {
                return [
                    'id' => $conv->id,
                    'freelancer' => [
                        'id' => $conv->freelancer->id,
                        'name' => $conv->freelancer->name,
                        'avatar' => $conv->freelancer->avatar,
                        'isOnline' => $conv->freelancer->is_online,
                    ],
                    'lastMessage' => $conv->last_message,
                    'updatedAt' => $conv->last_message_at,
                    'unread' => $conv->client_unread_count,
                    'orderId' => $conv->order_id,
                ];
            });
        return response()->json(['data' => $conversations]);
    }

    public function startConversation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'freelancer_id' => 'required|exists:users,id',
        ]);

        $existing = Conversation::where('client_id', auth()->id())
            ->where('freelancer_id', $validated['freelancer_id'])
            ->with('freelancer:id,name,avatar,is_online')
            ->first();

        if ($existing) {
            return response()->json([
                'data' => [
                    'id' => $existing->id,
                    'freelancer' => [
                        'id' => $existing->freelancer->id,
                        'name' => $existing->freelancer->name,
                        'avatar' => $existing->freelancer->avatar,
                        'isOnline' => $existing->freelancer->is_online,
                    ],
                ],
            ]);
        }

        $conversation = Conversation::create([
            'client_id' => auth()->id(),
            'freelancer_id' => $validated['freelancer_id'],
            'last_message' => null,
            'last_message_at' => now(),
        ]);

        $conversation->load('freelancer:id,name,avatar,is_online');

        return response()->json([
            'data' => [
                'id' => $conversation->id,
                'freelancer' => [
                    'id' => $conversation->freelancer->id,
                    'name' => $conversation->freelancer->name,
                    'avatar' => $conversation->freelancer->avatar,
                    'isOnline' => $conversation->freelancer->is_online,
                ],
            ],
        ], 201);
    }

    public function messages($id): JsonResponse
    {
        $conversation = Conversation::where('client_id', auth()->id())->findOrFail($id);

        $conversation->update(['client_unread_count' => 0]);

        $messages = Message::where('conversation_id', $conversation->id)
            ->with('sender:id,name,avatar')
            ->orderBy('created_at')
            ->get()
            ->map(function ($msg) use ($conversation) {
                return [
                    'id' => $msg->id,
                    'sender' => $msg->sender_id === $conversation->client_id ? 'client' : 'freelancer',
                    'content' => $msg->content,
                    'type' => $msg->type,
                    'attachment' => $msg->attachment,
                    'amount' => $msg->amount,
                    'paymentStatus' => $msg->payment_status,
                    'createdAt' => $msg->created_at,
                ];
            });
        return response()->json(['data' => $messages]);
    }

    public function sendMessage(Request $request, $id): JsonResponse
    {
        $conversation = Conversation::where('client_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'content' => 'nullable|string',
            'type' => 'nullable|in:text,image,payment',
            'attachment' => 'nullable|array',
            'attachment.url' => 'required_with:attachment|string',
            'attachment.name' => 'nullable|string',
            'amount' => 'nullable|numeric|min:0',
        ]);

        $type = $validated['type'] ?? 'text';
        $content = $validated['content'] ?? match ($type) {
            'payment' => 'Permintaan pembayaran',
            'image' => 'Foto',
            default => '',
        };

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => auth()->id(),
            'content' => $content,
            'type' => $type,
            'attachment' => $validated['attachment'] ?? null,
            'amount' => $type === 'payment' ? ($validated['amount'] ?? null) : null,
            'payment_status' => $type === 'payment' ? 'pending' : null,
        ]);

        $conversation->update([
            'last_message' => $this->lastMessageText($message),
            'last_message_at' => now(),
            'freelancer_unread_count' => $conversation->freelancer_unread_count + 1,
        ]);

        NotificationService::send(
            $conversation->freelancer_id,
            'message',
            'Pesan Baru',
            'Pesan baru dari klien: ' . mb_strimwidth($this->lastMessageText($message), 0, 60, '...'),
            '/freelancer/chat?conversation=' . $conversation->id,
        );

        return response()->json([
            'data' => [
                'id' => $message->id,
                'sender' => 'client',
                'content' => $message->content,
                'type' => $message->type,
                'attachment' => $message->attachment,
                'amount' => $message->amount,
                'paymentStatus' => $message->payment_status,
                'createdAt' => $message->created_at,
            ],
        ], 201);
    }

    public function payMessage($conversationId, $messageId): JsonResponse
    {
        $conversation = Conversation::where('client_id', auth()->id())->findOrFail($conversationId);

        $message = Message::where('conversation_id', $conversation->id)
            ->where('id', $messageId)
            ->where('type', 'payment')
            ->firstOrFail();

        if ($message->payment_status === 'paid') {
            return response()->json(['message' => 'Pembayaran sudah diselesaikan'], 422);
        }

        $message->update(['payment_status' => 'paid']);

        TransactionService::recordPayment(
            $conversation->client_id,
            $conversation->freelancer_id,
            $conversation->order_id,
            'Pembayaran via chat' . ($conversation->order_id ? ' (ORDER ' . ($conversation->order->order_code ?? '') . ')' : ''),
            $message->amount,
        );

        NotificationService::send(
            $conversation->freelancer_id,
            'payment',
            'Pembayaran Diterima',
            'Klien telah membayar ' . number_format($message->amount, 0, ',', '.') . ' via chat.',
            '/freelancer/earnings',
        );

        return response()->json([
            'data' => [
                'id' => $message->id,
                'paymentStatus' => 'paid',
            ],
        ]);
    }

    private function lastMessageText(Message $message): string
    {
        return match ($message->type) {
            'image' => '📷 Foto',
            'payment' => '💳 Permintaan pembayaran',
            default => $message->content ?? '',
        };
    }
}
