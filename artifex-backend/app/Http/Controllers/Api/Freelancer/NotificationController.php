<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'read' => $n->read,
                'createdAt' => $n->created_at,
                'link' => $n->link,
            ]);

        return response()->json(['data' => $notifications]);
    }

    public function markRead(string $id): JsonResponse
    {
        $notification = Notification::where('user_id', auth()->id())->findOrFail($id);
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Notifikasi ditandai sudah dibaca']);
    }

    public function markAllRead(): JsonResponse
    {
        Notification::where('user_id', auth()->id())->where('read', false)->update(['read' => true]);
        return response()->json(['message' => 'Semua notifikasi ditandai sudah dibaca']);
    }
}
