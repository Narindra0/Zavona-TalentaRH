<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->decimal('daily_rate', 10, 2)->nullable()->after('contract_type');
            $table->decimal('weekly_rate', 10, 2)->nullable()->after('daily_rate');
            $table->enum('rate_type', ['daily', 'weekly'])->nullable()->after('weekly_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn(['daily_rate', 'weekly_rate', 'rate_type']);
        });
    }
};
