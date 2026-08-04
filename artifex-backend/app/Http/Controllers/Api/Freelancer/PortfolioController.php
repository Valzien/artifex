<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $portfolios = Portfolio::where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'description' => $p->description,
                    'category' => $p->category,
                    'image' => $p->image,
                    'media' => $p->media ?? [],
                    'createdAt' => $p->created_at,
                ];
            });

        return response()->json(['data' => $portfolios]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'media' => 'nullable|array',
            'media.*.type' => 'required_with:media|in:image,video,pdf',
            'media.*.url' => 'required_with:media|string',
            'media.*.name' => 'nullable|string',
        ]);

        $portfolio = Portfolio::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'] ?? null,
            'image' => $validated['image'] ?? null,
            'media' => $validated['media'] ?? null,
        ]);

        return response()->json([
            'data' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
                'description' => $portfolio->description,
                'category' => $portfolio->category,
                'image' => $portfolio->image,
                'media' => $portfolio->media ?? [],
                'createdAt' => $portfolio->created_at,
            ],
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $portfolio = Portfolio::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'media' => 'nullable|array',
            'media.*.type' => 'required_with:media|in:image,video,pdf',
            'media.*.url' => 'required_with:media|string',
            'media.*.name' => 'nullable|string',
        ]);

        $portfolio->update(collect($validated)->only([
            'title', 'description', 'category', 'image', 'media',
        ])->toArray());

        return response()->json([
            'data' => [
                'id' => $portfolio->id,
                'title' => $portfolio->title,
                'description' => $portfolio->description,
                'category' => $portfolio->category,
                'image' => $portfolio->image,
                'media' => $portfolio->media ?? [],
                'createdAt' => $portfolio->created_at,
            ],
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $portfolio = Portfolio::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $portfolio->delete();

        return response()->json(['message' => 'Portfolio item deleted']);
    }
}
