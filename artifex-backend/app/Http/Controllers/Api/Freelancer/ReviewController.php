<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::where('freelancer_id', $request->user()->id)
            ->with('user:id,name,avatar')
            ->with('order:id,service_id')
            ->with('order.service:id,title')
            ->latest()
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'clientName' => $r->user->name ?? 'Anonymous',
                    'clientAvatar' => $r->user->avatar,
                    'serviceName' => $r->order->service->title ?? 'Unknown Service',
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'date' => $r->created_at,
                ];
            });

        return response()->json(['data' => $reviews]);
    }
}
