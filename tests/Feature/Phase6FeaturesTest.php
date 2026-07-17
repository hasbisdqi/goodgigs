<?php

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
});

it('can fetch worker directory', function () {
    $worker = User::factory()->create(['active_mode' => 'worker', 'name' => 'John Doe']);

    $response = $this->actingAs($worker)->get('/workers');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('workers/index'));
});

it('allows worker to add portfolio', function () {
    $worker = User::factory()->create(['active_mode' => 'worker']);

    $response = $this->actingAs($worker)->post('/portfolios', [
        'title' => 'My Work',
        'description' => 'Test description',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('portfolios', [
        'user_id' => $worker->id,
        'title' => 'My Work',
    ]);
});

it('allows worker to post progress update on accepted job', function () {
    $employer = User::factory()->create(['active_mode' => 'employer']);
    $worker = User::factory()->create(['active_mode' => 'worker']);

    $job = JobPosting::factory()->create(['user_id' => $employer->id]);
    $job->jobApplications()->create([
        'user_id' => $worker->id,
        'message' => 'Hire me',
        'status' => 'accepted',
    ]);

    $response = $this->actingAs($worker)->post("/jobs/{$job->id}/progress", [
        'message' => 'Finished phase 1',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('job_progress_updates', [
        'job_posting_id' => $job->id,
        'user_id' => $worker->id,
        'message' => 'Finished phase 1',
    ]);
});

it('prevents non-accepted worker from posting progress update', function () {
    $employer = User::factory()->create(['active_mode' => 'employer']);
    $worker = User::factory()->create(['active_mode' => 'worker']);

    $job = JobPosting::factory()->create(['user_id' => $employer->id]);
    $job->jobApplications()->create([
        'user_id' => $worker->id,
        'message' => 'Hire me',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($worker)->post("/jobs/{$job->id}/progress", [
        'message' => 'Finished phase 1',
    ]);

    $response->assertForbidden();
});

it('allows user to update profile with bio and skills', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch('/settings/profile', [
        'name' => 'Jane Doe',
        'email' => $user->email,
        'bio' => 'New bio',
        'address' => '123 Main St',
        'skills' => 'Plumbing, Gardening',
    ]);

    $response->assertRedirect('/settings/profile');

    $user->refresh();
    expect($user->bio)->toBe('New bio');
    expect($user->address)->toBe('123 Main St');
    expect($user->skills)->toBe(['Plumbing', 'Gardening']);
});
