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
        Schema::create('endorsements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('endorser_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('endorsee_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['endorser_id', 'endorsee_id']); // Each user can only endorse another user once
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('endorsements');
    }
};
