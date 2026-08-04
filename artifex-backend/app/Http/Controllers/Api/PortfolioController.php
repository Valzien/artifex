<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Portfolio::with('user:id,name,avatar,specialty,location')
            ->whereHas('user', fn ($q) => $q->where('role', 'freelancer'));

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $portfolios = $query->latest()
            ->get()
            ->map(fn ($p) => $this->format($p));

        return response()->json(['data' => $portfolios]);
    }

    public function show(string $id): JsonResponse
    {
        $portfolio = Portfolio::with([
            'user:id,name,avatar,specialty,location,bio',
            'user.services:id,user_id,title,price,category_id,image',
        ])->findOrFail($id);

        $data = $this->format($portfolio);
        $data['freelancer'] = $portfolio->user ? [
            'id' => $portfolio->user->id,
            'name' => $portfolio->user->name,
            'avatar' => $portfolio->user->avatar,
            'specialty' => $portfolio->user->specialty,
            'location' => $portfolio->user->location,
            'bio' => $portfolio->user->bio,
            'services' => ($portfolio->user->services ?? collect())
                ->where('status', 'active')
                ->values()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'title' => $s->title,
                    'price' => $s->price,
                    'image' => $s->image,
                ]),
        ] : null;

        return response()->json(['data' => $data]);
    }

    private function format(Portfolio $portfolio): array
    {
        return [
            'id' => $portfolio->id,
            'title' => $portfolio->title,
            'description' => $portfolio->description,
            'category' => $portfolio->category,
            'image' => $portfolio->image,
            'media' => $portfolio->media ?? [],
            'createdAt' => $portfolio->created_at,
            'freelancer' => $portfolio->user ? [
                'id' => $portfolio->user->id,
                'name' => $portfolio->user->name,
                'avatar' => $portfolio->user->avatar,
                'specialty' => $portfolio->user->specialty,
                'location' => $portfolio->user->location,
            ] : null,
        ];
    }
}
