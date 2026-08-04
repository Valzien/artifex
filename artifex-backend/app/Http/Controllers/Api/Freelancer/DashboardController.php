<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $totalOrders = Order::where('freelancer_id', $user->id)->count();
        $activeOrders = Order::where('freelancer_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress', 'revision'])
            ->count();
        $completedOrders = Order::where('freelancer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $reviewAgg = Review::where('freelancer_id', $user->id)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        $recentOrders = Order::where('freelancer_id', $user->id)
            ->with('client:id,name,avatar')
            ->with('service:id,title')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'orderCode' => $order->order_code,
                    'serviceName' => $order->service->title ?? 'Unknown Service',
                    'price' => $order->price,
                    'status' => $order->status,
                    'createdAt' => $order->created_at,
                    'deadline' => $order->deadline,
                    'clientName' => $order->client->name ?? 'Unknown',
                    'clientAvatar' => $order->client->avatar,
                ];
            });

        $topServices = Service::where('user_id', $user->id)
            ->withCount(['orders as orders'])
            ->withSum('orders as revenue', 'price')
            ->orderByDesc('orders')
            ->take(3)
            ->get()
            ->map(function ($service) {
                return [
                    'name' => $service->title,
                    'orders' => $service->orders ?? 0,
                    'revenue' => $service->orders_revenue ?? 0,
                ];
            });

        return response()->json([
            'data' => [
                'stats' => [
                    'totalOrders' => $totalOrders,
                    'activeOrders' => $activeOrders,
                    'completedOrders' => $completedOrders,
                    'rating' => $reviewAgg->avg_rating ? round($reviewAgg->avg_rating, 1) : 0,
                    'reviewCount' => (int) $reviewAgg->review_count,
                ],
                'recentOrders' => $recentOrders,
                'topServices' => $topServices,
            ],
        ]);
    }
}
