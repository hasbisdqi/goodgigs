<?php

use App\Models\Endorsement;
use App\Models\JobPosting;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('can view public profile of a user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('profile.show', $user));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('profile/show')
        ->has('profileUser.name')
        ->has('stats.average_rating')
        ->has('stats.total_reviews')
        ->has('stats.total_endorsements')
    );
});

it('calculates average rating and total stats correctly', function () {
    $viewer = User::factory()->create();
    $profileUser = User::factory()->create();
    $job = JobPosting::factory()->create(['user_id' => $profileUser->id]);

    Review::create([
        'reviewer_id' => $viewer->id,
        'reviewee_id' => $profileUser->id,
        'job_posting_id' => $job->id,
        'rating' => 4,
        'comment' => 'Good job',
    ]);

    Endorsement::create([
        'endorser_id' => $viewer->id,
        'endorsee_id' => $profileUser->id,
    ]);

    $response = $this->actingAs($viewer)->get(route('profile.show', $profileUser));

    $response->assertInertia(fn (Assert $page) => $page
        ->where('stats.average_rating', 4)
        ->where('stats.total_reviews', 1)
        ->where('stats.total_endorsements', 1)
        ->where('has_endorsed', true)
    );
});
