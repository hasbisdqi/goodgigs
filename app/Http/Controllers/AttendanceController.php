<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckInRequest;
use App\Models\AttendanceSession;
use App\Models\JobPosting;
use App\Services\AttendanceService;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $sessions = AttendanceSession::where('worker_id', $user->id)
            ->orWhere('employer_id', $user->id)
            ->with(['jobPosting', 'worker', 'employer'])
            ->latest()
            ->get();

        return Inertia::render('attendance/index', [
            'sessions' => $sessions,
        ]);
    }

    public function store(CheckInRequest $request, JobPosting $jobPosting, AttendanceService $attendanceService)
    {
        $user = $request->user();

        // Find or create attendance session
        // Note: For a real marketplace, an attendance session might be created earlier when the job is accepted.
        // We'll assume the session exists or create it on the fly if this is the first check-in.
        $session = AttendanceSession::firstOrCreate(
            ['job_posting_id' => $jobPosting->id],
            [
                'worker_id' => $jobPosting->jobApplications()->where('status', 'accepted')->first()?->user_id,
                'employer_id' => $jobPosting->user_id,
                'status' => 'waiting_checkin',
            ]
        );

        $role = $session->worker_id === $user->id ? 'worker' : ($session->employer_id === $user->id ? 'employer' : null);

        if (! $role) {
            abort(403, 'You are not a participant of this job.');
        }

        if ($session->checkIns()->where('user_id', $user->id)->exists()) {
            throw ValidationException::withMessages(['general' => 'You have already checked in.']);
        }

        // Validate Geofence if coordinates are set on the job posting
        if ($jobPosting->latitude && $jobPosting->longitude) {
            $isWithin = $attendanceService->isWithinGeofence(
                (float) $jobPosting->latitude,
                (float) $jobPosting->longitude,
                (float) $request->latitude,
                (float) $request->longitude,
                100 // 100 meters
            );

            if (! $isWithin) {
                throw ValidationException::withMessages([
                    'location' => 'You are outside the permitted job area. Please move closer to the location.',
                ]);
            }
        }

        $session->checkIns()->create([
            'user_id' => $user->id,
            'role' => $role,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'accuracy' => $request->accuracy,
            'checked_in_at' => now(),
        ]);

        $session->events()->create([
            'event' => "{$role}_checked_in",
            'actor_id' => $user->id,
            'metadata' => ['latitude' => $request->latitude, 'longitude' => $request->longitude],
        ]);

        // Evaluate Meeting Confirmation
        $checkedInCount = $session->checkIns()->count();

        if ($checkedInCount === 1) {
            $session->update(['status' => $role === 'worker' ? 'waiting_employer' : 'waiting_worker']);
        } elseif ($checkedInCount >= 2) {
            $session->update([
                'status' => 'meeting_confirmed',
                'meeting_confirmed_at' => now(),
            ]);
            $session->events()->create(['event' => 'meeting_confirmed']);
        }

        return back()->with('success', 'Checked in successfully.');
    }

    public function show(AttendanceSession $attendanceSession)
    {
        $attendanceSession->load(['checkIns', 'events', 'evidences', 'qrVerification', 'pinVerification', 'disputes']);

        return Inertia::render('attendance/show', [
            'session' => $attendanceSession,
        ]);
    }
}
