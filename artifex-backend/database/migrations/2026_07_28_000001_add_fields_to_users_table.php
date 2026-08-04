<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->index(); // client, freelancer, admin
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('is_online')->default(false);
            $table->string('specialty')->nullable();
            $table->json('skills')->nullable();
            $table->json('languages')->nullable();
            $table->string('response_time')->nullable();
            $table->date('last_delivery')->nullable();
            $table->date('member_since')->nullable();
            $table->integer('repeat_clients')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'phone', 'location', 'bio', 'avatar', 'is_online',
                'specialty', 'skills', 'languages', 'response_time',
                'last_delivery', 'member_since', 'repeat_clients',
            ]);
        });
    }
};
