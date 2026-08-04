<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(): JsonResponse
    {
        $faqs = Faq::orderBy('category')->orderBy('sort_order')
            ->get()
            ->map(fn ($f) => $this->format($f));

        return response()->json(['data' => $faqs]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'sortOrder' => 'nullable|integer',
        ]);

        $faq = Faq::create([
            'category' => $validated['category'],
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'sort_order' => $validated['sortOrder'] ?? 0,
        ]);

        return response()->json(['data' => $this->format($faq)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'category' => 'sometimes|string|max:255',
            'question' => 'sometimes|string|max:255',
            'answer' => 'sometimes|string',
            'sortOrder' => 'sometimes|integer',
        ]);

        $faq->update([
            'category' => $validated['category'] ?? $faq->category,
            'question' => $validated['question'] ?? $faq->question,
            'answer' => $validated['answer'] ?? $faq->answer,
            'sort_order' => $validated['sortOrder'] ?? $faq->sort_order,
        ]);

        return response()->json(['data' => $this->format($faq)]);
    }

    public function destroy(string $id): JsonResponse
    {
        Faq::findOrFail($id)->delete();

        return response()->json(['message' => 'FAQ deleted successfully']);
    }

    private function format(Faq $faq): array
    {
        return [
            'id' => $faq->id,
            'category' => $faq->category,
            'question' => $faq->question,
            'answer' => $faq->answer,
            'sortOrder' => $faq->sort_order,
        ];
    }
}
