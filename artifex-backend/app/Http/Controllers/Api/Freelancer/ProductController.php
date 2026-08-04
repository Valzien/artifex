<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    private function serialize($product): array
    {
        return [
            'id' => $product->id,
            'title' => $product->title,
            'description' => $product->description,
            'category_id' => $product->category_id,
            'category' => $product->category->name ?? null,
            'price' => $product->price,
            'file_url' => $product->file_url,
            'file_name' => $product->file_name,
            'previews' => $product->previews ?? [],
            'tags' => $product->tags ?? [],
            'status' => $product->status,
            'downloads' => $product->productOrders()->where('status', 'completed')->count(),
            'createdAt' => $product->created_at,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $products = Product::where('user_id', $request->user()->id)
            ->with('category:id,name,slug')
            ->latest()
            ->get()
            ->map(fn ($product) => $this->serialize($product));

        return response()->json(['data' => $products]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'file_url' => 'nullable|string',
            'file_name' => 'nullable|string',
            'previews' => 'nullable|array',
            'previews.*.type' => 'required_with:previews|in:image,video',
            'previews.*.url' => 'required_with:previews|string',
            'tags' => 'nullable|array',
            'status' => 'nullable|in:active,draft',
        ]);

        $product = Product::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'file_url' => $validated['file_url'] ?? null,
            'file_name' => $validated['file_name'] ?? null,
            'previews' => $validated['previews'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        $product->load('category:id,name');

        return response()->json(['data' => $this->serialize($product)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'file_url' => 'nullable|string',
            'file_name' => 'nullable|string',
            'previews' => 'nullable|array',
            'previews.*.type' => 'required_with:previews|in:image,video',
            'previews.*.url' => 'required_with:previews|string',
            'tags' => 'nullable|array',
            'status' => 'sometimes|in:active,draft',
        ]);

        $product->update(collect($validated)->only([
            'title', 'description', 'category_id', 'price', 'file_url', 'file_name',
            'previews', 'tags', 'status',
        ])->toArray());

        $product->load('category:id,name');

        return response()->json(['data' => $this->serialize($product)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $product = Product::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
