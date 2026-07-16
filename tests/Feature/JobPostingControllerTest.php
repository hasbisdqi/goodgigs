<?php

use App\Models\JobPosting;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('jobs.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can view the jobs list', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('jobs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('jobs/index')
        ->has('jobs')
    );
});

test('authenticated users can search jobs by title, company, or location', function () {
    $user = User::factory()->create();

    $job1 = JobPosting::factory()->create(['title' => 'React Developer', 'company' => 'GoodGigs Corp']);
    $job2 = JobPosting::factory()->create(['title' => 'Laravel Engineer', 'location' => 'Remote']);

    // Search by title
    $response = $this
        ->actingAs($user)
        ->get(route('jobs.index', ['search' => 'React']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('filters.search', 'React')
        ->has('jobs.data', 1)
    );

    // Search by location
    $response = $this
        ->actingAs($user)
        ->get(route('jobs.index', ['search' => 'Remote']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('filters.search', 'Remote')
        ->has('jobs.data', 1)
    );
});

test('authenticated users can post a new job vacancy', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('jobs.store'), [
            'title' => 'Fullstack Dev',
            'company' => 'Awesome Startup',
            'description' => 'We need an expert developer.',
            'location' => 'Jakarta, Indonesia',
            'salary' => '$3k - $5k',
            'type' => 'Full-time',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('job_postings', [
        'title' => 'Fullstack Dev',
        'company' => 'Awesome Startup',
        'user_id' => $user->id,
    ]);
});

test('creator of a job posting can update it', function () {
    $user = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $user->id, 'title' => 'Old Title']);

    $response = $this
        ->actingAs($user)
        ->patch(route('jobs.update', $job), [
            'title' => 'New Title',
            'company' => $job->company,
            'description' => 'Updated desc.',
            'location' => $job->location,
            'type' => $job->type,
            'salary' => $job->salary,
        ]);

    $response->assertRedirect();
    $job->refresh();

    expect($job->title)->toBe('New Title');
    expect($job->description)->toBe('Updated desc.');
});

test('unrelated users cannot update a job posting', function () {
    $creator = User::factory()->create();
    $unrelatedUser = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id, 'title' => 'Old Title']);

    $response = $this
        ->actingAs($unrelatedUser)
        ->patch(route('jobs.update', $job), [
            'title' => 'New Title',
            'company' => $job->company,
            'description' => 'Updated desc.',
            'location' => $job->location,
            'type' => $job->type,
            'salary' => $job->salary,
        ]);

    $response->assertStatus(403);
    $job->refresh();

    expect($job->title)->toBe('Old Title');
});

test('system administrators can update any job posting', function () {
    $creator = User::factory()->create();
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $job = JobPosting::factory()->create(['user_id' => $creator->id, 'title' => 'Old Title']);

    $response = $this
        ->actingAs($admin)
        ->patch(route('jobs.update', $job), [
            'title' => 'Admin Updated Title',
            'company' => $job->company,
            'description' => 'Updated desc.',
            'location' => $job->location,
            'type' => $job->type,
            'salary' => $job->salary,
        ]);

    $response->assertRedirect();
    $job->refresh();

    expect($job->title)->toBe('Admin Updated Title');
});

test('creator of a job posting can delete it', function () {
    $user = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->delete(route('jobs.destroy', $job));

    $response->assertRedirect();
    $this->assertDatabaseMissing('job_postings', [
        'id' => $job->id,
    ]);
});

test('unrelated users cannot delete a job posting', function () {
    $creator = User::factory()->create();
    $unrelatedUser = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this
        ->actingAs($unrelatedUser)
        ->delete(route('jobs.destroy', $job));

    $response->assertStatus(403);
    $this->assertDatabaseHas('job_postings', [
        'id' => $job->id,
    ]);
});

test('system administrators can delete any job posting', function () {
    $creator = User::factory()->create();
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this
        ->actingAs($admin)
        ->delete(route('jobs.destroy', $job));

    $response->assertRedirect();
    $this->assertDatabaseMissing('job_postings', [
        'id' => $job->id,
    ]);
});

test('unverified users can view the jobs list', function () {
    $user = User::factory()->unverified()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('jobs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('jobs/index')
        ->has('jobs')
    );
});

test('unverified users cannot post a new job vacancy', function () {
    $user = User::factory()->unverified()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('jobs.store'), [
            'title' => 'Fullstack Dev',
            'company' => 'Awesome Startup',
            'description' => 'We need an expert developer.',
            'location' => 'Jakarta, Indonesia',
            'salary' => '$3k - $5k',
            'type' => 'Full-time',
        ]);

    $response->assertRedirect(route('verification.notice'));
    $this->assertDatabaseMissing('job_postings', [
        'title' => 'Fullstack Dev',
        'company' => 'Awesome Startup',
    ]);
});
