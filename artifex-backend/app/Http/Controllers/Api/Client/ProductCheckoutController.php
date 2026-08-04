<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductOrder;
use App\Services\NotificationService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductCheckoutController extends Controller
{
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'payment_method' => 'required|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->status !== 'active') {
            return response()->json(['message' => 'Product not available'], 422);
        }

        $existingOrder = ProductOrder::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->where('status', 'completed')
            ->first();

        if ($existingOrder) {
            return response()->json(['message' => 'You already own this product', 'orderId' => $existingOrder->id, 'orderCode' => $existingOrder->order_code], 409);
        }

        $order = ProductOrder::create([
            'order_code' => 'PROD-' . strtoupper(Str::random(8)),
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
            'price' => $product->price,
            'payment_method' => $validated['payment_method'],
            'status' => 'completed',
            'download_token' => Str::random(40),
        ]);

        CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        TransactionService::recordPayment(
            $request->user()->id,
            $product->user_id,
            null,
            'Pembelian produk: ' . $product->title,
            $product->price,
            $validated['payment_method'],
            true,
        );

        NotificationService::send(
            $product->user_id,
            'new_order',
            'Produk Terjual',
            'Produk "' . $product->title . '" baru saja dibeli oleh ' . $request->user()->name . '.',
            '/freelancer/earnings',
        );

        return response()->json([
            'data' => [
                'orderId' => $order->id,
                'orderCode' => $order->order_code,
                'downloadToken' => $order->download_token,
                'productName' => $product->title,
                'fileUrl' => $product->file_url,
                'fileName' => $product->file_name,
            ],
        ], 201);
    }

    public function orders(Request $request): JsonResponse
    {
        $orders = ProductOrder::where('user_id', $request->user()->id)
            ->with(['product' => function ($q) {
                $q->select('id', 'title', 'file_url', 'file_name', 'previews');
            }])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'orderCode' => $order->order_code,
                    'product' => [
                        'id' => $order->product->id,
                        'title' => $order->product->title,
                        'previews' => $order->product->previews ?? [],
                    ],
                    'price' => $order->price,
                    'paymentMethod' => $order->payment_method,
                    'status' => $order->status,
                    'downloadToken' => $order->download_token,
                    'fileUrl' => $order->product->file_url,
                    'fileName' => $order->product->file_name,
                    'downloadedAt' => $order->downloaded_at,
                    'createdAt' => $order->created_at,
                ];
            });

        return response()->json(['data' => $orders]);
    }

    public function download(Request $request, string $token): JsonResponse
    {
        $order = ProductOrder::where('download_token', $token)
            ->where('user_id', $request->user()->id)
            ->where('status', 'completed')
            ->with(['product' => function ($q) {
                $q->select('id', 'title', 'file_url', 'file_name');
            }])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Invalid download link'], 404);
        }

        $order->update(['downloaded_at' => now()]);

        return response()->json([
            'data' => [
                'fileUrl' => $order->product->file_url,
                'fileName' => $order->product->file_name,
                'productName' => $order->product->title,
            ],
        ]);
    }
}
