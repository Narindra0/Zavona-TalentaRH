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
            $table->foreignId('category_id')->nullable()->change();
            $table->foreignId('sub_category_id')->nullable()->change();
            $table->string('status')->default('PENDING')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
            $table->foreignId('sub_category_id')->nullable(false)->change();
            $table->string('status')->default('ACTIVE')->change();
        });
    }
};
