<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageData;
    public $receiverId;

    public function __construct(ChatMessage $msg)
    {
        $this->receiverId = $msg->receiver_id;
        $this->messageData = [
            'id' => $msg->id,
            'type' => 'received',
            'text' => $msg->message,
            'time' => $msg->created_at->format('h:i A'),
            'date' => $msg->created_at->isToday() ? 'Today' : $msg->created_at->format('M d'),
            'status' => 'delivered',
            'sender_id' => $msg->sender_id,
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->receiverId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ChatMessageSent';
    }
}
