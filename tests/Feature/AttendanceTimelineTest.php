<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;

it('fetches attendance timeline successfully', function () {
    $employer = User::factory()->create();
    $worker = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    $session = AttendanceSession::create([
        'job_posting_id' => $job->id,
        'worker_id' => $worker->id,
        'employer_id' => $employer->id,
        'status' => 'working',
    ]);

    $session->events()->create([
        'event' => 'worker_checked_in',
        'actor_id' => $worker->id,
    ]);

    $response = $this->actingAs($employer)->get(route('attendance.show', $session));

    $response->assertStatus(200);
    $response->assertJsonPath('session.id', $session->id);
    $response->assertJsonCount(1, 'session.events');
});
