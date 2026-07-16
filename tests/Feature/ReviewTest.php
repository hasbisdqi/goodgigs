<?php

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows employer to mark job as completed', function () {
    $employer = User::factory()->create(['active_mode' => 'employer']);
    $job = JobPosting::factory()->create(['user_id' => $employer->id, 'status' => 'published']);

    $response = $this->actingAs($employer)->patch(route('jobs.complete', $job));

    $response->assertRedirect();
    expect($job->fresh()->status)->toBe('completed');
});

it('prevents non-employer from marking job as completed', function () {
    $employer = User::factory()->create(['active_mode' => 'employer']);
    $otherUser = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $employer->id, 'status' => 'published']);

    $response = $this->actingAs($otherUser)->patch(route('jobs.complete', $job));

    $response->assertForbidden();
    expect($job->fresh()->status)->toBe('published');
});

it('allows employer and hired worker to review each other on completed job', function () {
    $employer = User::factory()->create(['active_mode' => 'employer']);
    $worker = User::factory()->create(['active_mode' => 'worker']);

    $job = JobPosting::factory()->create(['user_id' => $employer->id, 'status' => 'completed']);
    $application = JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $worker->id,
        'message' => 'I can do this.',
        'status' => 'accepted',
    ]);

    // Employer reviews worker
    $response1 = $this->actingAs($employer)->post(route('reviews.store'), [
        'job_posting_id' => $job->id,
        'reviewee_id' => $worker->id,
        'rating' => 5,
        'comment' => 'Great work!',
    ]);

    $response1->assertRedirect();
    expect(Review::where('reviewer_id', $employer->id)->exists())->toBeTrue();

    // Worker reviews employer
    $response2 = $this->actingAs($worker)->post(route('reviews.store'), [
        'job_posting_id' => $job->id,
        'reviewee_id' => $employer->id,
        'rating' => 4,
        'comment' => 'Good employer.',
    ]);

    $response2->assertRedirect();
    expect(Review::where('reviewer_id', $worker->id)->exists())->toBeTrue();
});

it('prevents reviewing non-completed jobs', function () {
    $employer = User::factory()->create();
    $worker = User::factory()->create();

    $job = JobPosting::factory()->create(['user_id' => $employer->id, 'status' => 'published']);
    JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $worker->id,
        'message' => 'I can do this.',
        'status' => 'accepted',
    ]);

    $response = $this->actingAs($employer)->post(route('reviews.store'), [
        'job_posting_id' => $job->id,
        'reviewee_id' => $worker->id,
        'rating' => 5,
        'comment' => 'Great work!',
    ]);

    $response->assertForbidden();
});
