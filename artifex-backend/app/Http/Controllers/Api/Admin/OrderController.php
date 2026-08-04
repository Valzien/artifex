<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\NotificationService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('client:id,name,avatar')
            ->with('freelancer:id,name,avatar')
            ->with('service:id,title,image');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15);

        $formattedOrders = collect($orders->items())->map(function ($order) {
            return [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown',
                'price' => $order->price,
                'status' => $order->status,
                'packageName' => $order->package_name,
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'client' => [
                    'id' => $order->client->id,
                    'name' => $order->client->name,
                    'avatar' => $order->client->avatar,
                ],
                'freelancer' => [
                    'id' => $order->freelancer->id,
                    'name' => $order->freelancer->name,
                    'avatar' => $order->freelancer->avatar,
                ],
            ];
        });

        return response()->json([
            'data' => $formattedOrders,
            'meta' => [
                'currentPage' => $orders->currentPage(),
                'lastPage' => $orders->lastPage(),
                'perPage' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $order = Order::with('client:id,name,avatar,email,phone,location')
            ->with('freelancer:id,name,avatar,email,phone,location')
            ->with('service:id,title,image,description')
            ->with('reviews')
            ->with('transactions')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown',
                'price' => $order->price,
                'status' => $order->status,
                'message' => $order->message,
                'packageName' => $order->package_name,
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'client' => [
                    'id' => $order->client->id,
                    'name' => $order->client->name,
                    'avatar' => $order->client->avatar,
                    'email' => $order->client->email,
                    'phone' => $order->client->phone,
                    'location' => $order->client->location,
                ],
                'freelancer' => [
                    'id' => $order->freelancer->id,
                    'name' => $order->freelancer->name,
                    'avatar' => $order->freelancer->avatar,
                    'email' => $order->freelancer->email,
                    'phone' => $order->freelancer->phone,
                    'location' => $order->freelancer->location,
                ],
                'reviews' => $order->reviews,
                'transactions' => $order->transactions,
            ],
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled,rejected,disputed',
        ]);

        DB::transaction(function () use ($order, $validated) {
            $order->update(['status' => $validated['status']]);
        });

        if ($validated['status'] === 'completed') {
            TransactionService::settleOrder($order->id);
        }

        if (in_array($validated['status'], ['cancelled', 'rejected'])) {
            TransactionService::refundOrder($order->id);
        }

        $statusLabel = [
            'pending' => 'Menunggu konfirmasi',
            'in_progress' => 'Sedang dikerjakan',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            'rejected' => 'Ditolak',
            'disputed' => 'Dispute',
        ];
        $label = $statusLabel[$validated['status']] ?? $validated['status'];

        NotificationService::send(
            $order->client_id,
            'order_update',
            'Status Pesanan Diubah',
            'Status pesanan ' . $order->order_code . ' oleh admin: ' . $label . '.',
            '/client/orders/' . $order->id,
        );

        NotificationService::send(
            $order->freelancer_id,
            'order_update',
            'Status Pesanan Diubah',
            'Status pesanan ' . $order->order_code . ' oleh admin: ' . $label . '.',
            '/freelancer/orders',
        );

        $order->load('client:id,name,avatar', 'freelancer:id,name,avatar', 'service:id,title');

        return response()->json(['data' => $order]);
    }
}
