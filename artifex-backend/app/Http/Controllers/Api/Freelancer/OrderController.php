<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\NotificationService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::where('freelancer_id', $request->user()->id)
            ->with('client:id,name,avatar')
            ->with('service:id,title,image')
            ->with('conversation:id,order_id');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->get()->map(function ($order) {
            return [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown Service',
                'type' => $order->type,
                'customMin' => $order->custom_min,
                'customMax' => $order->custom_max,
                'dealPrice' => $order->deal_price,
                'conversationId' => $order->conversation?->id,
                'price' => $order->price,
                'status' => $order->status,
                'message' => $order->message,
                'packageName' => $order->package_name,
                'deliverables' => $order->deliverables ?? [],
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'clientName' => $order->client->name ?? 'Unknown',
                'clientAvatar' => $order->client->avatar,
            ];
        });

        return response()->json(['data' => $orders]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->where('freelancer_id', $request->user()->id)
            ->with('client:id,name,avatar,email,phone,location')
            ->with('service:id,title,image,description')
            ->with('reviews')
            ->with('conversation:id,order_id')
            ->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown Service',
                'type' => $order->type,
                'customMin' => $order->custom_min,
                'customMax' => $order->custom_max,
                'dealPrice' => $order->deal_price,
                'conversationId' => $order->conversation?->id,
                'price' => $order->price,
                'status' => $order->status,
                'message' => $order->message,
                'packageName' => $order->package_name,
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'deliverables' => $order->deliverables ?? [],
                'client' => [
                    'id' => $order->client->id,
                    'name' => $order->client->name,
                    'avatar' => $order->client->avatar,
                    'email' => $order->client->email,
                    'phone' => $order->client->phone,
                    'location' => $order->client->location,
                ],
                'service' => [
                    'id' => $order->service->id,
                    'title' => $order->service->title,
                    'image' => $order->service->image,
                    'description' => $order->service->description,
                ],
                'reviews' => $order->reviews,
            ],
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->where('freelancer_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|in:in_progress,completed,rejected',
        ]);

        $newStatus = $validated['status'];

        if ($newStatus === 'in_progress' && $order->status !== 'pending') {
            return response()->json(['message' => 'Hanya pesanan pending yang bisa diterima'], 422);
        }

        if ($newStatus === 'rejected' && $order->status !== 'pending') {
            return response()->json(['message' => 'Hanya pesanan pending yang bisa ditolak'], 422);
        }

        if ($newStatus === 'completed' && $order->status !== 'in_progress') {
            return response()->json(['message' => 'Hanya pesanan in_progress yang bisa diselesaikan'], 422);
        }

        $order->update(['status' => $newStatus]);

        if ($newStatus === 'completed') {
            TransactionService::settleOrder($order->id);
        }

        if ($newStatus === 'rejected') {
            TransactionService::refundOrder($order->id);
        }

        $statusMap = [
            'in_progress' => ['Pesanan Diterima', 'Pesananmu diterima oleh freelancer dan mulai dikerjakan.'],
            'completed' => ['Pesanan Selesai', 'Pesananmu telah diselesaikan oleh freelancer.'],
            'rejected' => ['Pesanan Ditolak', 'Sayangnya pesananmu ditolak oleh freelancer.'],
        ];
        [$title, $message] = $statusMap[$newStatus];
        NotificationService::send(
            $order->client_id,
            'order_update',
            $title,
            $message . ' (' . $order->order_code . ')',
            '/client/orders/' . $order->id,
        );

        $order->load('client:id,name,avatar', 'service:id,title', 'conversation:id,order_id');

        return response()->json([
            'data' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown Service',
                'type' => $order->type,
                'customMin' => $order->custom_min,
                'customMax' => $order->custom_max,
                'dealPrice' => $order->deal_price,
                'conversationId' => $order->conversation?->id,
                'price' => $order->price,
                'status' => $order->status,
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'clientName' => $order->client->name ?? 'Unknown',
                'clientAvatar' => $order->client->avatar,
            ],
        ]);
    }

    public function storeDeliverable(Request $request, string $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->where('freelancer_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'url' => 'required|string',
            'name' => 'nullable|string|max:255',
        ]);

        $deliverables = $order->deliverables ?? [];
        $deliverables[] = [
            'name' => $validated['name'] ?? 'File hasil',
            'url' => $validated['url'],
            'createdAt' => now()->toISOString(),
        ];

        $order->update(['deliverables' => $deliverables]);

        NotificationService::send(
            $order->client_id,
            'order_update',
            'File Hasil Terkirim',
            'Freelancer mengirim file hasil untuk ' . ($order->package_name ?? 'pesananmu') . '.',
            '/client/orders/' . $order->id,
        );

        return response()->json(['data' => $deliverables], 201);
    }
}
