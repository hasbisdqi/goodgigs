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
        Schema::table('job_applications', function (Blueprint $table) {
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->string('duration')->nullable();
            $table->string('availability')->nullable();
            $table->string('attachment_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['hourly_rate', 'duration', 'availability', 'attachment_path']);
        });
    }
};
