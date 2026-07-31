<?php

namespace App\Notifications;

use App\Models\AttendanceSession;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReminderConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public AttendanceSession $session
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'reminder_confirmation',
            'session_id' => $this->session->id,
            'job_posting_id' => $this->session->job_posting_id,
            'message' => 'Reminder: The worker has completed their job. Please review and confirm the attendance.',
        ];
    }
}
