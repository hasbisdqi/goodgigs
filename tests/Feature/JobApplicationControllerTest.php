<?php

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests cannot apply for jobs or update application status', function () {
    $response = $this->post(route('job-applications.store'), [
        'job_posting_id' => 1,
        'message' => 'Hello',
    ]);
    $response->assertRedirect(route('login'));

    $response2 = $this->patch(route('job-applications.update', 1), [
        'status' => 'accepted',
    ]);
    $response2->assertRedirect(route('login'));
});

test('authenticated users can apply to a gig', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this
        ->actingAs($applicant)
        ->post(route('job-applications.store'), [
            'job_posting_id' => $job->id,
            'message' => 'Saya tertarik membantu memperbaiki pipa Anda.',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('job_applications', [
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Saya tertarik membantu memperbaiki pipa Anda.',
        'status' => 'pending',
    ]);
});

test('creators cannot apply to their own gig', function () {
    $creator = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this
        ->actingAs($creator)
        ->post(route('job-applications.store'), [
            'job_posting_id' => $job->id,
            'message' => 'Saya pembuat gig ini.',
        ]);

    $response->assertSessionHasErrors(['message']);
    $this->assertDatabaseMissing('job_applications', [
        'job_posting_id' => $job->id,
        'user_id' => $creator->id,
    ]);
});

test('applicants cannot apply to the same gig twice', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    // First application
    JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'First try',
    ]);

    // Second application
    $response = $this
        ->actingAs($applicant)
        ->post(route('job-applications.store'), [
            'job_posting_id' => $job->id,
            'message' => 'Second try',
        ]);

    $response->assertSessionHasErrors(['message']);
    expect(JobApplication::where('job_posting_id', $job->id)->where('user_id', $applicant->id)->count())->toBe(1);
});

test('creator of the gig can accept or reject an application', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $application = JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Help me',
    ]);

    // Accept application
    $response = $this
        ->actingAs($creator)
        ->patch(route('job-applications.update', $application), [
            'status' => 'accepted',
        ]);

    $response->assertRedirect();
    $application->refresh();
    expect($application->status)->toBe('accepted');

    // Reject application
    $response2 = $this
        ->actingAs($creator)
        ->patch(route('job-applications.update', $application), [
            'status' => 'rejected',
        ]);

    $response2->assertRedirect();
    $application->refresh();
    expect($application->status)->toBe('rejected');
});

test('unrelated users cannot update application status', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $unrelatedUser = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $application = JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Help me',
    ]);

    $response = $this
        ->actingAs($unrelatedUser)
        ->patch(route('job-applications.update', $application), [
            'status' => 'accepted',
        ]);

    $response->assertStatus(403);
    $application->refresh();
    expect($application->status)->toBe('pending');
});

test('system administrators can update any application status', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $application = JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Help me',
    ]);

    $response = $this
        ->actingAs($admin)
        ->patch(route('job-applications.update', $application), [
            'status' => 'accepted',
        ]);

    $response->assertRedirect();
    $application->refresh();
    expect($application->status)->toBe('accepted');
});
