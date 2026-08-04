<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('role', 'client')->first();

        $notifications = [
            ['type' => 'order', 'title' => 'Pesanan Diterima', 'message' => 'Pesanan ORD-1001 telah diterima oleh Rina S.', 'read' => false, 'link' => '/client/orders/1'],
            ['type' => 'order', 'title' => 'Pesanan Selesai', 'message' => 'Pesanan ORD-1003 telah selesai. Berikan review!', 'read' => true, 'link' => '/client/orders/3'],
            ['type' => 'payment', 'title' => 'Pembayaran Berhasil', 'message' => 'Pembayaran untuk ORD-1003 sebesar Rp250.000 telah berhasil.', 'read' => true, 'link' => '/client/riwayat'],
            ['type' => 'system', 'title' => 'Selamat Datang di Artifex!', 'message' => 'Akun kamu telah berhasil dibuat. Mulai jelajahi layanan kami!', 'read' => true, 'link' => '/explore'],
        ];

        foreach ($notifications as $notif) {
            Notification::create(array_merge($notif, [
                'user_id' => $client->id,
            ]));
        }
    }
}
