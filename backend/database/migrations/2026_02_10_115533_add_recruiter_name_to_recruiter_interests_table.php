<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('recruiter_interests', function (Blueprint $table) {
            $table->string('recruiter_name')->nullable()->after('company_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('recruiter_interests', function (Blueprint $table) {
            $table->dropColumn('recruiter_name');
        });
    }
};
