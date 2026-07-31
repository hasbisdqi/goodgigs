<?php

use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->employer = User::factory()->create();
    $this->worker = User::factory()->create();
    $this->job = JobPosting::factory()->create(['user_id' => $this->employer->id]);

    $this->session = AttendanceSession::create([
        'job_posting_id' => $this->job->id,
        'worker_id' => $this->worker->id,
        'employer_id' => $this->employer->id,
        'status' => 'working',
    ]);
});

it('allows evidence upload', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('evidence.jpg');

    $response = $this->actingAs($this->worker)->post(route('attendance.evidence.upload', $this->session), [
        'evidence' => $file,
        'latitude' => -6.123,
        'longitude' => 106.123,
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseCount('evidence', 1);

    $this->assertDatabaseHas('evidence', [
        'uploader_id' => $this->worker->id,
        'type' => 'photo',
    ]);
});
