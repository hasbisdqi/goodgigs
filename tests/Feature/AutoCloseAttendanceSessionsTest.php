<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;

it('auto closes sessions that are working for over 24 hours', function () {
    $employer = User::factory()->create();
    $worker = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    $oldSession = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'working',
        'work_started_at' => now()->subHours(25),
    ]);

    $newSession = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'working',
        'work_started_at' => now()->subHours(5),
    ]);

    $this->artisan('attendance:auto-close')
        ->expectsOutput("Session {$oldSession->id} auto-closed.")
        ->expectsOutput('Processed 1 sessions.')
        ->assertSuccessful();

    $this->assertDatabaseHas('attendance_sessions', [
        'id' => $oldSession->id,
        'status' => 'completed',
    ]);

    $this->assertDatabaseHas('attendance_sessions', [
        'id' => $newSession->id,
        'status' => 'working',
    ]);
});
