<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('role', 'client')->first();
        $freelancers = User::where('role', 'freelancer')->get();

        $reviews = [
            [
                'freelancer_name' => 'Rina S.',
                'service_title' => 'Desain Logo Profesional untuk Brand Kamu',
                'rating' => 5,
                'comment' => 'Hasilnya luar biasa! Logo yang dibuat sesuai dengan visi kami. Komunikasi lancar dan tepat waktu.',
                'created_at' => '2026-07-23',
            ],
            [
                'freelancer_name' => 'Rina S.',
                'service_title' => 'Art Commission Character Design',
                'rating' => 5,
                'comment' => 'Brand kit-nya sangat profesional. Mulai dari logo, warna, sampai tipografi semuanya kohesif. Sangat recommended!',
                'created_at' => '2026-07-16',
            ],
            [
                'freelancer_name' => 'Dimas P.',
                'service_title' => 'Edit Video YouTube 4K dengan Color Grading',
                'rating' => 4,
                'comment' => 'Logo bagus, revisi juga cepat. Hanya butuh waktu agak lama di awal untuk paham brief.',
                'created_at' => '2026-07-10',
            ],
            [
                'freelancer_name' => 'Maya L.',
                'service_title' => 'Voice Over Profesional Bahasa Indonesia',
                'rating' => 5,
                'comment' => 'Redesign yang fresh dan modern. Klien kami sangat puas dengan hasilnya.',
                'created_at' => '2026-06-28',
            ],
            [
                'freelancer_name' => 'Fajar A.',
                'service_title' => 'Web Development React + Tailwind',
                'rating' => 4,
                'comment' => 'Hasil memuaskan, harga worth it. Akan order lagi untuk project berikutnya.',
                'created_at' => '2026-06-15',
            ],
        ];

        foreach ($reviews as $reviewData) {
            $freelancer = $freelancers->firstWhere('name', $reviewData['freelancer_name']);
            $order = Order::where('client_id', $client->id)
                ->where('freelancer_id', $freelancer?->id)
                ->first();
            if (!$freelancer || !$order) continue;

            Review::create([
                'order_id' => $order->id,
                'user_id' => $client->id,
                'freelancer_id' => $freelancer->id,
                'rating' => $reviewData['rating'],
                'comment' => $reviewData['comment'],
                'created_at' => $reviewData['created_at'],
            ]);
        }
    }
}
