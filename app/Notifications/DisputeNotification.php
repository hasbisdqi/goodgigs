<?php

namespace App\Notifications;

use App\Models\AttendanceSession;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class DisputeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public AttendanceSession $session,
        public string $disputeMessage
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'dispute',
            'session_id' => $this->session->id,
            'job_posting_id' => $this->session->job_posting_id,
            'message' => $this->disputeMessage,
        ];
    }
}
