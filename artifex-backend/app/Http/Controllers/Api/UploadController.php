<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    private const ALLOWED_EXTENSIONS = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic', 'heif',
        'mp4', 'webm', 'mov', 'mkv', 'avi', 'wmv', '3gp',
        'pdf', 'zip', 'rar', '7z', 'psd', 'ai', 'fig', 'sketch', 'indd', 'xd',
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt',
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'size' => 'nullable|integer|min:0|max:20971520',
        ]);

        $extension = strtolower(pathinfo($validated['name'], PATHINFO_EXTENSION));

        if (! in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            return response()->json(['message' => 'Tipe file tidak didukung'], 422);
        }

        $key = 'uploads/'.Str::uuid().'.'.$extension;

        $options = [];
        if (! empty($validated['type'])) {
            $options['ContentType'] = $validated['type'];
        }

        $result = Storage::disk('r2')->temporaryUploadUrl($key, now()->addMinutes(10), $options);

        return response()->json([
            'data' => [
                'uploadUrl' => $result['url'],
                'url' => url('r2/'.$key),
                'key' => $key,
            ],
        ], 201);
    }
}
