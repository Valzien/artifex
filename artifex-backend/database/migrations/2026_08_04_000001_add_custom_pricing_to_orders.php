<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('type')->default('package')->after('package_name');
            $table->decimal('custom_min', 12, 2)->nullable()->after('type');
            $table->decimal('custom_max', 12, 2)->nullable()->after('custom_min');
            $table->decimal('deal_price', 12, 2)->nullable()->after('custom_max');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['type', 'custom_min', 'custom_max', 'deal_price']);
        });
    }
};
