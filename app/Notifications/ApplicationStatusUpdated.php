<?php

namespace App\Notifications;

use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification
{
    public function __construct(
        public readonly JobApplication $application,
        public readonly JobPosting $jobPosting,
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
        $statusLabel = match ($this->application->status) {
            'accepted' => 'diterima',
            'rejected' => 'ditolak',
            default => $this->application->status,
        };

        return [
            'type' => 'application_status_updated',
            'job_posting_id' => $this->jobPosting->id,
            'job_posting_title' => $this->jobPosting->title,
            'application_id' => $this->application->id,
            'status' => $this->application->status,
            'message' => __('Lamaran Anda untuk tugas ":title" telah :status.', [
                'title' => $this->jobPosting->title,
                'status' => $statusLabel,
            ]),
        ];
    }
}
