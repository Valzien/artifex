<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->unsignedInteger('client_unread_count')->default(0)->after('last_message_at');
            $table->unsignedInteger('freelancer_unread_count')->default(0)->after('client_unread_count');
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn(['client_unread_count', 'freelancer_unread_count']);
        });
    }
};
