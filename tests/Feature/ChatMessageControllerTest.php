<?php

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\NewChatMessageReceived;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests cannot view or send chat messages', function () {
    $creator = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this->get(route('chat-messages.index', $job));
    $response->assertRedirect(route('login'));

    $response2 = $this->post(route('chat-messages.store', $job), [
        'receiver_id' => 1,
        'message' => 'Hello',
    ]);
    $response2->assertRedirect(route('login'));
});

test('only involved parties can access the chat messages', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $unrelated = User::factory()->create();

    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    // Apply to job
    JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Saya tertarik.',
    ]);

    // Creator can access
    $this->actingAs($creator)
        ->get(route('chat-messages.index', $job))
        ->assertOk();

    // Applicant can access
    $this->actingAs($applicant)
        ->get(route('chat-messages.index', $job))
        ->assertOk();

    // Unrelated user cannot access and gets empty list
    $this->actingAs($unrelated)
        ->get(route('chat-messages.index', $job))
        ->assertJsonCount(0);
});

test('involved parties can send a message and it notifies the receiver', function () {
    Notification::fake();

    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Saya tertarik.',
    ]);

    $response = $this->actingAs($applicant)
        ->post(route('chat-messages.store', $job), [
            'receiver_id' => $creator->id,
            'message' => 'Halo boss, kapan bisa mulai?',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('chat_messages', [
        'job_posting_id' => $job->id,
        'sender_id' => $applicant->id,
        'receiver_id' => $creator->id,
        'message' => 'Halo boss, kapan bisa mulai?',
    ]);

    Notification::assertSentTo($creator, NewChatMessageReceived::class);
});

test('users cannot send chat message to themselves', function () {
    $creator = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this->actingAs($creator)
        ->post(route('chat-messages.store', $job), [
            'receiver_id' => $creator->id,
            'message' => 'Message to self',
        ]);

    $response->assertSessionHasErrors(['message']);
});

test('unrelated users cannot send chat messages', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->create();
    $unrelated = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    JobApplication::create([
        'job_posting_id' => $job->id,
        'user_id' => $applicant->id,
        'message' => 'Saya tertarik.',
    ]);

    $response = $this->actingAs($unrelated)
        ->post(route('chat-messages.store', $job), [
            'receiver_id' => $creator->id,
            'message' => 'Spamming',
        ]);

    $response->assertStatus(403);
});

test('unverified users cannot send chat messages', function () {
    $creator = User::factory()->create();
    $applicant = User::factory()->unverified()->create();
    $job = JobPosting::factory()->create(['user_id' => $creator->id]);

    $response = $this->actingAs($applicant)
        ->post(route('chat-messages.store', $job), [
            'receiver_id' => $creator->id,
            'message' => 'Halo',
        ]);

    $response->assertRedirect(route('verification.notice'));
});
