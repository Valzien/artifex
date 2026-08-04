<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::withCount(['services', 'clientOrders', 'freelancerOrders']);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(15);

        $formattedUsers = collect($users->items())->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'location' => $user->location,
                'specialty' => $user->specialty,
                'isOnline' => $user->is_online,
                'createdAt' => $user->created_at,
                'servicesCount' => $user->services_count ?? 0,
                'clientOrdersCount' => $user->client_orders_count ?? 0,
                'freelancerOrdersCount' => $user->freelancer_orders_count ?? 0,
            ];
        });

        return response()->json([
            'data' => $formattedUsers,
            'meta' => [
                'currentPage' => $users->currentPage(),
                'lastPage' => $users->lastPage(),
                'perPage' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = User::withCount(['services', 'clientOrders', 'freelancerOrders', 'reviewsGiven', 'reviewsReceived'])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'location' => $user->location,
                'bio' => $user->bio,
                'specialty' => $user->specialty,
                'skills' => $user->skills ?? [],
                'isOnline' => $user->is_online,
                'createdAt' => $user->created_at,
                'servicesCount' => $user->services_count ?? 0,
                'clientOrdersCount' => $user->client_orders_count ?? 0,
                'freelancerOrdersCount' => $user->freelancer_orders_count ?? 0,
                'reviewsGivenCount' => $user->reviews_given_count ?? 0,
                'reviewsReceivedCount' => $user->reviews_received_count ?? 0,
            ],
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:client,freelancer,admin',
            'phone' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'specialty' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($user, $validated) {
            $user->update($validated);
        });

        $user->loadCount(['services', 'clientOrders', 'freelancerOrders']);

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'location' => $user->location,
                'specialty' => $user->specialty,
                'servicesCount' => $user->services_count ?? 0,
                'clientOrdersCount' => $user->client_orders_count ?? 0,
                'freelancerOrdersCount' => $user->freelancer_orders_count ?? 0,
            ],
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        DB::transaction(function () use ($user) {
            $user->delete();
        });

        return response()->json(['message' => 'User deleted successfully']);
    }
}
