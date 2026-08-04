<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Models\Service;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        $ordersByMonth = Order::where('freelancer_id', $user->id)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        $earningsByMonth = Transaction::where('user_id', $user->id)
            ->where('type', 'earning')
            ->where('status', 'completed')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');

        $formattedOrdersByMonth = collect();
        $formattedEarningsByMonth = collect();
        for ($i = 5; $i >= 0; $i--) {
            $monthKey = Carbon::now()->subMonths($i)->format('Y-m');
            $formattedOrdersByMonth->push([
                'month' => Carbon::now()->subMonths($i)->format('M'),
                'count' => $ordersByMonth[$monthKey] ?? 0,
            ]);
            $formattedEarningsByMonth->push([
                'month' => Carbon::now()->subMonths($i)->format('M'),
                'amount' => (float) ($earningsByMonth[$monthKey] ?? 0),
            ]);
        }

        $totalOrders = Order::where('freelancer_id', $user->id)->count();

        $topCategories = Service::where('user_id', $user->id)
            ->with('category:id,name')
            ->get()
            ->groupBy('category_id')
            ->map(function ($services, $categoryId) use ($totalOrders) {
                $count = $services->sum(fn ($s) => $s->orders()->count());
                return [
                    'category_id' => $categoryId,
                    'name' => $services->first()->category->name ?? 'Unknown',
                    'percentage' => $totalOrders > 0 ? round(($count / $totalOrders) * 100, 1) : 0,
                ];
            })
            ->values()
            ->sortByDesc('percentage')
            ->values();

        $completedOrders = Order::where('freelancer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $conversionRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 0;

        $averageRating = Review::where('freelancer_id', $user->id)
            ->avg('rating');

        $uniqueClients = Order::where('freelancer_id', $user->id)
            ->distinct('client_id')
            ->count('client_id');

        $repeatClients = Order::where('freelancer_id', $user->id)
            ->select('client_id')
            ->groupBy('client_id')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        $repeatClientRate = $uniqueClients > 0 ? round(($repeatClients / $uniqueClients) * 100, 1) : 0;

        return response()->json([
            'data' => [
                'ordersByMonth' => $formattedOrdersByMonth,
                'earningsByMonth' => $formattedEarningsByMonth,
                'topCategories' => $topCategories,
                'conversionRate' => $conversionRate,
                'averageRating' => $averageRating ? round($averageRating, 1) : 0,
                'repeatClientRate' => $repeatClientRate,
            ],
        ]);
    }
}
