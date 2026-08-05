<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::where('status', 'active')
            ->with(['user:id,name,avatar', 'category:id,name,slug']);

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $services = $query->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'title' => $service->title,
                'category' => $service->category->name ?? null,
                'freelancer' => [
                    'id' => $service->user->id,
                    'name' => $service->user->name,
                    'avatar' => $service->user->avatar,
                    'rating' => $service->user->rating ?? 0,
                    'reviews' => $service->user->reviews_count ?? 0,
                ],
                'price' => $service->price,
                'image' => $service->images[0] ?? $service->image,
                'tags' => $service->tags ?? [],
                'deliveryDays' => $service->delivery_days,
            ];
        });

        return response()->json(['data' => $services]);
    }

    public function show($id)
    {
        $service = Service::with(['user:id,name,avatar', 'category:id,name,slug', 'packages'])
            ->where('status', 'active')
            ->find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $data = [
            'id' => $service->id,
            'title' => $service->title,
            'category' => $service->category->name ?? null,
            'freelancer' => [
                'id' => $service->user->id,
                'name' => $service->user->name,
                'avatar' => $service->user->avatar,
                'rating' => $service->user->rating ?? 0,
                'reviews' => $service->user->reviews_count ?? 0,
            ],
            'price' => $service->price,
            'image' => $service->images[0] ?? $service->image,
            'images' => $service->images ?: ($service->image ? [$service->image] : []),
            'tags' => $service->tags ?? [],
            'deliveryDays' => $service->delivery_days,
            'packages' => $service->packages->map(function ($pkg) {
                return [
                    'id' => $pkg->id,
                    'name' => $pkg->name,
                    'description' => $pkg->description,
                    'price' => $pkg->price,
                    'deliveryDays' => $pkg->delivery_days,
                    'features' => $pkg->features ?? [],
                ];
            }),
        ];

        return response()->json(['data' => $data]);
    }

    public function detail($id)
    {
        $service = Service::with([
            'user:id,name,avatar,bio,location',
            'packages',
            'category:id,name,slug',
            'reviews.user:id,name,avatar',
        ])
            ->where('status', 'active')
            ->find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $freelancer = $service->user;
        $reviewsCount = $service->reviews->count();
        $completedOrders = $freelancer->freelancerOrders()->where('status', 'completed')->count();

        $data = [
            'id' => $service->id,
            'title' => $service->title,
            'description' => $service->description,
            'category' => $service->category->name ?? null,
            'price' => $service->price,
            'image' => $service->images[0] ?? $service->image,
            'images' => $service->images ?: ($service->image ? [$service->image] : []),
            'tags' => $service->tags ?? [],
            'deliveryDays' => $service->delivery_days,
            'packages' => $service->packages->map(function ($pkg) {
                return [
                    'id' => $pkg->id,
                    'name' => $pkg->name,
                    'description' => $pkg->description,
                    'price' => $pkg->price,
                    'deliveryDays' => $pkg->delivery_days,
                    'features' => $pkg->features ?? [],
                ];
            }),
            'freelancer' => [
                'id' => $freelancer->id,
                'name' => $freelancer->name,
                'avatar' => $freelancer->avatar,
                'rating' => $reviewsCount > 0 ? round($service->reviews->avg('rating'), 1) : 0,
                'reviewsCount' => $reviewsCount,
                'completedOrders' => $completedOrders,
                'responseTime' => $freelancer->response_time ?? null,
                'location' => $freelancer->location ?? null,
                'memberSince' => $freelancer->created_at,
                'bio' => $freelancer->bio ?? null,
            ],
            'reviews' => $service->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'userName' => $review->user->name ?? 'Anonymous',
                    'clientAvatar' => $review->user->avatar ?? null,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'createdAt' => $review->created_at,
                ];
            }),
        ];

        return response()->json(['data' => $data]);
    }
}
