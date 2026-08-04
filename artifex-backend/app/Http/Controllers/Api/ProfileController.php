<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return response()->json([
            'data' => $this->payload($user),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'bio' => 'sometimes|nullable|string',
            'avatar' => 'sometimes|nullable|string',
            'specialty' => 'sometimes|nullable|string|max:255',
            'response_time' => 'sometimes|nullable|string|max:255',
            'skills' => 'sometimes|array',
            'skills.*' => 'string',
            'languages' => 'sometimes|array',
            'languages.*' => 'string',
        ]);
        $user->update($validated);

        return response()->json([
            'data' => $this->payload($user),
            'message' => 'Profil berhasil diperbarui',
        ]);
    }

    private function payload($user)
    {
        $profile = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone' => $user->phone,
            'location' => $user->location,
            'bio' => $user->bio,
            'avatar' => $user->avatar,
            'specialty' => $user->specialty,
            'skills' => $user->skills ?? [],
            'languages' => $user->languages ?? [],
            'responseTime' => $user->response_time,
            'memberSince' => $user->member_since ?? $user->created_at,
        ];

        if ($user->isFreelancer()) {
            $profile['stats'] = [
                'totalServices' => $user->services()->count(),
                'totalPortfolio' => $user->portfolios()->count(),
                'activeOrders' => $user->freelancerOrders()
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->count(),
                'completedOrders' => $user->freelancerOrders()
                    ->where('status', 'completed')
                    ->count(),
                'totalEarnings' => $user->freelancerOrders()
                    ->where('status', 'completed')
                    ->sum('price'),
                'rating' => round((float) $user->reviewsReceived()->avg('rating') ?? 0, 1),
                'reviews' => $user->reviewsReceived()->count(),
                'repeatClients' => $user->repeat_clients ?? 0,
            ];
        } else {
            $profile['stats'] = [
                'totalOrders' => $user->clientOrders()->count(),
                'activeOrders' => $user->clientOrders()
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->count(),
                'completedOrders' => $user->clientOrders()
                    ->where('status', 'completed')
                    ->count(),
                'totalSpent' => $user->clientOrders()
                    ->where('status', 'completed')
                    ->sum('price'),
            ];
        }

        return $profile;
    }
}
