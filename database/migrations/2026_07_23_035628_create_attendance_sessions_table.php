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
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('worker_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('employer_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', [
                'waiting_checkin',
                'waiting_employer',
                'waiting_worker',
                'meeting_confirmed',
                'working',
                'waiting_approval',
                'completed',
                'disputed',
                'cancelled',
            ])->default('waiting_checkin');
            $table->timestamp('meeting_confirmed_at')->nullable();
            $table->timestamp('work_started_at')->nullable();
            $table->timestamp('work_completed_at')->nullable();
            $table->timestamp('employer_approved_at')->nullable();
            $table->timestamps();

            $table->index('job_posting_id');
            $table->index('worker_id');
            $table->index('employer_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
