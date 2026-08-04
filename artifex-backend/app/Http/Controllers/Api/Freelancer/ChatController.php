<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function conversations(Request $request): JsonResponse
    {
        $conversations = Conversation::where('freelancer_id', $request->user()->id)
            ->with('client:id,name,avatar,is_online')
            ->with('order:id,order_code')
            ->latest('last_message_at')
            ->get()
            ->map(function ($conv) {
                return [
                    'id' => $conv->id,
                    'client' => [
                        'id' => $conv->client->id,
                        'name' => $conv->client->name,
                        'avatar' => $conv->client->avatar,
                        'isOnline' => $conv->client->is_online,
                    ],
                    'lastMessage' => $conv->last_message,
                    'updatedAt' => $conv->last_message_at,
                    'unread' => $conv->freelancer_unread_count,
                    'orderId' => $conv->order_id,
                ];
            });

        return response()->json(['data' => $conversations]);
    }

    public function messages(Request $request, string $id): JsonResponse
    {
        $conversation = Conversation::where('id', $id)
            ->where('freelancer_id', $request->user()->id)
            ->firstOrFail();

        $conversation->update(['freelancer_unread_count' => 0]);

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

    public function sendMessage(Request $request, string $id): JsonResponse
    {
        $conversation = Conversation::where('id', $id)
            ->where('freelancer_id', $request->user()->id)
            ->firstOrFail();

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
            'sender_id' => $request->user()->id,
            'content' => $content,
            'type' => $type,
            'attachment' => $validated['attachment'] ?? null,
            'amount' => $type === 'payment' ? ($validated['amount'] ?? null) : null,
            'payment_status' => $type === 'payment' ? 'pending' : null,
        ]);

        if ($type === 'payment' && $message->amount && $conversation->order_id) {
            $order = $conversation->order()->first();
            if ($order && $order->type === 'custom') {
                $order->update(['deal_price' => $message->amount]);
            }
        }

        $conversation->update([
            'last_message' => $this->lastMessageText($message),
            'last_message_at' => now(),
            'client_unread_count' => $conversation->client_unread_count + 1,
        ]);

        NotificationService::send(
            $conversation->client_id,
            'message',
            'Pesan Baru',
            'Pesan baru dari freelancer: ' . mb_strimwidth($this->lastMessageText($message), 0, 60, '...'),
            '/client/chat?conversation=' . $conversation->id,
        );

        $message->load('sender:id,name,avatar');

        return response()->json([
            'data' => [
                'id' => $message->id,
                'sender' => 'freelancer',
                'content' => $message->content,
                'type' => $message->type,
                'attachment' => $message->attachment,
                'amount' => $message->amount,
                'paymentStatus' => $message->payment_status,
                'createdAt' => $message->created_at,
            ],
        ], 201);
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
