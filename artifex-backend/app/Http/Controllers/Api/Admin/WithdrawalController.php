<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Withdrawal::with('user:id,name,email');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $withdrawals = $query->latest()->get()->map(fn ($w) => $this->format($w));

        return response()->json(['data' => $withdrawals]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $withdrawal = Withdrawal::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:completed,rejected',
        ]);

        $withdrawal->update(['status' => $validated['status']]);

        if ($validated['status'] === 'completed') {
            TransactionService::recordWithdrawal($withdrawal->user_id, $withdrawal->amount);
        }

        return response()->json(['data' => $this->format($withdrawal)]);
    }

    private function format(Withdrawal $withdrawal): array
    {
        return [
            'id' => $withdrawal->id,
            'amount' => (float) $withdrawal->amount,
            'bankName' => $withdrawal->bank_name,
            'accountNumber' => $withdrawal->account_number,
            'status' => $withdrawal->status,
            'date' => $withdrawal->created_at,
            'user' => $withdrawal->user
                ? [
                    'id' => $withdrawal->user->id,
                    'name' => $withdrawal->user->name,
                    'email' => $withdrawal->user->email,
                ]
                : null,
        ];
    }
}
