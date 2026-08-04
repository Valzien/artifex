<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('role', 'client')->first();
        $services = Service::inRandomOrder()->take(3)->get();

        foreach ($services as $service) {
            Favorite::create([
                'user_id' => $client->id,
                'service_id' => $service->id,
            ]);
        }
    }
}
