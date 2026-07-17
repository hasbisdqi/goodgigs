<?php

use App\Models\JobPosting;
use App\Models\User;

it('allows user to report a job posting', function () {
    $user = User::factory()->create();
    $employer = User::factory()->create(['active_mode' => 'employer']);
    $job = JobPosting::factory()->create(['user_id' => $employer->id]);

    $response = $this->actingAs($user)
        ->post('/reports', [
            'reportable_id' => $job->id,
            'reportable_type' => 'App\Models\JobPosting',
            'reason' => 'spam',
            'description' => 'This job looks like a scam.',
        ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('reports', [
        'reporter_id' => $user->id,
        'reportable_id' => $job->id,
        'reportable_type' => 'App\Models\JobPosting',
        'reason' => 'spam',
        'status' => 'pending',
    ]);
});

it('allows user to report another user', function () {
    $user = User::factory()->create();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/reports', [
            'reportable_id' => $targetUser->id,
            'reportable_type' => 'App\Models\User',
            'reason' => 'fake',
        ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('reports', [
        'reporter_id' => $user->id,
        'reportable_id' => $targetUser->id,
        'reportable_type' => 'App\Models\User',
        'reason' => 'fake',
        'status' => 'pending',
    ]);
});
