<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.users.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can view the users list', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users')
        ->has('users')
    );
});

test('authenticated users can search other users', function () {
    $admin = User::factory()->create();
    $user1 = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
    $user2 = User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

    $response = $this
        ->actingAs($admin)
        ->get(route('admin.users.index', ['search' => 'John']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users')
        ->where('filters.search', 'John')
        // Page shows only matched users + the logged in admin user
        ->has('users.data')
    );
});

test('a new user can be created', function () {
    $admin = User::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
    ]);

    $createdUser = User::where('email', 'newuser@example.com')->first();
    expect(Hash::check('password123', $createdUser->password))->toBeTrue();
});

test('a user can be updated', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'oldemail@example.com',
    ]);

    $response = $this
        ->actingAs($admin)
        ->patch(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updatedemail@example.com',
            'password' => 'newpassword123',
        ]);

    $response->assertRedirect();
    $user->refresh();

    expect($user->name)->toBe('Updated Name');
    expect($user->email)->toBe('updatedemail@example.com');
    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
});

test('a user can be updated without changing password', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'oldemail@example.com',
    ]);
    $oldPasswordHash = $user->password;

    $response = $this
        ->actingAs($admin)
        ->patch(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updatedemail@example.com',
            'password' => '',
        ]);

    $response->assertRedirect();
    $user->refresh();

    expect($user->name)->toBe('Updated Name');
    expect($user->email)->toBe('updatedemail@example.com');
    expect($user->password)->toBe($oldPasswordHash);
});

test('a user can be deleted', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->delete(route('admin.users.destroy', $user));

    $response->assertRedirect();
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('a user cannot delete themselves', function () {
    $admin = User::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin));

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
    ]);
});
