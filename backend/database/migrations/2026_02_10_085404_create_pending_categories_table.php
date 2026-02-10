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
        Schema::create('pending_categories', function (Blueprint $column) {
            $column->id();
            $column->string('original_title');
            $column->string('suggested_category')->nullable();
            $column->string('suggested_subcategory')->nullable();
            $column->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $column->unsignedBigInteger('created_by')->nullable();
            $column->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_categories');
    }
};
