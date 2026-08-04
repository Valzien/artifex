<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalUsers = User::count();
        $totalFreelancers = User::where('role', 'freelancer')->count();
        $totalClients = User::where('role', 'client')->count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('price');
        $pendingOrders = Order::where('status', 'pending')->count();

        $recentOrders = Order::with('client:id,name,avatar')
            ->with('freelancer:id,name,avatar')
            ->with('service:id,title')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'orderCode' => $order->order_code,
                    'serviceName' => $order->service->title ?? 'Unknown',
                    'price' => $order->price,
                    'status' => $order->status,
                    'createdAt' => $order->created_at,
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
            'data' => [
                'stats' => [
                    'totalUsers' => $totalUsers,
                    'totalFreelancers' => $totalFreelancers,
                    'totalClients' => $totalClients,
                    'totalOrders' => $totalOrders,
                    'totalRevenue' => $totalRevenue,
                    'pendingOrders' => $pendingOrders,
                ],
                'recentOrders' => $recentOrders,
            ],
        ]);
    }
}
