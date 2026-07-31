<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use App\Models\User;
use App\Notifications\DisputeNotification;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DisputeController extends Controller
{
    /**
     * Report a No-Show for a specific attendance session.
     */
    public function reportNoShow(Request $request, AttendanceSession $attendanceSession)
    {
        $user = $request->user();

        // Ensure user is part of this session
        if ($attendanceSession->worker_id !== $user->id && $attendanceSession->employer_id !== $user->id) {
            abort(403);
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        // Grace period logic (30 minutes from job start time if we had a scheduled time,
        // but since we only have created_at of the session, let's use that + 30 mins)
        // In a real app we'd use Job schedule time.
        $gracePeriodEndsAt = $attendanceSession->created_at->addMinutes(config('attendance.grace_period_minutes', 30));

        if (now()->lessThan($gracePeriodEndsAt)) {
            throw ValidationException::withMessages([
                'grace_period' => 'You cannot report a no-show before the grace period ends ('.$gracePeriodEndsAt->format('H:i').').',
            ]);
        }

        if ($attendanceSession->status === 'completed' || $attendanceSession->status === 'working') {
            throw ValidationException::withMessages([
                'general' => 'Cannot report no-show for an active or completed session.',
            ]);
        }

        $reportedUserId = $attendanceSession->worker_id === $user->id
                            ? $attendanceSession->employer_id
                            : $attendanceSession->worker_id;

        $dispute = $attendanceSession->disputes()->create([
            'reporter_id' => $user->id,
            'reported_user_id' => $reportedUserId,
            'reason' => $request->reason,
            'status' => 'open',
        ]);

        $attendanceSession->update(['status' => 'disputed']);

        $attendanceSession->events()->create([
            'event' => 'dispute_created',
            'actor_id' => $user->id,
            'metadata' => ['dispute_id' => $dispute->id, 'reason' => 'no_show'],
        ]);

        // Send Notification to the reported user
        $reportedUser = User::find($reportedUserId);
        if ($reportedUser) {
            $reportedUser->notify(new DisputeNotification(
                $attendanceSession,
                'A no-show dispute has been reported against you.'
            ));
        }

        return back()->with('success', 'No-show reported successfully.');
    }
}
