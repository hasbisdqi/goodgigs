<?php

use App\Models\ChatMessage;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\NewChatMessageReceived;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests cannot access notification endpoints', function () {
    $response = $this->get(route('notifications.index'));
    $response->assertRedirect(route('login'));

    $response2 = $this->post(route('notifications.read', 'some-uuid'));
    $response2->assertRedirect(route('login'));

    $response3 = $this->post(route('notifications.read-all'));
    $response3->assertRedirect(route('login'));
});

test('unverified users cannot access notification endpoints', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('notifications.index'));
    $response->assertRedirect(route('verification.notice'));

    $response2 = $this->actingAs($user)->post(route('notifications.read', 'some-uuid'));
    $response2->assertRedirect(route('verification.notice'));

    $response3 = $this->actingAs($user)->post(route('notifications.read-all'));
    $response3->assertRedirect(route('verification.notice'));
});

test('authenticated users can fetch their notifications', function () {
    $user = User::factory()->create();
    $sender = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $user->id]);
    $message = ChatMessage::create([
        'job_posting_id' => $job->id,
        'sender_id' => $sender->id,
        'receiver_id' => $user->id,
        'message' => 'Hello',
    ]);

    // Send a real notification
    $user->notify(new NewChatMessageReceived($message, $job, $sender));

    $response = $this->actingAs($user)->get(route('notifications.index'));
    $response->assertOk();
    $response->assertJsonCount(1);
    $response->assertJsonFragment([
        'type' => NewChatMessageReceived::class,
        'notifiable_id' => $user->id,
    ]);
});

test('authenticated users can mark a notification as read', function () {
    $user = User::factory()->create();
    $sender = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $user->id]);
    $message = ChatMessage::create([
        'job_posting_id' => $job->id,
        'sender_id' => $sender->id,
        'receiver_id' => $user->id,
        'message' => 'Hello',
    ]);

    $user->notify(new NewChatMessageReceived($message, $job, $sender));

    $notification = $user->unreadNotifications->first();
    expect($notification)->not->toBeNull();

    $response = $this->actingAs($user)->post(route('notifications.read', $notification->id));
    $response->assertOk();

    expect($user->fresh()->unreadNotifications->count())->toBe(0);
    expect($user->fresh()->notifications->first()->read_at)->not->toBeNull();
});

test('authenticated users can mark all notifications as read', function () {
    $user = User::factory()->create();
    $sender = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $user->id]);

    $message1 = ChatMessage::create([
        'job_posting_id' => $job->id,
        'sender_id' => $sender->id,
        'receiver_id' => $user->id,
        'message' => 'Hello 1',
    ]);
    $message2 = ChatMessage::create([
        'job_posting_id' => $job->id,
        'sender_id' => $sender->id,
        'receiver_id' => $user->id,
        'message' => 'Hello 2',
    ]);

    $user->notify(new NewChatMessageReceived($message1, $job, $sender));
    $user->notify(new NewChatMessageReceived($message2, $job, $sender));

    expect($user->unreadNotifications->count())->toBe(2);

    $response = $this->actingAs($user)->post(route('notifications.read-all'));
    $response->assertOk();

    expect($user->fresh()->unreadNotifications->count())->toBe(0);
});
