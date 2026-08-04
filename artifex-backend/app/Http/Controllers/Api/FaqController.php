<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all()->groupBy('category')->map(function ($items, $category) {
            return [
                'category' => $category,
                'items' => $items->map(function ($faq) {
                    return [
                        'question' => $faq->question,
                        'answer' => $faq->answer,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json(['data' => $faqs]);
    }
}
