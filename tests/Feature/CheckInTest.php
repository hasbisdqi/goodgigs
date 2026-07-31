<?php

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;

it('allows worker to check in when inside geofence', function () {
    $employer = User::factory()->create();
    $worker = User::factory()->create();

    $job = JobPosting::factory()->create([
        'user_id' => $employer->id,
        'latitude' => -6.175392,
        'longitude' => 106.827153,
    ]);

    JobApplication::factory()->create([
        'job_posting_id' => $job->id,
        'user_id' => $worker->id,
        'status' => 'accepted',
    ]);

    $response = $this->actingAs($worker)->post(route('jobs.attendance.checkin', $job), [
        'latitude' => -6.175392,
        'longitude' => 106.827153,
        'accuracy' => 10,
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('attendance_sessions', [
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'waiting_employer',
    ]);

    $this->assertDatabaseHas('check_ins', [
        'user_id' => $worker->id,
        'role' => 'worker',
    ]);

    $this->assertDatabaseHas('attendance_events', [
        'event' => 'worker_checked_in',
    ]);
});

it('prevents check in when outside geofence', function () {
    $employer = User::factory()->create();
    $worker = User::factory()->create();

    $job = JobPosting::factory()->create([
        'user_id' => $employer->id,
        'latitude' => -6.175392,
        'longitude' => 106.827153,
    ]);

    JobApplication::factory()->create([
        'job_posting_id' => $job->id,
        'user_id' => $worker->id,
        'status' => 'accepted',
    ]);

    $response = $this->actingAs($worker)->post(route('jobs.attendance.checkin', $job), [
        'latitude' => -6.194916,
        'longitude' => 106.823126, // Far away
        'accuracy' => 10,
    ]);

    $response->assertSessionHasErrors(['location']);
});

it('confirms meeting when both parties check in', function () {
    $employer = User::factory()->create();
    $worker = User::factory()->create();

    $job = JobPosting::factory()->create([
        'user_id' => $employer->id,
        'latitude' => -6.175392,
        'longitude' => 106.827153,
    ]);

    JobApplication::factory()->create([
        'job_posting_id' => $job->id,
        'user_id' => $worker->id,
        'status' => 'accepted',
    ]);

    // Worker checks in
    $this->actingAs($worker)->post(route('jobs.attendance.checkin', $job), [
        'latitude' => -6.175392,
        'longitude' => 106.827153,
        'accuracy' => 10,
    ]);

    // Employer checks in
    $this->actingAs($employer)->post(route('jobs.attendance.checkin', $job), [
        'latitude' => -6.175392,
        'longitude' => 106.827153,
        'accuracy' => 10,
    ]);

    $this->assertDatabaseHas('attendance_sessions', [
        'job_posting_id' => $job->id,
        'status' => 'meeting_confirmed',
    ]);

    $this->assertDatabaseHas('attendance_events', [
        'event' => 'meeting_confirmed',
    ]);
});
