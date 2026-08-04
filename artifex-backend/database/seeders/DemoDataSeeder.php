<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Portfolio;
use App\Models\Product;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    private string $password = 'Password@123';

    public function run(): void
    {
        $this->seedCategories();
        $this->seedUsers();
        $this->seedServices();
        $this->seedPortfolios();
        $this->seedProducts();
        $this->updateServiceCounts();
    }

    private function seedCategories(): void
    {
        $categories = [
            ['name' => 'Art Commission', 'slug' => 'art-commission', 'icon' => '🎨', 'description' => 'Komisi ilustrasi, karakter, dan artwork digital custom.'],
            ['name' => 'Live2D Rigging', 'slug' => 'live2d-rigging', 'icon' => '🎭', 'description' => 'Rigging dan animasi karakter Live2D untuk VTuber & game.'],
            ['name' => 'Copywriting', 'slug' => 'copywriting', 'icon' => '✍️', 'description' => 'Tulisan iklan, konten marketing, dan copy persuasif.'],
            ['name' => 'Video Editing', 'slug' => 'video-editing', 'icon' => '🎬', 'description' => 'Editing video YouTube, iklan, dan konten sosial media.'],
            ['name' => 'Voice Over', 'slug' => 'voice-over', 'icon' => '🎙️', 'description' => 'Pengisi suara profesional untuk iklan, animasi, dan narasi.'],
            ['name' => 'Graphic Design', 'slug' => 'graphic-design', 'icon' => '🖌️', 'description' => 'Desain logo, brand identity, poster, dan materi visual.'],
            ['name' => 'Web Development', 'slug' => 'web-development', 'icon' => '💻', 'description' => 'Website company profile, toko online, dan aplikasi web.'],
            ['name' => 'Social Media Management', 'slug' => 'social-media-management', 'icon' => '📱', 'description' => 'Kelola akun sosial media, konten harian, dan analitik.'],
            ['name' => 'Motion Graphics & Animation', 'slug' => 'motion-graphics', 'icon' => '✨', 'description' => 'Animasi logo, explainer video, dan motion graphic kreatif.'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }

    private function seedUsers(): void
    {
        $this->user('Admin Artifex', 'admin@artifex.id', 'admin', [
            'location' => 'Jakarta, Indonesia',
        ]);

        $this->user('Budi Santoso', 'client@artifex.id', 'client', [
            'location' => 'Bandung, Indonesia',
            'bio' => 'Founder startup e-commerce.',
        ]);

        $this->user('Raka Pratama', 'raka@artifex.id', 'freelancer', [
            'avatar' => 'https://i.pravatar.cc/150?img=11',
            'phone' => '0812-3456-7801',
            'location' => 'Jakarta, Indonesia',
            'bio' => 'Full-stack web developer dengan 6+ tahun pengalaman membangun website modern, cepat, dan responsif.',
            'specialty' => 'Web Development',
            'skills' => ['Laravel', 'React', 'Vue', 'Tailwind CSS', 'MySQL', 'PostgreSQL'],
            'languages' => ['Indonesia', 'Inggris'],
            'response_time' => '1 jam',
            'member_since' => now()->subYears(2)->toDateString(),
            'repeat_clients' => 34,
        ]);

        $this->user('Sari Wijaya', 'sari@artifex.id', 'freelancer', [
            'avatar' => 'https://i.pravatar.cc/150?img=32',
            'phone' => '0812-3456-7802',
            'location' => 'Yogyakarta, Indonesia',
            'bio' => 'Ilustrator & desainer grafis yang suka menghidupkan ide menjadi visual yang memukau.',
            'specialty' => 'Graphic Design',
            'skills' => ['Illustrator', 'Photoshop', 'Procreate', 'Brand Identity', 'Character Design'],
            'languages' => ['Indonesia', 'Inggris'],
            'response_time' => '2 jam',
            'member_since' => now()->subYears(3)->toDateString(),
            'repeat_clients' => 57,
        ]);

        $this->user('Dimas Saputra', 'dimas@artifex.id', 'freelancer', [
            'avatar' => 'https://i.pravatar.cc/150?img=12',
            'phone' => '0812-3456-7803',
            'location' => 'Surabaya, Indonesia',
            'bio' => 'Video editor & motion graphic artist, spesialis konten YouTube dan iklan digital.',
            'specialty' => 'Video Editing',
            'skills' => ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Motion Graphics'],
            'languages' => ['Indonesia'],
            'response_time' => '3 jam',
            'member_since' => now()->subYears(1)->toDateString(),
            'repeat_clients' => 21,
        ]);
    }

    private function seedServices(): void
    {
        $raka = User::where('email', 'raka@artifex.id')->first();
        $sari = User::where('email', 'sari@artifex.id')->first();
        $dimas = User::where('email', 'dimas@artifex.id')->first();

        $web = Category::where('slug', 'web-development')->first();
        $graphic = Category::where('slug', 'graphic-design')->first();
        $art = Category::where('slug', 'art-commission')->first();
        $video = Category::where('slug', 'video-editing')->first();
        $motion = Category::where('slug', 'motion-graphics')->first();

        $this->service($raka, $web, [
            'title' => 'Website Company Profile Modern',
            'price' => 1500000,
            'delivery_days' => 14,
            'image' => 'https://picsum.photos/seed/website1/800/500',
            'tags' => ['website', 'company profile', 'landing page'],
            'description' => 'Website company profile profesional dengan desain modern, mobile responsive, SEO friendly, dan mudah dikelola lewat admin panel.',
            'packages' => [
                ['name' => 'Basic', 'price' => 1500000, 'delivery_days' => 10, 'popular' => false, 'description' => '1 landing page, desain premium, responsive, form kontak.',
                    'features' => ['1 Landing Page', 'Responsive Design', 'Form Kontak', 'SEO Dasar']],
                ['name' => 'Standard', 'price' => 2500000, 'delivery_days' => 14, 'popular' => true, 'description' => '5 halaman + blog, admin panel, integrasi sosial media.',
                    'features' => ['5 Halaman', 'Blog Sederhana', 'Admin Panel', 'Integrasi Sosial Media']],
                ['name' => 'Premium', 'price' => 4500000, 'delivery_days' => 21, 'popular' => false, 'description' => 'Website lengkap dengan toko online, multi bahasa, dan fitur custom.',
                    'features' => ['Toko Online', 'Multi Bahasa', 'Fitur Custom', 'Prioritas Support']],
            ],
        ]);

        $this->service($sari, $graphic, [
            'title' => 'Desain Logo Minimalis',
            'price' => 350000,
            'delivery_days' => 3,
            'image' => 'https://picsum.photos/seed/logo1/800/500',
            'tags' => ['logo', 'branding', 'minimalis'],
            'description' => 'Desain logo minimalis yang ikonik dan timeless, termasuk revisi tanpa batas hingga kamu puas.',
            'packages' => [
                ['name' => 'Basic', 'price' => 350000, 'delivery_days' => 2, 'popular' => false, 'description' => '1 konsep logo + file PNG.',
                    'features' => ['1 Konsep Logo', 'File PNG', 'Revisi 2x']],
                ['name' => 'Standard', 'price' => 700000, 'delivery_days' => 3, 'popular' => true, 'description' => '3 konsep logo + source file + panduan warna.',
                    'features' => ['3 Konsep Logo', 'File AI & PNG', 'Panduan Warna', 'Revisi 3x']],
                ['name' => 'Premium', 'price' => 1200000, 'delivery_days' => 5, 'popular' => false, 'description' => 'Brand identity lengkap: logo, kartu nama, dan template sosial media.',
                    'features' => ['Brand Identity Lengkap', 'Kartu Nama', 'Template Sosial Media', 'Revisi Tanpa Batas']],
            ],
        ]);

        $this->service($sari, $art, [
            'title' => 'Art Commission Character Fullbody',
            'price' => 500000,
            'delivery_days' => 7,
            'image' => 'https://picsum.photos/seed/art1/800/500',
            'tags' => ['art commission', 'character', 'ilustrasi'],
            'description' => 'Komisi ilustrasi karakter fullbody dengan detail tinggi, cocok untuk avatar, cover, atau keperluan kreatif lain.',
            'packages' => [
                ['name' => 'Bust', 'price' => 250000, 'delivery_days' => 4, 'popular' => false, 'description' => 'Ilustrasi karakter dari dada ke atas.',
                    'features' => ['Bust/Setengah Badan', 'Warna Penuh', 'Background Sederhana']],
                ['name' => 'Half Body', 'price' => 400000, 'delivery_days' => 5, 'popular' => true, 'description' => 'Ilustrasi karakter dari pinggang ke atas.',
                    'features' => ['Half Body', 'Warna Penuh', 'Background Custom']],
                ['name' => 'Fullbody', 'price' => 650000, 'delivery_days' => 7, 'popular' => false, 'description' => 'Ilustrasi karakter fullbody dengan pose kompleks.',
                    'features' => ['Fullbody', 'Pose Kompleks', 'Background Detail', 'Source File']],
            ],
        ]);

        $this->service($dimas, $video, [
            'title' => 'Edit Video YouTube Profesional',
            'price' => 800000,
            'delivery_days' => 5,
            'image' => 'https://picsum.photos/seed/video1/800/500',
            'tags' => ['video editing', 'youtube', 'konten'],
            'description' => 'Editing video YouTube yang engaging: cutting, subtitle, B-roll, dan thumbnail.',
            'packages' => [
                ['name' => 'Basic', 'price' => 800000, 'delivery_days' => 4, 'popular' => false, 'description' => 'Editing dasar untuk video 10 menit.',
                    'features' => ['Video 10 Menit', 'Cutting & Transition', 'Subtitle']],
                ['name' => 'Standard', 'price' => 1400000, 'delivery_days' => 5, 'popular' => true, 'description' => 'Editing lengkap + B-roll + sound effect.',
                    'features' => ['Video 15 Menit', 'B-Roll & Stock', 'Sound Effect', 'Color Grading']],
                ['name' => 'Premium', 'price' => 2200000, 'delivery_days' => 7, 'popular' => false, 'description' => 'Editing premium + motion graphic + thumbnail.',
                    'features' => ['Video 20+ Menit', 'Motion Graphic', 'Thumbnail', 'Prioritas Support']],
            ],
        ]);

        $this->service($dimas, $motion, [
            'title' => 'Motion Graphics Intro Animation',
            'price' => 600000,
            'delivery_days' => 7,
            'image' => 'https://picsum.photos/seed/motion1/800/500',
            'tags' => ['motion graphic', 'intro', 'animasi'],
            'description' => 'Animasi intro/logo reveal dengan motion graphic berkualitas bioskop, durasi 5-15 detik.',
            'packages' => [
                ['name' => 'Basic', 'price' => 600000, 'delivery_days' => 5, 'popular' => false, 'description' => 'Logo reveal 5 detik.',
                    'features' => ['Durasi 5 Detik', 'Logo Reveal', '1 Revisi']],
                ['name' => 'Standard', 'price' => 1000000, 'delivery_days' => 7, 'popular' => true, 'description' => 'Intro 10 detik dengan sound design.',
                    'features' => ['Durasi 10 Detik', 'Sound Design', '2 Revisi']],
                ['name' => 'Premium', 'price' => 1600000, 'delivery_days' => 10, 'popular' => false, 'description' => 'Full intro + outro + lower third.',
                    'features' => ['Durasi 15 Detik', 'Intro + Outro', 'Lower Third', 'Revisi Tanpa Batas']],
            ],
        ]);
    }

    private function seedPortfolios(): void
    {
        $raka = User::where('email', 'raka@artifex.id')->first();
        $sari = User::where('email', 'sari@artifex.id')->first();
        $dimas = User::where('email', 'dimas@artifex.id')->first();

        $portfolios = [
            ['user' => $raka, 'title' => 'E-Commerce Platform', 'category' => 'Web Development', 'description' => 'Website toko online dengan sistem pembayaran dan manajemen produk.', 'image' => 'https://picsum.photos/seed/port-web1/800/500',
                'media' => [
                    ['type' => 'image', 'url' => 'https://picsum.photos/seed/port-web1/800/500'],
                    ['type' => 'image', 'url' => 'https://picsum.photos/seed/port-web2/800/500'],
                ]],
            ['user' => $raka, 'title' => 'Sistem Absensi Karyawan', 'category' => 'Web Development', 'description' => 'Aplikasi absensi online berbasis web dengan laporan real-time.', 'image' => 'https://picsum.photos/seed/port-web3/800/500',
                'media' => [['type' => 'image', 'url' => 'https://picsum.photos/seed/port-web3/800/500']]],
            ['user' => $sari, 'title' => 'Brand Identity Kopi Lokal', 'category' => 'Graphic Design', 'description' => 'Identitas visual lengkap untuk brand kopi lokal, dari logo sampai kemasan.', 'image' => 'https://picsum.photos/seed/port-gd1/800/500',
                'media' => [
                    ['type' => 'image', 'url' => 'https://picsum.photos/seed/port-gd1/800/500'],
                    ['type' => 'image', 'url' => 'https://picsum.photos/seed/port-gd2/800/500'],
                ]],
            ['user' => $sari, 'title' => 'Karakter VTuber', 'category' => 'Art Commission', 'description' => 'Desain karakter VTuber dengan turnaround sheet untuk keperluan rigging.', 'image' => 'https://picsum.photos/seed/port-art1/800/500',
                'media' => [['type' => 'image', 'url' => 'https://picsum.photos/seed/port-art1/800/500']]],
            ['user' => $dimas, 'title' => 'Konten Review Gadget', 'category' => 'Video Editing', 'description' => 'Seri video review gadget dengan editing dinamis dan motion subtitle.', 'image' => 'https://picsum.photos/seed/port-vid1/800/500',
                'media' => [
                    ['type' => 'image', 'url' => 'https://picsum.photos/seed/port-vid1/800/500'],
                    ['type' => 'image', 'url' => 'https://picsum.photos/seed/port-vid2/800/500'],
                ]],
        ];

        foreach ($portfolios as $p) {
            Portfolio::updateOrCreate(
                ['user_id' => $p['user']->id, 'title' => $p['title']],
                [
                    'category' => $p['category'],
                    'description' => $p['description'],
                    'image' => $p['image'],
                    'media' => $p['media'],
                ]
            );
        }
    }

    private function seedProducts(): void
    {
        $sari = User::where('email', 'sari@artifex.id')->first();
        $dimas = User::where('email', 'dimas@artifex.id')->first();
        $graphic = Category::where('slug', 'graphic-design')->first();
        $video = Category::where('slug', 'video-editing')->first();

        Product::updateOrCreate(
            ['user_id' => $sari->id, 'title' => 'Pack Icon Flat 100+'],
            [
                'category_id' => $graphic->id,
                'description' => 'Kumpulan 100+ ikon flat dengan format SVG & PNG transparan, siap pakai untuk website dan aplikasi.',
                'price' => 150000,
                'file_name' => 'flat-icons-pack.zip',
                'previews' => [['type' => 'image', 'url' => 'https://picsum.photos/seed/prod-icon1/800/500']],
                'tags' => ['icons', 'flat', 'svg'],
            ]
        );

        Product::updateOrCreate(
            ['user_id' => $sari->id, 'title' => 'Template Feed Instagram'],
            [
                'category_id' => $graphic->id,
                'description' => 'Template feed Instagram 10 desain, format PSD & Canva, mudah diedit.',
                'price' => 99000,
                'file_name' => 'ig-feed-templates.zip',
                'previews' => [['type' => 'image', 'url' => 'https://picsum.photos/seed/prod-ig1/800/500']],
                'tags' => ['template', 'instagram', 'feed'],
            ]
        );

        Product::updateOrCreate(
            ['user_id' => $dimas->id, 'title' => 'Sound Effect Pack Creator'],
            [
                'category_id' => $video->id,
                'description' => '200+ sound effect untuk content creator: whoosh, pop, notification, dan transition.',
                'price' => 120000,
                'file_name' => 'sfx-pack.zip',
                'previews' => [['type' => 'image', 'url' => 'https://picsum.photos/seed/prod-sfx1/800/500']],
                'tags' => ['sound effect', 'content creator'],
            ]
        );
    }

    private function updateServiceCounts(): void
    {
        foreach (Category::all() as $category) {
            $category->update([
                'service_count' => Service::where('category_id', $category->id)->count(),
            ]);
        }
    }

    private function user(string $name, string $email, string $role, array $extra = []): User
    {
        return User::updateOrCreate(
            ['email' => $email],
            array_merge([
                'name' => $name,
                'password' => $this->password,
                'role' => $role,
                'is_online' => false,
            ], $extra)
        );
    }

    private function service(User $user, Category $category, array $data): void
    {
        $service = Service::updateOrCreate(
            ['user_id' => $user->id, 'title' => $data['title']],
            [
                'category_id' => $category->id,
                'description' => $data['description'],
                'price' => $data['price'],
                'delivery_days' => $data['delivery_days'],
                'image' => $data['image'],
                'tags' => $data['tags'],
                'status' => 'active',
            ]
        );

        foreach ($data['packages'] as $pkg) {
            ServicePackage::updateOrCreate(
                ['service_id' => $service->id, 'name' => $pkg['name']],
                [
                    'price' => $pkg['price'],
                    'description' => $pkg['description'],
                    'delivery_days' => $pkg['delivery_days'],
                    'popular' => $pkg['popular'],
                    'features' => $pkg['features'],
                ]
            );
        }
    }
}
