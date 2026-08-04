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

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = CartItem::where('user_id', $request->user()->id)
            ->with([
                'product' => function ($q) {
                    $q->select('id', 'title', 'price', 'previews', 'user_id', 'category_id');
                    $q->with('user:id,name');
                    $q->with('category:id,name');
                },
            ])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'title' => $item->product->title,
                        'price' => $item->product->price,
                        'previews' => $item->product->previews ?? [],
                        'freelancer' => $item->product->user->name ?? null,
                        'category' => $item->product->category->name ?? null,
                    ],
                ];
            });

        $total = $items->sum(function ($item) {
            return $item['product']['price'];
        });

        return response()->json(['data' => $items, 'meta' => ['total' => $total, 'count' => $items->count()]]);
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Product already in cart'], 409);
        }

        $item = CartItem::create([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        return response()->json(['data' => $item, 'message' => 'Added to cart'], 201);
    }

    public function remove(Request $request, string $id): JsonResponse
    {
        CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail()
            ->delete();

        return response()->json(['message' => 'Removed from cart']);
    }

    public function clear(Request $request): JsonResponse
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Cart cleared']);
    }

    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);

        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $orders = [];
        foreach ($cartItems as $item) {
            $product = $item->product;
            if (!$product || $product->status !== 'active') continue;

            $existing = ProductOrder::where('user_id', $request->user()->id)
                ->where('product_id', $product->id)
                ->where('status', 'completed')
                ->first();

            if ($existing) {
                $item->delete();
                continue;
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

            $orders[] = [
                'orderId' => $order->id,
                'orderCode' => $order->order_code,
                'downloadToken' => $order->download_token,
                'productName' => $product->title,
                'fileUrl' => $product->file_url,
                'fileName' => $product->file_name,
            ];

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

            $item->delete();
        }

        return response()->json([
            'data' => [
                'orders' => $orders,
                'totalOrders' => count($orders),
            ],
        ], 201);
    }
}
