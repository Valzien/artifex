<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public static function send(int $userId, string $type, string $title, string $message, ?string $link = null): void
    {
        Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'read' => false,
            'link' => $link,
        ]);
    }
}
