<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class VerificationController extends Controller
{
    /**
     * Generate QR Code token for employer.
     */
    public function generateQr(Request $request, AttendanceSession $attendanceSession)
    {
        $this->authorizeSession($request->user(), $attendanceSession, 'employer');

        $qr = $attendanceSession->qrVerification()->create([
            'token' => Str::random(32),
            'expires_at' => now()->addMinutes(10), // Configurable validity
        ]);

        return back()->with('qr_token', $qr->token);
    }

    /**
     * Verify QR Code token by worker.
     */
    public function verifyQr(Request $request, AttendanceSession $attendanceSession)
    {
        $this->authorizeSession($request->user(), $attendanceSession, 'worker');

        $request->validate(['token' => 'required|string']);

        $qr = $attendanceSession->qrVerification()
            ->where('token', $request->token)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $qr) {
            throw ValidationException::withMessages(['token' => 'Invalid or expired QR code.']);
        }

        $qr->update(['used_at' => now()]);

        $this->startSession($attendanceSession, $request->user()->id, 'qr');

        return back()->with('success', 'QR Verified. Session started.');
    }

    /**
     * Generate PIN for employer.
     */
    public function generatePin(Request $request, AttendanceSession $attendanceSession)
    {
        $this->authorizeSession($request->user(), $attendanceSession, 'employer');

        $pin = $attendanceSession->pinVerification()->create([
            'pin' => str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'expires_at' => now()->addMinutes(10),
        ]);

        return back()->with('pin', $pin->pin);
    }

    /**
     * Verify PIN by worker.
     */
    public function verifyPin(Request $request, AttendanceSession $attendanceSession)
    {
        $this->authorizeSession($request->user(), $attendanceSession, 'worker');

        $request->validate(['pin' => 'required|string']);

        $pin = $attendanceSession->pinVerification()
            ->where('pin', $request->pin)
            ->whereNull('verified_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $pin) {
            throw ValidationException::withMessages(['pin' => 'Invalid or expired PIN.']);
        }

        $pin->update(['verified_at' => now()]);

        $this->startSession($attendanceSession, $request->user()->id, 'pin');

        return back()->with('success', 'PIN Verified. Session started.');
    }

    private function authorizeSession($user, AttendanceSession $session, $role)
    {
        if ($role === 'employer' && $session->employer_id !== $user->id) {
            abort(403);
        }
        if ($role === 'worker' && $session->worker_id !== $user->id) {
            abort(403);
        }
        if ($session->status !== 'meeting_confirmed') {
            abort(400, 'Session must be in meeting_confirmed status to verify.');
        }
    }

    private function startSession(AttendanceSession $session, $userId, $method)
    {
        $session->update([
            'status' => 'working',
            'work_started_at' => now(),
        ]);

        $session->events()->create([
            'event' => 'work_started',
            'actor_id' => $userId,
            'metadata' => ['verification_method' => $method],
        ]);
    }
}
