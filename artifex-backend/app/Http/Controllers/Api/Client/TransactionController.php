<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $totalSpent = Transaction::where('user_id', $userId)->where('type', 'expense')->where('status', 'completed')->sum('amount');
        $totalOrders = Transaction::where('user_id', $userId)->where('type', 'expense')->count();
        $pending = Transaction::where('user_id', $userId)->where('type', 'expense')->where('status', 'pending')->sum('amount');

        $transactions = Transaction::where('user_id', $userId)
            ->with('order:id,order_code')
            ->latest()
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'orderId' => $t->order_id,
                    'description' => $t->description,
                    'amount' => $t->amount,
                    'type' => $t->type,
                    'status' => $t->status,
                    'paymentMethod' => $t->payment_method,
                    'createdAt' => $t->created_at,
                ];
            });

        return response()->json([
            'data' => [
                'stats' => [
                    'totalSpent' => (int) $totalSpent,
                    'totalOrders' => $totalOrders,
                    'pending' => (int) $pending,
                ],
                'transactions' => $transactions,
            ]
        ]);
    }
}
