<?php

namespace App\Services;

use App\Models\Transaction;

class TransactionService
{
    public static function recordPayment(
        int $clientId,
        int $freelancerId,
        ?int $orderId,
        string $description,
        float $amount,
        ?string $paymentMethod = null,
        bool $settled = false
    ): void {
        $status = $settled ? 'completed' : 'pending';

        Transaction::create([
            'order_id' => $orderId,
            'user_id' => $clientId,
            'description' => $description,
            'amount' => (int) round($amount),
            'type' => 'expense',
            'status' => $status,
            'payment_method' => $paymentMethod,
        ]);

        Transaction::create([
            'order_id' => $orderId,
            'user_id' => $freelancerId,
            'description' => $description,
            'amount' => (int) round($amount),
            'type' => 'earning',
            'status' => $status,
            'payment_method' => $paymentMethod,
        ]);
    }

    public static function settleOrder(int $orderId): void
    {
        Transaction::where('order_id', $orderId)->update(['status' => 'completed']);
    }

    public static function refundOrder(int $orderId): void
    {
        Transaction::where('order_id', $orderId)
            ->where('type', 'expense')
            ->update(['type' => 'refund', 'status' => 'completed']);

        Transaction::where('order_id', $orderId)
            ->where('type', 'earning')
            ->delete();
    }

    public static function recordWithdrawal(int $userId, float $amount): void
    {
        Transaction::create([
            'order_id' => null,
            'user_id' => $userId,
            'description' => 'Penarikan saldo',
            'amount' => (int) round($amount),
            'type' => 'withdrawal',
            'status' => 'completed',
            'payment_method' => null,
        ]);
    }
}
