<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::with('user:id,name,avatar')
            ->with('category:id,name,slug');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $services = $query->latest()->paginate(15);

        $formattedServices = collect($services->items())->map(function ($service) {
            return [
                'id' => $service->id,
                'title' => $service->title,
                'category' => $service->category->name ?? null,
                'price' => $service->price,
                'status' => $service->status,
                'deliveryDays' => $service->delivery_days,
                'createdAt' => $service->created_at,
                'freelancer' => [
                    'id' => $service->user->id,
                    'name' => $service->user->name,
                    'avatar' => $service->user->avatar,
                ],
            ];
        });

        return response()->json([
            'data' => $formattedServices,
            'meta' => [
                'currentPage' => $services->currentPage(),
                'lastPage' => $services->lastPage(),
                'perPage' => $services->perPage(),
                'total' => $services->total(),
            ],
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,rejected,pending',
        ]);

        DB::transaction(function () use ($service, $validated) {
            $service->update(['status' => $validated['status']]);
        });

        $service->load('user:id,name,avatar', 'category:id,name');

        return response()->json([
            'data' => [
                'id' => $service->id,
                'title' => $service->title,
                'category' => $service->category->name ?? null,
                'price' => $service->price,
                'status' => $service->status,
                'deliveryDays' => $service->delivery_days,
                'createdAt' => $service->created_at,
                'freelancer' => [
                    'id' => $service->user->id,
                    'name' => $service->user->name,
                    'avatar' => $service->user->avatar,
                ],
            ],
        ]);
    }
}
