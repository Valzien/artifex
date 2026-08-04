<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Art Commission', 'slug' => 'art-commission', 'description' => 'Ilustrasi digital, character design, fan art, dan karya seni lainnya', 'icon' => '🎨', 'service_count' => 234],
            ['name' => 'Live2D Rigging', 'slug' => 'live2d-rigging', 'description' => 'Rigging model Live2D untuk Vtuber dan animasi interaktif', 'icon' => '🎭', 'service_count' => 45],
            ['name' => 'Copywriting', 'slug' => 'copywriting', 'description' => 'Artikel, landing page, script iklan, dan konten tertulis lainnya', 'icon' => '✍️', 'service_count' => 312],
            ['name' => 'Video Editing', 'slug' => 'video-editing', 'description' => 'Editing video YouTube, iklan, profil perusahaan, dan lainnya', 'icon' => '🎬', 'service_count' => 189],
            ['name' => 'Voice Over', 'slug' => 'voice-over', 'description' => 'Narasi, iklan radio, dubbing, dan pengisi suara profesional', 'icon' => '🎙️', 'service_count' => 156],
            ['name' => 'Graphic Design', 'slug' => 'graphic-design', 'description' => 'Logo, branding, poster, UI/UX design, dan materi visual', 'icon' => '🖌️', 'service_count' => 478],
            ['name' => 'Web Development', 'slug' => 'web-development', 'description' => 'Website responsif, web app, e-commerce, dan landing page', 'icon' => '💻', 'service_count' => 267],
            ['name' => 'Social Media Management', 'slug' => 'social-media-management', 'description' => 'Manajemen konten, strategi, dan optimasi media sosial', 'icon' => '📱', 'service_count' => 198],
            ['name' => 'Motion Graphics & Animation', 'slug' => 'motion-graphics', 'description' => 'Animasi 2D/3D, motion graphics, explainer video, dan intro', 'icon' => '✨', 'service_count' => 134],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
