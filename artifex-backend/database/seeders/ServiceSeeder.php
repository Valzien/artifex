<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $freelancers = User::where('role', 'freelancer')->get();

        $services = [
            [
                'freelancer_name' => 'Rina S.',
                'title' => 'Desain Logo Profesional untuk Brand Kamu',
                'category_slug' => 'graphic-design',
                'price' => 250000,
                'delivery_days' => 3,
                'description' => 'Saya akan membuatkan desain logo profesional yang merepresentasikan brand kamu. Termasuk 3 konsep logo, revisi unlimited, dan file source lengkap (AI, EPS, PNG, JPG, SVG).',
                'tags' => ['Logo', 'Branding', 'Identity'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 250000, 'description' => '1 konsep logo + file PNG & JPG', 'delivery_days' => 3, 'features' => ['1 Konsep Logo', 'File PNG & JPG', '1x Revisi'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 350000, 'description' => '2 konsep logo + file lengkap', 'delivery_days' => 5, 'features' => ['2 Konsep Logo', 'File Lengkap (AI, EPS, PNG, JPG, SVG)', '3x Revisi'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 500000, 'description' => '3 konsep logo + brand kit', 'delivery_days' => 7, 'features' => ['3 Konsep Logo', 'File Lengkap + Source', 'Brand Guidelines', 'Unlimited Revisi'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Dimas P.',
                'title' => 'Edit Video YouTube 4K dengan Color Grading',
                'category_slug' => 'video-editing',
                'price' => 150000,
                'delivery_days' => 2,
                'description' => 'Saya akan mengedit video YouTube kamu dengan kualitas 4K, termasuk color grading, transisi, lower third, dan thumbnail. Cocok untuk vlog, tutorial, atau review.',
                'tags' => ['YouTube', '4K', 'Color Grading'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 150000, 'description' => 'Video 5 menit, color grading, transisi', 'delivery_days' => 2, 'features' => ['Video 5 Menit', 'Color Grading', 'Transisi Dasar'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 300000, 'description' => 'Video 10 menit + thumbnail', 'delivery_days' => 3, 'features' => ['Video 10 Menit', 'Color Grading', 'Transisi & Effect', 'Thumbnail'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 500000, 'description' => 'Video 20 menit + semua fitur', 'delivery_days' => 5, 'features' => ['Video 20 Menit', 'Color Grading', 'Transisi & Effect', 'Thumbnail', 'Lower Third', 'Intro & Outro'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Anisa K.',
                'title' => 'Copywriting Landing Page yang Konversi',
                'category_slug' => 'copywriting',
                'price' => 350000,
                'delivery_days' => 4,
                'description' => 'Saya akan menulis copywriting landing page yang dirancang untuk meningkatkan konversi. Research target audience, headline yang compelling, dan CTA yang efektif.',
                'tags' => ['Landing Page', 'SEO', 'Sales'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 350000, 'description' => 'Landing page 500 kata', 'delivery_days' => 4, 'features' => ['500 Kata', 'Headline & Subheadline', 'CTA Optimized', '1x Revisi'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 500000, 'description' => 'Landing page 1000 kata + SEO', 'delivery_days' => 5, 'features' => ['1000 Kata', 'SEO Optimized', 'A/B Testing Copy', '3x Revisi'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 750000, 'description' => 'Full funnel copywriting', 'delivery_days' => 7, 'features' => ['2000+ Kata', 'Full Funnel Copy', 'Email Sequence', 'Unlimited Revisi'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Yuki T.',
                'title' => 'Rigging Live2D Model Vtuber',
                'category_slug' => 'live2d-rigging',
                'price' => 2000000,
                'delivery_days' => 14,
                'description' => 'Rigging model Live2D profesional untuk Vtuber. Termasuk tracking mata, mulut, head, dan body. Compatible dengan VTube Studio, PrprLive, dan software lainnya.',
                'tags' => ['Live2D', 'Vtuber', 'Animation'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 2000000, 'description' => 'Head + mouth tracking', 'delivery_days' => 14, 'features' => ['Head Tracking', 'Mouth Tracking', 'Eye Tracking', '2x Revisi'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 3500000, 'description' => 'Full body rigging', 'delivery_days' => 21, 'features' => ['Full Body Rigging', 'Physics Simulation', 'Gesture Control', '3x Revisi'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 5000000, 'description' => 'Full body + expressions', 'delivery_days' => 30, 'features' => ['Full Body Rigging', 'Custom Expressions', 'Physics Simulation', 'Facial Tracking', 'Unlimited Revisi'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Maya L.',
                'title' => 'Voice Over Profesional Bahasa Indonesia',
                'category_slug' => 'voice-over',
                'price' => 100000,
                'delivery_days' => 1,
                'description' => 'Narasi dan voice over profesional untuk iklan, video, e-learning, dan konten digital. Suara jernih, ekspresif, dan bisa menyesuaikan gaya.',
                'tags' => ['VO', 'Narasi', 'Iklan'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 100000, 'description' => '60 detik narasi', 'delivery_days' => 1, 'features' => ['60 Detik Narasi', 'File MP3', '1x Revisi'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 250000, 'description' => '3 menit + mixing', 'delivery_days' => 2, 'features' => ['3 Menit Narasi', 'Audio Mixing', 'File WAV & MP3', '3x Revisi'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 500000, 'description' => '10 menit + mastering', 'delivery_days' => 3, 'features' => ['10 Menit Narasi', 'Audio Mastering', 'Sound Effects', 'File WAV & MP3', 'Unlimited Revisi'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Fajar A.',
                'title' => 'Web Development React + Tailwind',
                'category_slug' => 'web-development',
                'price' => 5000000,
                'delivery_days' => 21,
                'description' => 'Membangun website modern dengan React dan Tailwind CSS. Responsive, fast, dan SEO-friendly. Cocok untuk landing page, company profile, atau web app.',
                'tags' => ['React', 'Tailwind', 'Fullstack'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 5000000, 'description' => 'Landing page responsif', 'delivery_days' => 14, 'features' => ['Landing Page', 'Responsive Design', 'Basic SEO', 'Deployment'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 10000000, 'description' => 'Multi-page website', 'delivery_days' => 21, 'features' => ['Multi-page Website', 'Responsive Design', 'CMS Integration', 'SEO Optimized', 'Deployment'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 20000000, 'description' => 'Full web app', 'delivery_days' => 30, 'features' => ['Full Web App', 'Backend & Database', 'Authentication', 'API Integration', 'Admin Panel', 'Deployment'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Rina S.',
                'title' => 'Art Commission Character Design',
                'category_slug' => 'art-commission',
                'price' => 500000,
                'delivery_days' => 7,
                'description' => 'Ilustrasi character design profesional dengan gaya semi-realistic. Cocok untuk visual novel, game, atau personal use.',
                'tags' => ['Character', 'Illustration', 'Digital Art'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 500000, 'description' => 'Bust up, background putih', 'delivery_days' => 7, 'features' => ['Bust Up', 'Background Putih', 'File PNG HD', '1x Revisi'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 800000, 'description' => 'Half body + background simple', 'delivery_days' => 10, 'features' => ['Half Body', 'Background Simple', 'File PNG HD + PSD', '3x Revisi'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 1500000, 'description' => 'Full body + detail background', 'delivery_days' => 14, 'features' => ['Full Body', 'Detail Background', 'File PNG HD + PSD + AI', 'Unlimited Revisi'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Dimas P.',
                'title' => 'Social Media Management 30 Hari',
                'category_slug' => 'social-media-management',
                'price' => 1500000,
                'delivery_days' => 30,
                'description' => 'Manajemen lengkap akun media sosial selama 30 hari. Termasuk content plan, pembuatan konten, scheduling, dan analytics report.',
                'tags' => ['Instagram', 'TikTok', 'Content Plan'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 1500000, 'description' => '1 platform, 12 postingan', 'delivery_days' => 30, 'features' => ['1 Platform', '12 Postingan', 'Content Calendar', 'Analytics Report'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 3000000, 'description' => '2 platform, 24 postingan', 'delivery_days' => 30, 'features' => ['2 Platform', '24 Postingan', 'Content Calendar', 'Engagement Management', 'Analytics Report'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 5000000, 'description' => '3 platform, 30 postingan + ads', 'delivery_days' => 30, 'features' => ['3 Platform', '30 Postingan', 'Content Calendar', 'Engagement Management', 'Ad Management', 'Analytics Report'], 'popular' => false],
                ],
            ],
            [
                'freelancer_name' => 'Yuki T.',
                'title' => 'Motion Graphics Intro Video 30 Detik',
                'category_slug' => 'motion-graphics',
                'price' => 800000,
                'delivery_days' => 5,
                'description' => 'Membuat intro video motion graphics profesional menggunakan After Effects. Cocok untuk YouTube channel, brand, atau presentasi.',
                'tags' => ['After Effects', 'Intro', 'Animation'],
                'status' => 'active',
                'packages' => [
                    ['name' => 'Basic', 'price' => 800000, 'description' => 'Intro 10 detik', 'delivery_days' => 3, 'features' => ['Intro 10 Detik', 'Logo Animation', 'File MP4 1080p'], 'popular' => false],
                    ['name' => 'Standard', 'price' => 1200000, 'description' => 'Intro 30 detik + sound', 'delivery_days' => 5, 'features' => ['Intro 30 Detik', 'Logo Animation', 'Sound Effects', 'File MP4 4K'], 'popular' => true],
                    ['name' => 'Premium', 'price' => 2000000, 'description' => 'Intro + outro + lower third', 'delivery_days' => 7, 'features' => ['Intro 30 Detik', 'Outro 15 Detik', 'Lower Third', 'Sound Effects', 'File MP4 4K + Source'], 'popular' => false],
                ],
            ],
        ];

        foreach ($services as $serviceData) {
            $freelancer = $freelancers->firstWhere('name', $serviceData['freelancer_name']);
            if (!$freelancer) continue;

            $category = \App\Models\Category::where('slug', $serviceData['category_slug'])->first();

            $service = Service::create([
                'title' => $serviceData['title'],
                'description' => $serviceData['description'],
                'category_id' => $category?->id,
                'user_id' => $freelancer->id,
                'price' => $serviceData['price'],
                'delivery_days' => $serviceData['delivery_days'],
                'tags' => $serviceData['tags'],
                'status' => $serviceData['status'],
            ]);

            foreach ($serviceData['packages'] as $packageData) {
                ServicePackage::create(array_merge($packageData, [
                    'service_id' => $service->id,
                ]));
            }
        }
    }
}
