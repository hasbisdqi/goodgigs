<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;

beforeEach(function () {
    $this->employer = User::factory()->create();
    $this->worker = User::factory()->create();
    $this->job = JobPosting::factory()->create(['user_id' => $this->employer->id]);

    $this->session = AttendanceSession::create([
        'job_posting_id' => $this->job->id,
        'worker_id' => $this->worker->id,
        'employer_id' => $this->employer->id,
        'status' => 'meeting_confirmed',
        'meeting_confirmed_at' => now(),
    ]);
});

it('allows employer to generate qr', function () {
    $response = $this->actingAs($this->employer)->post(route('attendance.qr.generate', $this->session));
    $response->assertSessionHas('qr_token');
    $this->assertDatabaseCount('qr_verifications', 1);
});

it('allows worker to verify qr', function () {
    $qr = $this->session->qrVerification()->create([
        'token' => 'test-token',
        'expires_at' => now()->addMinutes(10),
    ]);

    $response = $this->actingAs($this->worker)->post(route('attendance.qr.verify', $this->session), [
        'token' => 'test-token',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('attendance_sessions', [
        'id' => $this->session->id,
        'status' => 'working',
    ]);
});

it('prevents verification with expired qr', function () {
    $qr = $this->session->qrVerification()->create([
        'token' => 'expired-token',
        'expires_at' => now()->subMinutes(10),
    ]);

    $response = $this->actingAs($this->worker)->post(route('attendance.qr.verify', $this->session), [
        'token' => 'expired-token',
    ]);

    $response->assertSessionHasErrors(['token']);
});

it('allows employer to generate pin', function () {
    $response = $this->actingAs($this->employer)->post(route('attendance.pin.generate', $this->session));
    $response->assertSessionHas('pin');
    $this->assertDatabaseCount('pin_verifications', 1);
});

it('allows worker to verify pin', function () {
    $pin = $this->session->pinVerification()->create([
        'pin' => '123456',
        'expires_at' => now()->addMinutes(10),
    ]);

    $response = $this->actingAs($this->worker)->post(route('attendance.pin.verify', $this->session), [
        'pin' => '123456',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('attendance_sessions', [
        'id' => $this->session->id,
        'status' => 'working',
    ]);
});
