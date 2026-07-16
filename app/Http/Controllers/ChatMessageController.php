<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\JobPosting;
use App\Models\User;
use App\Notifications\NewChatMessageReceived;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatMessageController extends Controller
{
    /**
     * Fetch all messages for a job posting between the current user and the other party.
     */
    public function index(Request $request, JobPosting $jobPosting): JsonResponse
    {
        $currentUser = $request->user();

        $messages = ChatMessage::where('job_posting_id', $jobPosting->id)
            ->where(function ($query) use ($currentUser) {
                $query->where('sender_id', $currentUser->id)
                    ->orWhere('receiver_id', $currentUser->id);
            })
            ->with(['sender:id,name', 'receiver:id,name'])
            ->orderBy('created_at')
            ->get();

        // Mark unread messages (received by current user) as read
        ChatMessage::where('job_posting_id', $jobPosting->id)
            ->where('receiver_id', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    /**
     * Store a new chat message for a job posting.
     */
    public function store(Request $request, JobPosting $jobPosting): RedirectResponse
    {
        $validated = $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $currentUser = $request->user();

        // Ensure both parties are involved with this job posting (owner or applicant)
        $isOwner = $jobPosting->user_id === $currentUser->id;
        $isApplicant = $jobPosting->jobApplications()
            ->where('user_id', $currentUser->id)
            ->exists();
        $isReceiverOwner = $jobPosting->user_id === (int) $validated['receiver_id'];
        $isReceiverApplicant = $jobPosting->jobApplications()
            ->where('user_id', $validated['receiver_id'])
            ->exists();

        if (! ($isOwner || $isApplicant) || ! ($isReceiverOwner || $isReceiverApplicant)) {
            abort(403, __('Anda tidak memiliki akses untuk mengirim pesan di lowongan ini.'));
        }

        // Prevent messaging yourself
        if ($currentUser->id === (int) $validated['receiver_id']) {
            return back()->withErrors(['message' => __('Anda tidak bisa mengirim pesan ke diri sendiri.')]);
        }

        $chatMessage = ChatMessage::create([
            'job_posting_id' => $jobPosting->id,
            'sender_id' => $currentUser->id,
            'receiver_id' => $validated['receiver_id'],
            'message' => $validated['message'],
        ]);

        $receiver = User::find($validated['receiver_id']);
        if ($receiver) {
            $receiver->notify(new NewChatMessageReceived($chatMessage, $jobPosting, $currentUser));
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Pesan berhasil dikirim.'),
        ]);

        return redirect()->back();
    }
}
