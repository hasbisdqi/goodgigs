<?php

namespace App\Notifications;

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Notifications\Notification;

class JobApplicationReceived extends Notification
{
    public function __construct(
        public readonly JobApplication $application,
        public readonly JobPosting $jobPosting,
        public readonly User $applicant,
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
            'type' => 'job_application_received',
            'job_posting_id' => $this->jobPosting->id,
            'job_posting_title' => $this->jobPosting->title,
            'application_id' => $this->application->id,
            'applicant_id' => $this->applicant->id,
            'applicant_name' => $this->applicant->name,
            'message' => __(':name melamar tugas ":title" Anda.', [
                'name' => $this->applicant->name,
                'title' => $this->jobPosting->title,
            ]),
        ];
    }
}
