<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\DisputeNotification;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    $this->employer = User::factory()->create();
    $this->worker = User::factory()->create();
    $this->job = JobPosting::factory()->create(['user_id' => $this->employer->id]);

    $this->session = AttendanceSession::create([
        'job_posting_id' => $this->job->id,
        'worker_id' => $this->worker->id,
        'employer_id' => $this->employer->id,
        'status' => 'waiting_employer',
    ]);
});

it('prevents no show report before grace period', function () {
    $response = $this->actingAs($this->worker)->post(route('attendance.dispute.noshow', $this->session), [
        'reason' => 'Employer did not show up',
    ]);

    $response->assertSessionHasErrors(['grace_period']);
});

it('allows no show report after grace period', function () {
    Notification::fake();

    $this->session->update([
        'created_at' => now()->subMinutes(35),
    ]);

    $response = $this->actingAs($this->worker)->post(route('attendance.dispute.noshow', $this->session), [
        'reason' => 'Employer did not show up',
    ]);

    $response->assertSessionHas('success');

    Notification::assertSentTo(
        [$this->employer], DisputeNotification::class
    );

    $this->assertDatabaseHas('disputes', [
        'attendance_session_id' => $this->session->id,
        'reporter_id' => $this->worker->id,
        'reported_user_id' => $this->employer->id,
        'status' => 'open',
    ]);

    $this->assertDatabaseHas('attendance_sessions', [
        'id' => $this->session->id,
        'status' => 'disputed',
    ]);
});
