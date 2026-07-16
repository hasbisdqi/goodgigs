<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.roles.index'));

    $response->assertRedirect(route('login'));
});

test('unauthorized authenticated users receive a 403 forbidden', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('admin.roles.index'));

    $response->assertStatus(403);
});

test('authenticated users with permission can view the roles list', function () {
    $user = User::factory()->create();
    $user->assignRole('Super Admin');

    $response = $this
        ->actingAs($user)
        ->get(route('admin.roles.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/roles')
        ->has('roles')
        ->has('permissions')
    );
});

test('a new role can be created with permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.roles.store'), [
            'name' => 'Editor',
            'permissions' => ['manage users'],
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('roles', [
        'name' => 'Editor',
    ]);

    $role = Role::findByName('Editor');
    expect($role->hasPermissionTo('manage users'))->toBeTrue();
});

test('a role name and permissions can be updated', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $role = Role::create(['name' => 'Custom Role', 'guard_name' => 'web']);
    Permission::findOrCreate('another permission', 'web');

    $response = $this
        ->actingAs($admin)
        ->patch(route('admin.roles.update', $role), [
            'name' => 'Modified Role',
            'permissions' => ['another permission'],
        ]);

    $response->assertRedirect();
    $role->refresh();

    expect($role->name)->toBe('Modified Role');
    expect($role->hasPermissionTo('another permission'))->toBeTrue();
    expect($role->hasPermissionTo('manage users'))->toBeFalse();
});

test('super admin role cannot be updated', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $superAdminRole = Role::findByName('Super Admin');

    $response = $this
        ->actingAs($admin)
        ->patch(route('admin.roles.update', $superAdminRole), [
            'name' => 'Fake Super Admin',
            'permissions' => [],
        ]);

    $response->assertRedirect();
    $superAdminRole->refresh();

    expect($superAdminRole->name)->toBe('Super Admin');
});

test('custom roles can be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $role = Role::create(['name' => 'Delete Me', 'guard_name' => 'web']);

    $response = $this
        ->actingAs($admin)
        ->delete(route('admin.roles.destroy', $role));

    $response->assertRedirect();
    $this->assertDatabaseMissing('roles', [
        'id' => $role->id,
    ]);
});

test('system roles cannot be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $superAdminRole = Role::findByName('Super Admin');

    $response = $this
        ->actingAs($admin)
        ->delete(route('admin.roles.destroy', $superAdminRole));

    $response->assertRedirect();
    $this->assertDatabaseHas('roles', [
        'id' => $superAdminRole->id,
    ]);
});
