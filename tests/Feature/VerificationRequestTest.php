<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('allows user to submit identity verification', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('ktp.jpg');

    $response = $this->actingAs($user)
        ->post('/verifications', [
            'type' => 'identity',
            'document' => $file,
        ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('verification_requests', [
        'user_id' => $user->id,
        'type' => 'identity',
        'status' => 'pending',
    ]);
});

it('allows user to submit skill verification', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('sertifikat.pdf', 1000, 'application/pdf');

    $response = $this->actingAs($user)
        ->post('/verifications', [
            'type' => 'skill',
            'document' => $file,
            'skill_name' => 'Certified Electrician',
        ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('verification_requests', [
        'user_id' => $user->id,
        'type' => 'skill',
        'skill_name' => 'Certified Electrician',
        'status' => 'pending',
    ]);
});
