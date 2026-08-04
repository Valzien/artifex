<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $freelancer = User::where('email', 'rina@artifex.id')->first();
        if (!$freelancer) return;

        $products = [
            [
                'user_id' => $freelancer->id,
                'category_id' => 6,
                'title' => 'Template Instagram Food & Beverage Pack',
                'description' => 'Koleksi 30 template Instagram untuk bisnis kuliner. Format PSD & Figma, mudah diedit.',
                'price' => 75000,
                'file_url' => 'https://drive.google.com/file/d/example1',
                'file_name' => 'template-ig-food.zip',
                'previews' => [
                    ['type' => 'image', 'url' => 'https://placehold.co/800x450/e2e8f0/64748b?text=Food+Template+1'],
                    ['type' => 'image', 'url' => 'https://placehold.co/800x450/e2e8f0/64748b?text=Food+Template+2'],
                    ['type' => 'video', 'url' => 'https://www.w3schools.com/html/mov_bbb.mp4'],
                ],
                'tags' => ['template', 'instagram', 'food'],
                'status' => 'active',
            ],
            [
                'user_id' => $freelancer->id,
                'category_id' => 6,
                'title' => 'UI Kit — Dashboard Admin Modern',
                'description' => 'UI Kit lengkap untuk dashboard admin. 50+ komponen, dark mode, responsive.',
                'price' => 150000,
                'file_url' => 'https://drive.google.com/file/d/example2',
                'file_name' => 'ui-kit-dashboard.zip',
                'previews' => [
                    ['type' => 'image', 'url' => 'https://placehold.co/800x450/e2e8f0/64748b?text=Dashboard+UI+1'],
                    ['type' => 'image', 'url' => 'https://placehold.co/800x450/e2e8f0/64748b?text=Dashboard+UI+2'],
                ],
                'tags' => ['ui-kit', 'dashboard', 'figma'],
                'status' => 'active',
            ],
            [
                'user_id' => $freelancer->id,
                'category_id' => 9,
                'title' => 'Intro Video Template — After Effects',
                'description' => 'Template intro After Effects untuk YouTube. Edit teks dan logo, export langsung.',
                'price' => 50000,
                'file_url' => 'https://drive.google.com/file/d/example3',
                'file_name' => 'intro-template.aep',
                'previews' => [
                    ['type' => 'video', 'url' => 'https://www.w3schools.com/html/mov_bbb.mp4'],
                ],
                'tags' => ['intro', 'after-effects', 'youtube'],
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
