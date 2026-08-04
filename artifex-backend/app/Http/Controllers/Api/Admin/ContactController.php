<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::latest();

        if ($request->filled('status') && $request->status === 'unread') {
            $query->where('read', false);
        }

        $messages = $query->get()->map(fn ($m) => $this->format($m));

        return response()->json(['data' => $messages]);
    }

    public function markRead(string $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['read' => true]);

        return response()->json(['data' => $this->format($message)]);
    }

    public function destroy(string $id): JsonResponse
    {
        ContactMessage::findOrFail($id)->delete();

        return response()->json(['message' => 'Pesan dihapus']);
    }

    private function format(ContactMessage $message): array
    {
        return [
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'subject' => $message->subject,
            'message' => $message->message,
            'read' => $message->read,
            'createdAt' => $message->created_at,
        ];
    }
}
