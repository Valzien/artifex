<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $totalOrders = $user->clientOrders()->count();
        $activeOrders = $user->clientOrders()->whereIn('status', ['pending', 'in_progress'])->count();
        $completedOrders = $user->clientOrders()->where('status', 'completed')->count();
        $totalSpent = $user->clientOrders()->where('status', 'completed')->sum('price');
        
        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $user->location,
                'bio' => $user->bio,
                'skills' => $user->skills ?? [],
                'memberSince' => $user->member_since ?? $user->created_at,
                'avatar' => $user->avatar,
                'stats' => [
                    'totalOrders' => $totalOrders,
                    'activeOrders' => $activeOrders,
                    'completedOrders' => $completedOrders,
                    'totalSpent' => $totalSpent,
                ],
            ],
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
            'skills' => 'sometimes|array',
            'skills.*' => 'string',
        ]);
        $user->update($validated);
        
        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $user->location,
                'bio' => $user->bio,
                'skills' => $user->skills ?? [],
                'memberSince' => $user->member_since ?? $user->created_at,
                'avatar' => $user->avatar,
            ],
            'message' => 'Profil berhasil diperbarui',
        ]);
    }
}
