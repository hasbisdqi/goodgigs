<?php

use App\Models\Endorsement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows a user to endorse another user', function () {
    $endorser = User::factory()->create();
    $endorsee = User::factory()->create();

    $response = $this->actingAs($endorser)->post(route('endorsements.store', $endorsee));

    $response->assertRedirect();
    expect(Endorsement::where('endorser_id', $endorser->id)->where('endorsee_id', $endorsee->id)->exists())->toBeTrue();
});

it('prevents a user from endorsing themselves', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('endorsements.store', $user));

    $response->assertForbidden();
});

it('prevents duplicate endorsements', function () {
    $endorser = User::factory()->create();
    $endorsee = User::factory()->create();

    Endorsement::create([
        'endorser_id' => $endorser->id,
        'endorsee_id' => $endorsee->id,
    ]);

    $response = $this->actingAs($endorser)->post(route('endorsements.store', $endorsee));

    $response->assertForbidden();
});
