<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests cannot switch mode', function () {
    $response = $this->post(route('profile.switch-mode'), ['mode' => 'employer']);
    $response->assertRedirect(route('login'));
});

test('authenticated users can switch to employer mode', function () {
    $user = User::factory()->create(['active_mode' => 'worker']);

    $response = $this
        ->actingAs($user)
        ->post(route('profile.switch-mode'), ['mode' => 'employer']);

    $response->assertRedirect();
    $user->refresh();
    expect($user->active_mode)->toBe('employer');
});

test('authenticated users can switch to worker mode', function () {
    $user = User::factory()->create(['active_mode' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('profile.switch-mode'), ['mode' => 'worker']);

    $response->assertRedirect();
    $user->refresh();
    expect($user->active_mode)->toBe('worker');
});

test('switching to an invalid mode is rejected', function () {
    $user = User::factory()->create(['active_mode' => 'worker']);

    $response = $this
        ->actingAs($user)
        ->post(route('profile.switch-mode'), ['mode' => 'admin']);

    $response->assertSessionHasErrors(['mode']);
    $user->refresh();
    expect($user->active_mode)->toBe('worker');
});

test('switching mode without a mode parameter is rejected', function () {
    $user = User::factory()->create(['active_mode' => 'worker']);

    $response = $this
        ->actingAs($user)
        ->post(route('profile.switch-mode'), []);

    $response->assertSessionHasErrors(['mode']);
    $user->refresh();
    expect($user->active_mode)->toBe('worker');
});
