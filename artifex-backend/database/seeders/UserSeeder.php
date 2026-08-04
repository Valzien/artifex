<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin Artifex',
            'email' => 'admin@artifex.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'location' => 'Jakarta',
            'avatar' => 'A',
            'is_online' => true,
        ]);

        $freelancers = [
            [
                'name' => 'Rina S.',
                'email' => 'rina@artifex.id',
                'role' => 'freelancer',
                'specialty' => 'Graphic Design',
                'location' => 'Jakarta',
                'bio' => 'Senior Graphic Designer dengan fokus pada branding dan visual identity.',
                'skills' => ['Logo', 'Branding', 'UI/UX', 'Figma'],
                'is_online' => true,
                'response_time' => '1 jam',
                'avatar' => 'R',
            ],
            [
                'name' => 'Dimas P.',
                'email' => 'dimas@artifex.id',
                'role' => 'freelancer',
                'specialty' => 'Video Editing',
                'location' => 'Bandung',
                'bio' => 'Video editor profesional untuk YouTube, iklan, dan konten kreatif.',
                'skills' => ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
                'is_online' => true,
                'response_time' => '2 jam',
                'avatar' => 'D',
            ],
            [
                'name' => 'Anisa K.',
                'email' => 'anisa@artifex.id',
                'role' => 'freelancer',
                'specialty' => 'Copywriting',
                'location' => 'Surabaya',
                'bio' => 'Copywriter yang membantu brand meningkatkan konversi melalui kata-kata.',
                'skills' => ['SEO Copywriting', 'Landing Page', 'Email Marketing'],
                'is_online' => false,
                'response_time' => '3 jam',
                'avatar' => 'A',
            ],
            [
                'name' => 'Yuki T.',
                'email' => 'yuki@artifex.id',
                'role' => 'freelancer',
                'specialty' => 'Live2D Rigging',
                'location' => 'Yogyakarta',
                'bio' => 'Live2D rigger spesialis Vtuber dengan pengalaman international.',
                'skills' => ['Live2D', 'Cubism', 'Vtuber', 'Animation'],
                'is_online' => true,
                'response_time' => '1 hari',
                'avatar' => 'Y',
            ],
            [
                'name' => 'Maya L.',
                'email' => 'maya@artifex.id',
                'role' => 'freelancer',
                'specialty' => 'Art Commission',
                'location' => 'Bali',
                'bio' => 'Ilustrator digital dengan gaya semi-realistic. Menerima commission character art.',
                'skills' => ['Illustration', 'Character Design', 'Procreate', 'Clip Studio'],
                'is_online' => false,
                'response_time' => '4 jam',
                'avatar' => 'M',
            ],
            [
                'name' => 'Fajar A.',
                'email' => 'fajar@artifex.id',
                'role' => 'freelancer',
                'specialty' => 'Web Development',
                'location' => 'Jakarta',
                'bio' => 'Fullstack developer React & Laravel. Membangun website modern dan cepat.',
                'skills' => ['React', 'Laravel', 'Tailwind', 'Node.js'],
                'is_online' => true,
                'response_time' => '1 jam',
                'avatar' => 'F',
            ],
        ];

        foreach ($freelancers as $data) {
            User::create(array_merge($data, [
                'password' => Hash::make('password'),
            ]));
        }

        User::create([
            'name' => 'Rizky Firmansyah',
            'email' => 'rizky@artifex.id',
            'password' => Hash::make('password'),
            'role' => 'client',
            'location' => 'Jakarta',
            'bio' => 'Startup founder yang mencari talenta kreatif untuk proyek branding.',
            'avatar' => 'R',
            'is_online' => true,
        ]);
    }
}
