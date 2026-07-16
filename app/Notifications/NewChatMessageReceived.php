<?php

namespace App\Notifications;

use App\Models\ChatMessage;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Notifications\Notification;

class NewChatMessageReceived extends Notification
{
    public function __construct(
        public readonly ChatMessage $chatMessage,
        public readonly JobPosting $jobPosting,
        public readonly User $sender,
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
            'type' => 'new_chat_message',
            'job_posting_id' => $this->jobPosting->id,
            'job_posting_title' => $this->jobPosting->title,
            'chat_message_id' => $this->chatMessage->id,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'message' => __(':name mengirim pesan terkait tugas ":title".', [
                'name' => $this->sender->name,
                'title' => $this->jobPosting->title,
            ]),
        ];
    }
}
