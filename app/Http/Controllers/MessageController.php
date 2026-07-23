<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ChatMessage;
use App\Models\JobPosting;
use App\Models\User;

class MessageController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $messages = ChatMessage::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver', 'jobPosting'])
            ->latest()
            ->get();

        $conversations = collect();
        $seen = [];

        foreach ($messages as $msg) {
            $otherUser = $msg->sender_id === $userId ? $msg->receiver : $msg->sender;
            if (!$otherUser) continue;
            
            $key = $msg->job_posting_id . '-' . $otherUser->id;
            
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                
                $unreadCount = ChatMessage::where('job_posting_id', $msg->job_posting_id)
                    ->where('sender_id', $otherUser->id)
                    ->where('receiver_id', $userId)
                    ->whereNull('read_at')
                    ->count();

                $conversations->push([
                    'job_posting_id' => $msg->job_posting_id,
                    'job_title' => $msg->jobPosting->title ?? 'Unknown Job',
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                    ],
                    'last_message' => $msg->message,
                    'created_at' => $msg->created_at,
                    'unread_count' => $unreadCount,
                    'is_online' => true,
                ]);
            }
        }

        return Inertia::render('messages/index', [
            'conversations' => $conversations->values(),
        ]);
    }

    public function show(Request $request, JobPosting $jobPosting, User $user): Response
    {
        $currentUser = $request->user();
        
        $messages = ChatMessage::where('job_posting_id', $jobPosting->id)
            ->where(function ($query) use ($currentUser, $user) {
                $query->where(function ($q) use ($currentUser, $user) {
                    $q->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
                })->orWhere(function ($q) use ($currentUser, $user) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
                });
            })
            ->with(['sender:id,name', 'receiver:id,name'])
            ->orderBy('created_at', 'asc')
            ->get();

        ChatMessage::where('job_posting_id', $jobPosting->id)
            ->where('sender_id', $user->id)
            ->where('receiver_id', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('messages/chat', [
            'jobPosting' => [
                'id' => $jobPosting->id,
                'title' => $jobPosting->title,
            ],
            'otherUser' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'messages' => $messages,
        ]);
    }
}
