<?php

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('filters jobs by type', function () {
    $user = User::factory()->create();

    JobPosting::factory()->create(['type' => 'Full-time', 'title' => 'Software Engineer']);
    JobPosting::factory()->create(['type' => 'Part-time', 'title' => 'Barista']);

    $response = $this->actingAs($user)->get(route('jobs.index', ['type' => 'Part-time']));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('jobs/index')
        ->has('jobs.data', 1)
        ->where('jobs.data.0.title', 'Barista')
        ->where('filters.type', 'Part-time')
    );
});

it('filters jobs by search query (location, title, company)', function () {
    $user = User::factory()->create();

    JobPosting::factory()->create(['title' => 'Software Engineer', 'location' => 'Jakarta']);
    JobPosting::factory()->create(['title' => 'Barista', 'location' => 'Bandung']);

    $response = $this->actingAs($user)->get(route('jobs.index', ['search' => 'Bandung']));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('jobs/index')
        ->has('jobs.data', 1)
        ->where('jobs.data.0.title', 'Barista')
        ->where('filters.search', 'Bandung')
    );
});

it('can store job posting with coordinates', function () {
    $user = User::factory()->create(['active_mode' => 'employer']);

    $response = $this->actingAs($user)->post(route('jobs.store'), [
        'title' => 'Test Job',
        'company' => 'Test Company',
        'description' => 'Test Description',
        'location' => 'Jakarta',
        'salary' => '10000',
        'type' => 'Remote',
        'latitude' => -6.200000,
        'longitude' => 106.816666,
    ]);

    $response->assertRedirect();

    $job = JobPosting::first();
    expect($job->title)->toBe('Test Job');
    expect((float) $job->latitude)->toBe(-6.200000);
    expect((float) $job->longitude)->toBe(106.816666);
});
