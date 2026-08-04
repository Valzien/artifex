<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Favorite;

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Favorite::where('user_id', auth()->id())
            ->with(['service.user:id,name,avatar', 'service.category:id,name,slug'])
            ->latest()
            ->get()
            ->pluck('service')
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'category' => $service->category->name ?? null,
                    'freelancer' => [
                        'id' => $service->user->id,
                        'name' => $service->user->name,
                        'rating' => $service->user->rating ?? 0,
                        'reviews' => $service->user->reviews_count ?? 0,
                    ],
                    'price' => $service->price,
                    'image' => $service->image,
                    'tags' => $service->tags ?? [],
                    'deliveryDays' => $service->delivery_days,
                ];
            });
        return response()->json(['data' => $favorites]);
    }

    public function toggle($serviceId)
    {
        $existing = Favorite::where('user_id', auth()->id())->where('service_id', $serviceId)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['data' => ['isFavorite' => false], 'message' => 'Dihapus dari favorit']);
        }

        Favorite::create(['user_id' => auth()->id(), 'service_id' => $serviceId]);
        return response()->json(['data' => ['isFavorite' => true], 'message' => 'Ditambahkan ke favorit'], 201);
    }
}
