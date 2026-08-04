<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        $ordersByMonth = Order::where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        $revenueByMonth = Transaction::where('type', 'earning')
            ->where('status', 'completed')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');

        $newUsersByMonth = User::where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        $formattedOrders = collect();
        $formattedRevenue = collect();
        $formattedUsers = collect();
        for ($i = 5; $i >= 0; $i--) {
            $monthKey = Carbon::now()->subMonths($i)->format('Y-m');
            $label = Carbon::now()->subMonths($i)->format('M');
            $formattedOrders->push(['month' => $label, 'count' => $ordersByMonth[$monthKey] ?? 0]);
            $formattedRevenue->push(['month' => $label, 'amount' => (float) ($revenueByMonth[$monthKey] ?? 0)]);
            $formattedUsers->push(['month' => $label, 'count' => $newUsersByMonth[$monthKey] ?? 0]);
        }

        $servicesByCategory = Service::with('category:id,name')
            ->get()
            ->groupBy('category_id')
            ->map(function ($services) {
                return [
                    'name' => $services->first()->category->name ?? 'Unknown',
                    'count' => $services->count(),
                ];
            })
            ->values()
            ->sortByDesc('count')
            ->values();

        $totalServices = Service::count();
        $servicesByCategory = $servicesByCategory->map(function ($cat) use ($totalServices) {
            return [
                ...$cat,
                'percentage' => $totalServices > 0 ? round(($cat['count'] / $totalServices) * 100, 1) : 0,
            ];
        });

        $topServices = Service::with('user:id,name')
            ->withCount('orders')
            ->orderByDesc('orders_count')
            ->take(5)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'freelancer' => $s->user->name,
                'orders' => $s->orders_count ?? 0,
                'price' => $s->price,
            ]);

        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();
        $completionRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 0;

        return response()->json([
            'data' => [
                'ordersByMonth' => $formattedOrders,
                'revenueByMonth' => $formattedRevenue,
                'newUsersByMonth' => $formattedUsers,
                'servicesByCategory' => $servicesByCategory,
                'topServices' => $topServices,
                'completionRate' => $completionRate,
                'totalUsers' => User::count(),
                'totalServices' => $totalServices,
                'totalOrders' => $totalOrders,
            ],
        ]);
    }
}
