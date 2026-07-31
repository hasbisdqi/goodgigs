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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('worker'); // 'employer' or 'worker'
            $table->string('avatar')->nullable();
            $table->string('title')->nullable();
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->integer('reviews_count')->default(0);
            $table->decimal('total_earnings', 10, 2)->default(0);
        });

        Schema::table('job_postings', function (Blueprint $table) {
            $table->json('tags')->nullable();
            $table->string('duration')->nullable(); // e.g. "3 months", "2 weeks"
            $table->string('icon')->nullable(); // e.g. "Terminal", "Palette"
            $table->string('color_class')->nullable();
            $table->string('text_class')->nullable();
            $table->integer('new_applicants')->default(0);
            $table->string('logo')->nullable(); // for company logo
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar', 'title', 'rating', 'reviews_count', 'total_earnings']);
        });

        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropColumn(['tags', 'duration', 'icon', 'color_class', 'text_class', 'new_applicants', 'logo']);
        });
    }
};
