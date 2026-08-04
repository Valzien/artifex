<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('type')->default('text')->after('content');
            $table->json('attachment')->nullable()->after('type');
            $table->decimal('amount', 12, 2)->nullable()->after('attachment');
            $table->string('payment_status')->nullable()->after('amount');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['type', 'attachment', 'amount', 'payment_status']);
        });
    }
};
