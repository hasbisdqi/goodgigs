<?php

use App\Models\User;
use App\Models\JobPosting;
use function Pest\Laravel\actingAs;

it('allows employer to view create gig page', function () {
    $employer = User::factory()->create(['role' => 'employer']);
    
    actingAs($employer)
        ->get('/employer/gigs/create')
        ->assertStatus(200);
});

it('allows employer to create a gig', function () {
    $employer = User::factory()->create(['role' => 'employer']);
    
    actingAs($employer)
        ->post('/employer/gigs', [
            'title' => 'Graphic Designer Needed',
            'type' => 'Design', // Changed from category to type since DB expects type
            'description' => 'Need a logo for my cafe.',
            'location' => 'Jakarta Selatan',
            'salary' => '150000',
            'duration' => '2-3 hours',
        ])
        ->assertRedirect('/employer/dashboard');
        
    $this->assertDatabaseHas('job_postings', [
        'title' => 'Graphic Designer Needed',
        'user_id' => $employer->id,
        'salary' => '150000',
    ]);
});

it('enforces minimum wage validation', function () {
    $employer = User::factory()->create(['role' => 'employer']);
    
    actingAs($employer)
        ->post('/employer/gigs', [
            'title' => 'Graphic Designer Needed',
            'type' => 'Design',
            'description' => 'Need a logo for my cafe.',
            'location' => 'Jakarta Selatan',
            'salary' => '15000', // Below minimum wage (let's say min is 50k)
            'duration' => '2-3 hours',
        ])
        ->assertSessionHasErrors(['salary']);
});
