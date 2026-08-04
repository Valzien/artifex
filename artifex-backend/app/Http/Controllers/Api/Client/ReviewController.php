<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function store(Request $request, int $orderId): JsonResponse
    {
        $order = Order::where('client_id', $request->user()->id)->findOrFail($orderId);

        if ($order->status !== 'completed') {
            throw ValidationException::withMessages([
                'order' => ['Order hanya bisa direview setelah statusnya completed.'],
            ]);
        }

        if ($order->reviews()->exists()) {
            throw ValidationException::withMessages([
                'order' => ['Kamu sudah mereview order ini.'],
            ]);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = $order->reviews()->create([
            'user_id' => $request->user()->id,
            'freelancer_id' => $order->freelancer_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        NotificationService::send(
            $order->freelancer_id,
            'review',
            'Review Baru',
            'Kamu menerima review bintang ' . $review->rating . ' dari klien pada pesanan ' . $order->order_code . '.',
            '/freelancer/reviews',
        );

        return response()->json([
            'data' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'date' => $review->created_at,
            ],
        ], 201);
    }
}
