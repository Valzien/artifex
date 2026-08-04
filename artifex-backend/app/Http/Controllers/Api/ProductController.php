<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::where('status', 'active')
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

        if ($request->filled('freelancer_id')) {
            $query->where('user_id', $request->freelancer_id);
        }

        $products = $query->latest()->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'category' => $product->category->name ?? null,
                'price' => $product->price,
                'previews' => $product->previews ?? [],
                'freelancer' => [
                    'id' => $product->user->id,
                    'name' => $product->user->name,
                    'avatar' => $product->user->avatar,
                ],
                'downloads' => $product->productOrders()->where('status', 'completed')->count(),
                'createdAt' => $product->created_at,
            ];
        });

        return response()->json(['data' => $products]);
    }

    public function show(string $id): JsonResponse
    {
        $product = Product::with(['user:id,name,avatar,bio,location', 'category:id,name,slug'])
            ->where('status', 'active')
            ->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $data = [
            'id' => $product->id,
            'title' => $product->title,
            'description' => $product->description,
            'category' => $product->category->name ?? null,
            'price' => $product->price,
            'file_name' => $product->file_name,
            'previews' => $product->previews ?? [],
            'tags' => $product->tags ?? [],
            'freelancer' => [
                'id' => $product->user->id,
                'name' => $product->user->name,
                'avatar' => $product->user->avatar,
                'bio' => $product->user->bio,
                'location' => $product->user->location,
            ],
            'downloads' => $product->productOrders()->where('status', 'completed')->count(),
            'createdAt' => $product->created_at,
        ];

        return response()->json(['data' => $data]);
    }
}
