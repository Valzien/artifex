<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\Withdrawal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EarningController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $totalEarned = Transaction::where('user_id', $user->id)
            ->where('type', 'earning')
            ->where('status', 'completed')
            ->sum('amount');

        $pending = Order::where('freelancer_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress', 'revision'])
            ->sum('price');

        $withdrawn = Withdrawal::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('amount');

        $available = $totalEarned - $withdrawn;

        $transactions = Transaction::where('user_id', $user->id)
            ->with('order:id,order_code,service_id')
            ->latest()
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'description' => $t->description,
                    'amount' => $t->amount,
                    'type' => $t->type,
                    'status' => $t->status,
                    'date' => $t->created_at,
                ];
            });

        $withdrawals = Withdrawal::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn ($w) => $this->formatWithdrawal($w));

        return response()->json([
            'data' => [
                'stats' => [
                    'totalEarned' => (float) $totalEarned,
                    'pending' => (float) $pending,
                    'available' => (float) max(0, $available),
                    'withdrawn' => (float) $withdrawn,
                ],
                'transactions' => $transactions,
                'withdrawals' => $withdrawals,
            ],
        ]);
    }

    public function storeWithdrawal(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'bankName' => 'required|string|max:255',
            'accountNumber' => 'required|string|max:255',
        ]);

        $withdrawal = Withdrawal::create([
            'user_id' => $request->user()->id,
            'amount' => (int) $validated['amount'],
            'bank_name' => $validated['bankName'],
            'account_number' => $validated['accountNumber'],
            'status' => 'pending',
        ]);

        return response()->json(['data' => $this->formatWithdrawal($withdrawal)], 201);
    }

    private function formatWithdrawal(Withdrawal $withdrawal): array
    {
        return [
            'id' => $withdrawal->id,
            'amount' => (float) $withdrawal->amount,
            'bankName' => $withdrawal->bank_name,
            'accountNumber' => $withdrawal->account_number,
            'status' => $withdrawal->status,
            'date' => $withdrawal->created_at,
        ];
    }
}
