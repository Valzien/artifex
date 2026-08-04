<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('role', 'client')->first();
        $freelancers = User::where('role', 'freelancer')->get();

        $orders = [
            [
                'order_code' => 'ORD-1001',
                'freelancer_name' => 'Rina S.',
                'service_title' => 'Desain Logo Profesional untuk Brand Kamu',
                'package_name' => 'Standard',
                'price' => 350000,
                'status' => 'in_progress',
                'message' => 'Saya butuh logo untuk brand startup fashion. Harapannya minimalis dan modern.',
                'created_at' => '2026-07-20',
                'deadline' => '2026-07-27',
            ],
            [
                'order_code' => 'ORD-1002',
                'freelancer_name' => 'Yuki T.',
                'service_title' => 'Rigging Live2D Model Vtuber',
                'package_name' => 'Standard',
                'price' => 3500000,
                'status' => 'pending',
                'message' => 'Model sudah jadi, tinggal rigging. Full body dengan 5 expressions.',
                'created_at' => '2026-07-24',
                'deadline' => '2026-08-05',
            ],
            [
                'order_code' => 'ORD-1003',
                'freelancer_name' => 'Maya L.',
                'service_title' => 'Voice Over Profesional Bahasa Indonesia',
                'package_name' => 'Standard',
                'price' => 250000,
                'status' => 'completed',
                'message' => 'Butuh voice over untuk iklan produk skincare. Gaya friendly dan upbeat.',
                'created_at' => '2026-07-10',
                'deadline' => '2026-07-15',
            ],
            [
                'order_code' => 'ORD-1004',
                'freelancer_name' => 'Dimas P.',
                'service_title' => 'Edit Video YouTube 4K dengan Color Grading',
                'package_name' => 'Basic',
                'price' => 150000,
                'status' => 'cancelled',
                'message' => 'Edit vlog liburan 5 menit.',
                'created_at' => '2026-07-05',
                'deadline' => '2026-07-12',
            ],
        ];

        foreach ($orders as $orderData) {
            $freelancer = $freelancers->firstWhere('name', $orderData['freelancer_name']);
            $service = Service::where('title', $orderData['service_title'])->first();
            if (!$freelancer || !$service) continue;

            Order::create([
                'order_code' => $orderData['order_code'],
                'client_id' => $client->id,
                'freelancer_id' => $freelancer->id,
                'service_id' => $service->id,
                'package_name' => $orderData['package_name'],
                'price' => $orderData['price'],
                'status' => $orderData['status'],
                'message' => $orderData['message'],
                'created_at' => $orderData['created_at'],
                'deadline' => $orderData['deadline'],
            ]);
        }
    }
}
