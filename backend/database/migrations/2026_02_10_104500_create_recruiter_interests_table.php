<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('recruiter_interests', function (Blueprint $塊) {
            $塊->id();
            $塊->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $塊->string('company_name');
            $塊->string('email');
            $塊->string('phone')->nullable();
            $塊->string('status')->default('PENDING'); // PENDING, REJECTED, HIRED, etc.
            $塊->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('recruiter_interests');
    }
};
