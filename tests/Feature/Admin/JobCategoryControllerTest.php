<?php

use App\Models\JobCategory;
use App\Models\User;
use Spatie\Permission\Models\Role;

it('allows super admin to create category', function () {
    $role = Role::firstOrCreate(['name' => 'Super Admin']);
    $user = User::factory()->create();
    $user->assignRole($role);

    $response = $this->actingAs($user)->post('/admin/categories', [
        'name' => 'Perbaikan Rumah',
        'description' => 'Tukang dan kelistrikan',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('job_categories', [
        'name' => 'Perbaikan Rumah',
        'slug' => 'perbaikan-rumah',
    ]);
});

it('allows super admin to update category', function () {
    $role = Role::firstOrCreate(['name' => 'Super Admin']);
    $user = User::factory()->create();
    $user->assignRole($role);

    $category = JobCategory::create([
        'name' => 'Tukang',
        'slug' => 'tukang',
    ]);

    $response = $this->actingAs($user)->patch("/admin/categories/{$category->id}", [
        'name' => 'Tukang Ahli',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('job_categories', [
        'name' => 'Tukang Ahli',
        'slug' => 'tukang-ahli',
    ]);
});
