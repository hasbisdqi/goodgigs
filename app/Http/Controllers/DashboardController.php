<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function applyToGig($id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        
        $gig = [
            'id' => $job->id,
            'title' => $job->title,
            'company' => $job->company,
            'rate' => $job->salary,
            'location' => $job->location,
        ];
        return Inertia::render('worker/ApplyToGig', ['gig' => $gig]);
    }

    public function applyToGigSubmit($id)
    {
        $user = auth()->user() ?? \App\Models\User::where('email', 'sarah@example.com')->first();
        
        \App\Models\JobApplication::create([
            'job_posting_id' => $id,
            'user_id' => $user->id,
            'status' => 'pending',
            'message' => 'Quick apply from ' . $user->name,
        ]);

        return redirect()->route('gigs.apply.success');
    }

    public function quickApply($id)
    {
        $job = \App\Models\JobPosting::with('user')->findOrFail($id);

        $gig = [
            'id' => $job->id,
            'title' => $job->title,
            'rate' => $job->salary,
            'client' => [
                'name' => $job->user ? $job->user->name : $job->company
            ]
        ];
        return Inertia::render('worker/QuickApply', ['gig' => $gig]);
    }

    public function switchMode(Request $request)
    {
        $validated = $request->validate([
            'mode' => 'required|in:worker,employer'
        ]);
        
        $user = auth()->user();
        if ($user) {
            $user->update(['active_mode' => $validated['mode']]);
        }
        
        return redirect()->back();
    }

    public function dashboard()
    {
        $user = auth()->user() ?? \App\Models\User::first();
        
        if ($user && $user->active_mode === 'employer') {
            return $this->employerDashboard($user);
        }
        
        return $this->workerDashboard($user);
    }

    protected function employerDashboard($user)
    {
        $user = auth()->user() ?? \App\Models\User::where('email', 'alex@example.com')->first();
        
        $activeGigs = \App\Models\JobPosting::where('user_id', $user->id)
            ->where('status', 'published')
            ->get();

        $escrowBudget = $activeGigs->sum(function ($gig) {
            return (int) preg_replace('/[^0-9]/', '', $gig->salary);
        });

        $stats = [
            'active_projects' => $activeGigs->count(),
            'total_applicants' => $activeGigs->sum('new_applicants'),
            'escrow_budget' => $escrowBudget,
            'avg_hire_time' => '1.4d',
        ];

        // Format gigs for UI
        $formattedGigs = $activeGigs->map(function ($gig) {
            // Strip out currency symbols for raw price if needed, but UI expects 'price'
            $price = preg_replace('/[^0-9]/', '', $gig->salary);
            return [
                'id' => $gig->id,
                'title' => $gig->title,
                'status' => $gig->new_applicants > 0 ? $gig->new_applicants . ' applicants' : 'Searching for talent',
                'duration' => $gig->duration,
                'price' => (int) $price,
                'tags' => $gig->tags ?? [],
                'new_applicants' => $gig->new_applicants,
                'icon' => $gig->icon ?? 'Briefcase',
                'color_class' => $gig->color_class ?? 'bg-surface-container-high',
                'text_class' => $gig->text_class ?? 'text-on-surface',
            ];
        });

        $inProgressApp = \App\Models\JobApplication::whereHas('jobPosting', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'accepted')->with('user', 'jobPosting')->first();

        $inProgressGig = null;
        if ($inProgressApp) {
            $inProgressGig = [
                'id' => $inProgressApp->jobPosting->id,
                'title' => $inProgressApp->jobPosting->title,
                'assigned_to' => $inProgressApp->user->name,
                'due_in' => '2 days',
                'progress' => 65,
                'icon' => $inProgressApp->jobPosting->icon ?? 'Briefcase',
            ];
        }

        $data = [
            'stats' => $stats,
            'active_gigs' => $formattedGigs,
            'in_progress_gig' => $inProgressGig,
            'recommended_talent' => \App\Models\User::where('role', 'worker')->take(3)->get()->map(function ($worker) {
                return [
                    'id' => $worker->id,
                    'name' => $worker->name,
                    'role' => $worker->title ?? 'Professional Worker',
                    'rating' => $worker->rating,
                    'reviews' => $worker->reviews_count,
                    'description' => $worker->bio ?? 'Ready to work.',
                    'avatar' => $worker->avatar,
                ];
            }),
        ];

        return Inertia::render('employer/Dashboard', $data);
    }

    protected function workerDashboard($user)
    {
        $user = auth()->user() ?? \App\Models\User::where('email', 'sarah@example.com')->first();

        // Find gigs not posted by the worker and that are published
        $recommendedGigs = \App\Models\JobPosting::where('user_id', '!=', $user->id)
            ->where('status', 'published')
            ->take(5)
            ->get();

        $stats = [
            'total_earnings' => (float) $user->total_earnings,
            'active_gigs' => \App\Models\JobApplication::where('user_id', $user->id)->count(),
            'rating' => (float) $user->rating,
        ];

        // Format for UI
        $formattedGigs = $recommendedGigs->map(function ($gig) {
            $price = preg_replace('/[^0-9]/', '', $gig->salary);
            return [
                'id' => $gig->id,
                'title' => $gig->title,
                'company' => $gig->company,
                'location' => $gig->location,
                'posted_time' => $gig->created_at->diffForHumans(),
                'rate' => (int) $price,
                'tags' => $gig->tags ?? [],
                'logo' => $gig->logo ?? 'https://via.placeholder.com/150',
            ];
        });

        $data = [
            'stats' => $stats,
            'recommended_gigs' => $formattedGigs,
        ];

        return Inertia::render('worker/Dashboard', $data);
    }

    public function browseMap()
    {
        $gigs = \App\Models\JobPosting::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('status', 'published')
            ->get();

        $markers = $gigs->map(function ($gig) {
            $price = preg_replace('/[^0-9]/', '', $gig->salary);
            return [
                'id' => $gig->id,
                'latitude' => $gig->latitude,
                'longitude' => $gig->longitude,
                'color_class' => $gig->color_class ?? 'bg-primary',
                'text_class' => $gig->text_class ?? 'text-on-primary',
                'icon' => $gig->icon ?? 'Briefcase',
                'preview' => [
                    'title' => $gig->title,
                    'price' => (int) $price,
                    'distance' => 'Live nearby', // Dynamic distance calculation can be added later
                    'image' => 'https://via.placeholder.com/150'
                ]
            ];
        });

        $data = [
            'categories' => ['All Gigs', 'Plumbing', 'Home Repair', 'Gardening', 'Electrician'],
            'markers' => $markers
        ];
        
        return Inertia::render('worker/MapBrowse', $data);
    }

    public function messagesList()
    {
        $user = auth()->user() ?? \App\Models\User::first();
        
        // Fetch latest message per conversation
        // In a real app we would use complex joins or window functions, but for SQLite prototype:
        $allMessages = \App\Models\ChatMessage::with(['sender', 'receiver'])
            ->where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        $conversations = collect();
        $seenUserIds = [];

        foreach ($allMessages as $msg) {
            $otherUser = $msg->sender_id === $user->id ? $msg->receiver : $msg->sender;
            
            if (!in_array($otherUser->id, $seenUserIds)) {
                $seenUserIds[] = $otherUser->id;
                
                // Count unread
                $unread = \App\Models\ChatMessage::where('sender_id', $otherUser->id)
                    ->where('receiver_id', $user->id)
                    ->whereNull('read_at')
                    ->count();

                $conversations->push([
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'avatar' => $otherUser->avatar,
                    'last_message' => $msg->message,
                    'time' => $msg->created_at->format('g:i A'),
                    'unread' => $unread,
                    'status' => 'online', // Mocked
                ]);
            }
        }

        return Inertia::render('MessagesList', [
            'filters' => ['All Chats', 'Unread', 'Archived'],
            'conversations' => $conversations->values()
        ]);
    }

    public function directChat($id)
    {
        $user = auth()->user() ?? \App\Models\User::first();
        $contact = \App\Models\User::findOrFail($id);

        $messages = \App\Models\ChatMessage::where(function ($q) use ($user, $contact) {
            $q->where('sender_id', $user->id)->where('receiver_id', $contact->id);
        })->orWhere(function ($q) use ($user, $contact) {
            $q->where('sender_id', $contact->id)->where('receiver_id', $user->id);
        })->orderBy('created_at', 'asc')->get();

        // Mark as read
        \App\Models\ChatMessage::where('sender_id', $contact->id)
            ->where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $formattedMessages = $messages->map(function ($msg) use ($user) {
            return [
                'id' => $msg->id,
                'type' => $msg->sender_id === $user->id ? 'sent' : 'received',
                'text' => $msg->message,
                'time' => $msg->created_at->format('h:i A'),
                'date' => $msg->created_at->isToday() ? 'Today' : $msg->created_at->format('M d'),
                'status' => $msg->read_at ? 'read' : 'delivered',
            ];
        });

        $data = [
            'contact' => [
                'id' => $contact->id,
                'name' => $contact->name,
                'role' => $contact->title ?? 'Worker',
                'status' => 'Online',
                'avatar' => $contact->avatar,
            ],
            'messages' => $formattedMessages
        ];

        return Inertia::render('DirectChat', $data);
    }

    public function userProfile()
    {
        $user = auth()->user() ?? \App\Models\User::where('email', 'sarah@example.com')->first();
        
        $data = [
            'user' => [
                'name' => $user->name,
                'title' => $user->title ?? 'Professional',
                'description' => $user->bio ?? 'No description provided.',
                'rating' => (float) $user->rating,
                'avatar' => $user->avatar,
                'skills' => $user->tags ?? ['UX Design', 'Brand Identity', 'Figma', 'Prototyping'],
                'extra_skills_count' => count($user->tags ?? []) > 4 ? count($user->tags) - 4 : 0,
                'computed_badge' => $user->computed_badge,
                'active_mode' => $user->active_mode ?? 'worker',
            ]
        ];

        return Inertia::render('UserProfile', $data);
    }

    public function proposalSuccess()
    {
        return Inertia::render('worker/ProposalSuccess');
    }

    public function liveJobTracking($id)
    {
        $job = \App\Models\JobPosting::with('user')->findOrFail($id);
        
        $data = [
            'job' => [
                'id' => $job->id,
                'type' => $job->category ?? 'Service',
                'number' => 'JB-' . str_pad($job->id, 4, '0', STR_PAD_LEFT),
                'eta_mins' => 15,
                'eta_time' => '14:30 PM',
                'distance_remaining' => '4.2 km',
                'traffic_status' => 'Moderate Traffic',
                'client' => [
                    'name' => $job->user ? $job->user->name : $job->company,
                    'avatar' => $job->user ? $job->user->avatar : 'https://ui-avatars.com/api/?name=' . urlencode($job->company),
                    'location' => $job->location,
                ],
            ]
        ];

        return Inertia::render('worker/LiveJobTracking', $data);
    }

    public function createGig()
    {
        $user = auth()->user();
        if ($user && $user->active_mode !== 'employer') {
            return redirect()->route('dashboard')->with('error', 'Switch to Employer mode to create a gig.');
        }

        return Inertia::render('employer/CreateGig', [
            'categories' => ['Design', 'Development', 'Writing', 'Marketing', 'Handyman', 'Cleaning'],
        ]);
    }

    public function storeGig(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'description' => 'required|string',
            'location' => 'required|string',
            'salary' => 'required|numeric|min:50000', // Minimum wage validation (50k per hour or job)
            'duration' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = auth()->user() ?? \App\Models\User::factory()->create();

        \App\Models\JobPosting::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'company' => $user->name,
            'type' => $validated['type'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'salary' => (string) $validated['salary'],
            'duration' => $validated['duration'],
            'status' => 'published',
        ]);

        return redirect()->route('dashboard')->with('success', 'Gig created successfully!');
    }

    public function reviewCandidates($id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        
        $applications = \App\Models\JobApplication::with('user')
            ->where('job_posting_id', $job->id)
            ->get();

        $candidates = $applications->map(function ($app) {
            return [
                'id' => $app->user->id,
                'application_id' => $app->id,
                'name' => $app->user->name,
                'role' => $app->user->title ?? 'Professional',
                'avatar' => $app->user->avatar ?? 'https://ui-avatars.com/api/?name='.urlencode($app->user->name).'&background=random',
                'rating' => $app->user->rating ?? 4.8,
                'reviews' => $app->user->reviews_count ?? 15,
                'message' => $app->message,
                'status' => $app->status,
                'match' => rand(85, 99),
                'skills' => $app->user->tags ?? ['Hardworking', 'Punctual', 'Skilled'],
                'bio' => $app->user->bio ?? 'I am highly motivated and ready to deliver the best results for your project.',
            ];
        });

        $data = [
            'gig' => [
                'id' => $job->id,
                'title' => $job->title,
                'project' => $job->type ?? 'Gig Task',
                'applicant_count' => $candidates->count(),
            ],
            'candidates' => $candidates
        ];

        return Inertia::render('employer/ReviewCandidates', $data);
    }

    public function shortlistCandidate(Request $request, $id)
    {
        $application = \App\Models\JobApplication::findOrFail($id);
        $application->status = 'shortlisted';
        $application->save();

        return back()->with('success', 'Candidate shortlisted successfully!');
    }
}
