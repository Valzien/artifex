<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('services')->get()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'description' => $cat->description,
                'icon' => $cat->icon,
                'serviceCount' => $cat->services_count ?? 0,
            ];
        });

        return response()->json(['data' => $categories]);
    }

    public function show($slug)
    {
        $category = Category::withCount('services')->where('slug', $slug)->first();

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'serviceCount' => $category->services_count ?? 0,
            ],
        ]);
    }
}
