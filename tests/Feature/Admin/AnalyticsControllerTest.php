<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

it('allows super admin to view analytics dashboard', function () {
    $role = Role::firstOrCreate(['name' => 'Super Admin']);
    $user = User::factory()->create();
    $user->assignRole($role);

    $response = $this->actingAs($user)->get('/admin/analytics');

    $response->assertStatus(200);
});

it('forbids normal user from viewing analytics dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/analytics');

    $response->assertStatus(403);
});
