<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\ReminderCheckInNotification;
use Illuminate\Support\Facades\Notification;

it('sends check in reminders to both parties when waiting', function () {
    Notification::fake();

    $employer = User::factory()->create();
    $worker = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    // Scheduled to start in 5 minutes
    $session = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'waiting_checkin',
        'created_at' => now()->subMinutes(5),
    ]);

    $this->artisan('attendance:remind-check-in')->assertExitCode(0);

    Notification::assertSentTo([$employer, $worker], ReminderCheckInNotification::class);
});

it('does not send reminders for sessions outside 15 minute window', function () {
    Notification::fake();

    $employer = User::factory()->create();
    $worker = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    // Scheduled to start in 20 minutes (too far)
    $session = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'waiting_checkin',
        'created_at' => now()->subMinutes(20),
    ]);

    $this->artisan('attendance:remind-check-in')->assertExitCode(0);

    Notification::assertNothingSent();
});
