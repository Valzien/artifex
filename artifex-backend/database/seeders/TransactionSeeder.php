<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('role', 'client')->first();
        $freelancers = User::where('role', 'freelancer')->get();

        // Client transactions (payments)
        $clientTransactions = [
            ['description' => 'Pembayaran Desain Logo Profesional — Rina S.', 'amount' => 350000, 'type' => 'expense', 'status' => 'pending', 'payment_method' => 'bank_transfer', 'date' => '2026-07-20'],
            ['description' => 'Pembayaran Rigging Live2D Model Vtuber — Yuki T.', 'amount' => 3500000, 'type' => 'expense', 'status' => 'pending', 'payment_method' => 'e_wallet', 'date' => '2026-07-24'],
            ['description' => 'Pembayaran Voice Over Profesional — Maya L.', 'amount' => 250000, 'type' => 'expense', 'status' => 'completed', 'payment_method' => 'bank_transfer', 'date' => '2026-07-10'],
            ['description' => 'Desain Poster Promosi — Rina S.', 'amount' => 200000, 'type' => 'expense', 'status' => 'completed', 'payment_method' => 'e_wallet', 'date' => '2026-07-05'],
            ['description' => 'Video Editing Reels — Dimas P.', 'amount' => 500000, 'type' => 'expense', 'status' => 'completed', 'payment_method' => 'credit_card', 'date' => '2026-06-28'],
            ['description' => 'Art Commission Character Design — Maya L.', 'amount' => 500000, 'type' => 'expense', 'status' => 'completed', 'payment_method' => 'bank_transfer', 'date' => '2026-06-20'],
        ];

        foreach ($clientTransactions as $txData) {
            $date = $txData['date'];
            unset($txData['date']);
            Transaction::create(array_merge($txData, [
                'user_id' => $client->id,
                'created_at' => $date,
            ]));
        }

        // Freelancer transactions (income + withdrawals)
        $freelancer = $freelancers->firstWhere('name', 'Rina S.');
        if ($freelancer) {
            $freelancerTxs = [
                ['description' => 'Pembayaran ORD-1001', 'amount' => 350000, 'type' => 'income', 'status' => 'pending', 'date' => '2026-07-25'],
                ['description' => 'Pembayaran ORD-1000', 'amount' => 200000, 'type' => 'income', 'status' => 'completed', 'date' => '2026-07-20'],
                ['description' => 'Withdraw ke BCA ****1234', 'amount' => 2000000, 'type' => 'withdrawal', 'status' => 'completed', 'date' => '2026-07-10'],
                ['description' => 'Pembayaran ORD-998', 'amount' => 500000, 'type' => 'income', 'status' => 'completed', 'date' => '2026-06-28'],
            ];

            foreach ($freelancerTxs as $txData) {
                $date = $txData['date'];
                unset($txData['date']);
                Transaction::create(array_merge($txData, [
                    'user_id' => $freelancer->id,
                    'created_at' => $date,
                ]));
            }
        }
    }
}
