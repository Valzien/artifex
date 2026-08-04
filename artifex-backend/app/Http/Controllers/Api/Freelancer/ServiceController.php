<?php

namespace App\Http\Controllers\Api\Freelancer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $services = Service::where('user_id', $request->user()->id)
            ->with(['category:id,name,slug', 'packages'])
            ->withCount('orders')
            ->latest()
            ->get()
            ->map(fn ($service) => $this->formatService($service));

        return response()->json(['data' => $services]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'delivery_days' => 'required|integer|min:1',
            'image' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'tags' => 'nullable|array',
            'packages' => 'nullable|array',
            'packages.*.name' => 'required_with:packages|string|max:255',
            'packages.*.price' => 'required_with:packages|numeric|min:0',
            'packages.*.description' => 'nullable|string',
            'packages.*.delivery_days' => 'required_with:packages|integer|min:1',
            'packages.*.popular' => 'nullable|boolean',
            'packages.*.features' => 'nullable|array',
        ]);

        $user = $request->user();

        $service = DB::transaction(function () use ($validated, $user) {
            $images = $validated['images'] ?? null;
            $service = Service::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category_id' => $validated['category_id'],
                'user_id' => $user->id,
                'price' => $validated['price'],
                'delivery_days' => $validated['delivery_days'],
                'image' => $images[0] ?? ($validated['image'] ?? null),
                'images' => $images,
                'tags' => $validated['tags'] ?? null,
            ]);

            if (!empty($validated['packages'])) {
                foreach ($validated['packages'] as $pkg) {
                    $service->packages()->create($pkg);
                }
            }

            return $service;
        });

        $service->load('category:id,name');
        $service->loadCount('orders');

        return response()->json(['data' => $this->formatService($service)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $service = Service::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'delivery_days' => 'sometimes|integer|min:1',
            'image' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'tags' => 'nullable|array',
            'packages' => 'nullable|array',
            'packages.*.name' => 'required_with:packages|string|max:255',
            'packages.*.price' => 'required_with:packages|numeric|min:0',
            'packages.*.description' => 'nullable|string',
            'packages.*.delivery_days' => 'required_with:packages|integer|min:1',
            'packages.*.popular' => 'nullable|boolean',
            'packages.*.features' => 'nullable|array',
        ]);

        DB::transaction(function () use ($service, $validated) {
            $service->update(collect($validated)->only([
                'title', 'description', 'category_id', 'price', 'delivery_days', 'tags',
            ])->toArray());

            if (array_key_exists('images', $validated)) {
                $images = $validated['images'] ?? null;
                $service->images = $images;
                $service->image = $images[0] ?? null;
                $service->save();
            } elseif (array_key_exists('image', $validated)) {
                $service->image = $validated['image'];
                $service->save();
            }

            if (array_key_exists('packages', $validated)) {
                $service->packages()->delete();
                if (!empty($validated['packages'])) {
                    foreach ($validated['packages'] as $pkg) {
                        $service->packages()->create($pkg);
                    }
                }
            }
        });

        $service->load('category:id,name');
        $service->load('packages');
        $service->loadCount('orders');

        return response()->json(['data' => $this->formatService($service)]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $service = Service::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $service->delete();

        return response()->json(['message' => 'Service deleted']);
    }

    private function formatService($service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'description' => $service->description,
            'category_id' => $service->category_id,
            'category' => $service->category->name ?? null,
            'price' => $service->price,
            'status' => $service->status,
            'orders' => $service->orders_count ?? 0,
            'rating' => $service->rating ?? 0,
            'reviews' => $service->reviews_count ?? 0,
            'deliveryDays' => $service->delivery_days,
            'image' => $service->image,
            'images' => $service->images ?? ($service->image ? [$service->image] : []),
            'packages' => $service->packages->map(fn ($pkg) => [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'price' => $pkg->price,
                'description' => $pkg->description,
                'deliveryDays' => $pkg->delivery_days,
                'popular' => (bool) $pkg->popular,
                'features' => $pkg->features ?? [],
            ]),
            'createdAt' => $service->created_at,
        ];
    }
}
