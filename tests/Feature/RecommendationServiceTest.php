<?php

use App\Models\JobPosting;
use App\Models\User;
use App\Services\RecommendationService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('calculates skill and distance matches properly for recommendations', function () {
    $worker = User::factory()->create([
        'active_mode' => 'worker',
        'skills' => ['plumbing', 'electrical'],
        'latitude' => -6.200000,
        'longitude' => 106.816666, // Jakarta
    ]);

    $employer = User::factory()->create(['active_mode' => 'employer']);

    // Perfect match (skill + close distance)
    $job1 = JobPosting::factory()->create([
        'user_id' => $employer->id,
        'title' => 'Plumbing Repair',
        'description' => 'Need help with plumbing',
        'latitude' => -6.205000, // Very close
        'longitude' => 106.820000,
        'status' => 'open',
    ]);

    // Partial match (no skill, but close distance)
    $job2 = JobPosting::factory()->create([
        'user_id' => $employer->id,
        'title' => 'Gardening',
        'description' => 'Need someone to cut grass',
        'latitude' => -6.210000,
        'longitude' => 106.810000,
        'status' => 'open',
    ]);

    // Skill match but far distance
    $job3 = JobPosting::factory()->create([
        'user_id' => $employer->id,
        'title' => 'Electrical work',
        'description' => 'Fix wires',
        'latitude' => -6.900000, // Bandung (far)
        'longitude' => 107.600000,
        'status' => 'open',
    ]);

    $service = new RecommendationService;
    $recommended = $service->getRecommendedJobs($worker);

    // Job1 should be first (skill 10 + distance ~14 = ~24)
    // Job2 should be second (skill 0 + distance ~13 = ~13)
    // Job3 should be third (skill 10 + distance 0 = 10)

    expect($recommended->count())->toBeGreaterThan(0);
    expect($recommended->first()->id)->toBe($job1->id);
    expect($recommended->last()->id)->toBe($job3->id);
});

it('recommends fair wage based on historical data', function () {
    $employer = User::factory()->create();

    JobPosting::factory()->create([
        'user_id' => $employer->id,
        'type' => 'Full-time',
        'salary' => 'Rp 100.000 / day',
    ]);

    JobPosting::factory()->create([
        'user_id' => $employer->id,
        'type' => 'Full-time',
        'salary' => '150000',
    ]);

    // Should ignore non-numeric or small numbers
    JobPosting::factory()->create([
        'user_id' => $employer->id,
        'type' => 'Full-time',
        'salary' => '2 days',
    ]);

    $service = new RecommendationService;
    $wage = $service->getFairWageRecommendation('Full-time');

    // (100000 + 150000) / 2 = 125000
    expect($wage)->toBe(125000);
});

it('returns null if no wage data exists', function () {
    $service = new RecommendationService;
    $wage = $service->getFairWageRecommendation('Unknown Type');

    expect($wage)->toBeNull();
});

it('returns wage recommendation via api', function () {
    $employer = User::factory()->create();
    JobPosting::factory()->create([
        'user_id' => $employer->id,
        'type' => 'Urgent',
        'salary' => '500000',
    ]);

    $this->actingAs(User::factory()->create())
        ->getJson('/api/wage-recommendation?type=Urgent')
        ->assertStatus(200)
        ->assertJson(['wage' => 500000]);
});
