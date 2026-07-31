<?php

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

test('regular user cannot access admin', function () {
    $user = \App\Models\User::factory()->create();
    
    $response = $this->actingAs($user)->get('/admin');

    $response->assertStatus(403);
});
