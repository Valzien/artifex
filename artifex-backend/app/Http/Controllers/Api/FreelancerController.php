<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class FreelancerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'freelancer')
            ->withCount('services')
            ->withCount('reviewsReceived')
            ->withAvg('reviewsReceived', 'rating')
            ->withCount(['freelancerOrders' => fn ($q) => $q->where('status', 'completed')]);

        if ($request->filled('specialty')) {
            $query->where('specialty', $request->specialty);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%")
                  ->orWhere('specialty', 'like', "%{$search}%");
            });
        }

        $freelancers = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'specialty' => $user->specialty,
                'rating' => round((float) ($user->reviews_received_avg_rating ?? 0), 1),
                'reviews' => (int) ($user->reviews_received_count ?? 0),
                'completedOrders' => (int) ($user->freelancer_orders_count ?? 0),
                'location' => $user->location,
                'bio' => $user->bio,
                'skills' => $user->skills ?? [],
                'isOnline' => $user->is_online,
                'servicesCount' => $user->services_count ?? 0,
            ];
        });

        return response()->json(['data' => $freelancers]);
    }

    public function show($id)
    {
        $user = User::where('role', 'freelancer')
            ->with([
                'services' => function ($q) {
                    $q->with('category:id,name,slug');
                    $q->withCount('reviews');
                    $q->where('status', 'active');
                },
                'portfolios',
                'reviewsReceived' => function ($q) {
                    $q->with(['user:id,name,avatar', 'order.service:id,title']);
                },
            ])
            ->find($id);

        if (!$user) {
            return response()->json(['message' => 'Freelancer tidak ditemukan'], 404);
        }

        $services = $user->services->map(function ($service) {
            return [
                'id' => $service->id,
                'title' => $service->title,
                'price' => $service->price,
                'rating' => $service->rating ?? 0,
                'reviews' => $service->reviews_count ?? 0,
                'category' => $service->category->name ?? null,
            ];
        });

        $portfolio = $user->portfolios->map(function ($p) {
            return [
                'id' => $p->id,
                'title' => $p->title,
                'description' => $p->description,
                'image' => $p->image,
            ];
        });

        $reviews = $user->reviewsReceived;
        $reviewsCount = $reviews->count();
        $avgRating = $reviewsCount > 0 ? round($reviews->avg('rating'), 1) : 0;
        $completedOrders = $user->freelancerOrders()->where('status', 'completed')->count();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'specialty' => $user->specialty,
                'rating' => $avgRating,
                'reviewCount' => $reviewsCount,
                'completedOrders' => $completedOrders,
                'location' => $user->location,
                'bio' => $user->bio,
                'skills' => $user->skills ?? [],
                'isOnline' => $user->is_online,
                'languages' => $user->languages ?? [],
                'responseTime' => $user->response_time,
                'lastDelivery' => $user->last_delivery,
                'memberSince' => $user->member_since ?? $user->created_at,
                'repeatClients' => $user->repeat_clients,
                'services' => $services,
                'portfolio' => $portfolio,
                'reviews' => $reviews->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'user' => $r->user->name ?? 'Anonymous',
                        'clientAvatar' => $r->user->avatar ?? null,
                        'service' => $r->order->service->title ?? 'Unknown Service',
                        'rating' => $r->rating,
                        'comment' => $r->comment,
                        'date' => $r->created_at,
                    ];
                }),
            ],
        ]);
    }
}
