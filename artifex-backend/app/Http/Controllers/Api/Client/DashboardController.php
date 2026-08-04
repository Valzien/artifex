<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $totalOrders = Order::where('client_id', $user->id)->count();
        $activeOrders = Order::where('client_id', $user->id)->whereIn('status', ['pending', 'in_progress'])->count();
        $completedOrders = Order::where('client_id', $user->id)->where('status', 'completed')->count();

        $recentOrders = Order::where('client_id', $user->id)
            ->with(['freelancer:id,name,avatar', 'service:id,title'])
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
                    'freelancer' => [
                        'id' => $order->freelancer->id,
                        'name' => $order->freelancer->name,
                        'avatar' => $order->freelancer->avatar,
                    ],
                ];
            });

        $recommendations = Service::where('status', 'active')
            ->with('user:id,name,avatar')
            ->inRandomOrder()
            ->take(2)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'price' => $service->price,
                    'freelancer' => [
                        'id' => $service->user->id,
                        'name' => $service->user->name,
                        'avatar' => $service->user->avatar,
                    ],
                ];
            });

        return response()->json([
            'data' => [
                'stats' => [
                    'totalOrders' => $totalOrders,
                    'activeOrders' => $activeOrders,
                    'completedOrders' => $completedOrders,
                ],
                'recentOrders' => $recentOrders,
                'recommendations' => $recommendations,
            ]
        ]);
    }
}
