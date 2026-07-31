<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\ReminderConfirmationNotification;
use Illuminate\Support\Facades\Notification;

it('sends confirmation reminders to employers for completed work waiting approval', function () {
    Notification::fake();

    $employer = User::factory()->create();
    $worker = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    // Work completed 65 minutes ago
    $session = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'waiting_approval',
        'work_completed_at' => now()->subMinutes(65),
    ]);

    $this->artisan('attendance:remind-confirmation')->assertExitCode(0);

    Notification::assertSentTo([$employer], ReminderConfirmationNotification::class);
});

it('does not send confirmation reminders before 1 hour mark', function () {
    Notification::fake();

    $employer = User::factory()->create();
    $worker = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    // Work completed 30 minutes ago
    $session = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'waiting_approval',
        'work_completed_at' => now()->subMinutes(30),
    ]);

    $this->artisan('attendance:remind-confirmation')->assertExitCode(0);

    Notification::assertNothingSent();
});
