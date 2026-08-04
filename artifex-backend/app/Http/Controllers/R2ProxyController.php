<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class R2ProxyController extends Controller
{
    public function show(string $path): StreamedResponse
    {
        $disk = Storage::disk('r2');

        if (! $disk->exists($path)) {
            abort(404);
        }

        $stream = $disk->readStream($path);

        return response()->stream(function () use ($stream) {
            if (is_resource($stream)) {
                fpassthru($stream);
                fclose($stream);
            }
        }, 200, [
            'Content-Type' => $this->mimeType($disk, $path),
            'Content-Length' => (string) $this->size($disk, $path),
            'Cache-Control' => 'public, max-age=31536000, immutable',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function mimeType(Filesystem $disk, string $path): string
    {
        try {
            return $disk->mimeType($path) ?: 'application/octet-stream';
        } catch (\Throwable) {
            return 'application/octet-stream';
        }
    }

    private function size(Filesystem $disk, string $path): int
    {
        try {
            return (int) $disk->size($path);
        } catch (\Throwable) {
            return 0;
        }
    }
}
