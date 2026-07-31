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
        $user = auth()->user();
        
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
        $user = auth()->user();
        
        if ($user && $user->active_mode === 'employer') {
            return $this->employerDashboard($user);
        }
        
        return $this->workerDashboard($user);
    }

    protected function employerDashboard($user)
    {
        $user = auth()->user();
        
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
        })->where('status', 'hired')->with('user', 'jobPosting')->first();

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
        $user = auth()->user();

        // Find gigs not posted by the worker and that are published
        $recommendedGigs = \App\Models\JobPosting::where('user_id', '!=', $user->id)
            ->where('status', 'published')
            ->take(5)
            ->get();

        $stats = [
            'total_earnings' => (float) \App\Models\Transaction::whereHas('wallet', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->where('type', 'credit')->sum('amount'),
            'active_gigs' => \App\Models\JobApplication::where('user_id', $user->id)->where('status', 'hired')->count(),
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

        $activeJobs = \App\Models\JobApplication::with('jobPosting')
            ->where('user_id', $user->id)
            ->where('status', 'hired')
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'job_id' => $app->jobPosting->id,
                    'title' => $app->jobPosting->title,
                    'company' => $app->jobPosting->company,
                    'rate' => $app->jobPosting->salary,
                    'status' => $app->status,
                    'accepted_at' => $app->updated_at->diffForHumans(),
                ];
            });

        $data = [
            'stats' => $stats,
            'recommended_gigs' => $formattedGigs,
            'active_jobs' => $activeJobs,
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
        $user = auth()->user();
        
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
        $user = auth()->user();
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

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $user = auth()->user();
        $contact = \App\Models\User::findOrFail($id);

        $jobPosting = \App\Models\JobPosting::first();

        $chatMsg = \App\Models\ChatMessage::create([
            'sender_id' => $user->id,
            'receiver_id' => $contact->id,
            'job_posting_id' => $jobPosting ? $jobPosting->id : 1,
            'message' => $request->message,
        ]);

        broadcast(new \App\Events\ChatMessageSent($chatMsg));

        return back();
    }

    public function userProfile()
    {
        $user = auth()->user();
        
        $data = [
            'user' => [
                'name' => $user->name,
                'title' => $user->title ?? 'Professional',
                'description' => $user->bio ?? 'No description provided.',
                'rating' => (float) $user->rating,
                'avatar' => $user->avatar,
                'skills' => $user->skills ?? [],
                'extra_skills_count' => count($user->skills ?? []) > 4 ? count($user->skills) - 4 : 0,
                'computed_badge' => $user->computed_badge,
                'active_mode' => $user->active_mode ?? 'worker',
            ]
        ];

        return Inertia::render('UserProfile', $data);
    }

    public function editProfile()
    {
        $user = auth()->user();
        
        $data = [
            'user' => [
                'name' => $user->name,
                'title' => $user->title ?? '',
                'description' => $user->bio ?? '',
                'location' => $user->address ?? '',
                'avatar' => $user->avatar,
            ]
        ];

        return Inertia::render('profile/Edit', $data);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|max:5120',
        ]);

        $user = auth()->user();
        $user->name = $validated['name'];
        $user->title = $validated['title'];
        $user->bio = $validated['description'];
        $user->address = $validated['location'];

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        $user->save();

        return redirect()->route('profile.view')->with('success', 'Profile updated successfully.');
    }

    public function proposalSuccess()
    {
        return Inertia::render('worker/ProposalSuccess');
    }

    public function liveJobTracking($id)
    {
        $job = \App\Models\JobPosting::with('user')->findOrFail($id);
        
        $worker = auth()->user();
        
        // Calculate real distance using Haversine if both have coords
        $distanceKm = 4.2; // fallback
        $etaMins = 15;
        
        if ($worker && $worker->latitude && $job->latitude) {
            $earthRadius = 6371; // km
            $latFrom = deg2rad($worker->latitude);
            $lonFrom = deg2rad($worker->longitude);
            $latTo = deg2rad($job->latitude);
            $lonTo = deg2rad($job->longitude);
            
            $latDelta = $latTo - $latFrom;
            $lonDelta = $lonTo - $lonFrom;
            
            $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
            
            $distanceKm = round($angle * $earthRadius, 1);
            $etaMins = max(1, round(($distanceKm / 40) * 60)); // assuming 40km/h speed
        }

        $etaTime = \Carbon\Carbon::now()->addMinutes($etaMins)->format('H:i A');

        $data = [
            'job' => [
                'id' => $job->id,
                'status' => $job->status,
                'type' => $job->category ?? 'Service',
                'number' => 'JB-' . str_pad($job->id, 4, '0', STR_PAD_LEFT),
                'eta_mins' => $etaMins,
                'eta_time' => $etaTime,
                'distance_remaining' => $distanceKm . ' km',
                'traffic_status' => 'Moderate Traffic',
                'client' => [
                    'name' => $job->user ? $job->user->name : $job->company,
                    'avatar' => $job->user ? $job->user->avatar : 'https://ui-avatars.com/api/?name=' . urlencode($job->company),
                    'location' => $job->location,
                ],
                'coordinates' => [
                    'job' => [$job->latitude ?? -6.200000, $job->longitude ?? 106.816666],
                    'worker' => [$worker ? $worker->latitude ?? -6.210000 : -6.210000, $worker ? $worker->longitude ?? 106.820000 : 106.820000],
                ]
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

        $user = auth()->user();

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

        $candidates = $applications->map(function ($app) use ($job) {
            // Calculate a simple match score based on job title/type vs user tags
            $jobKeywords = array_map('strtolower', array_merge(explode(' ', $job->title ?? ''), explode(' ', $job->type ?? '')));
            $userTags = array_map('strtolower', $app->user->tags ?? []);
            
            $matchScore = 50; // base score
            foreach ($userTags as $tag) {
                foreach ($jobKeywords as $keyword) {
                    if (strlen($keyword) > 3 && str_contains($keyword, $tag)) {
                        $matchScore += 15;
                    }
                }
            }
            $matchScore = min($matchScore, 99); // max 99%
            if (empty($userTags)) {
                $matchScore = 75; // default fallback if no tags
            }

            return [
                'id' => $app->user->id,
                'application_id' => $app->id,
                'name' => $app->user->name,
                'role' => $app->user->title ?? 'Professional',
                'avatar' => $app->user->avatar ?? 'https://ui-avatars.com/api/?name='.urlencode($app->user->name).'&background=random',
                'rating' => (float) ($app->user->rating ?? 0),
                'reviews' => (int) ($app->user->reviews_count ?? 0),
                'message' => $app->message,
                'status' => $app->status,
                'match' => $matchScore,
                'skills' => $app->user->tags ?? [],
                'bio' => $app->user->bio ?? 'I am highly motivated and ready to deliver the best results for your project.',
                'computed_badge' => $app->user->computed_badge,
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
    public function hireCandidate(Request $request, $id)
    {
        $application = \App\Models\JobApplication::findOrFail($id);
        $application->status = 'hired';
        $application->save();

        $job = $application->jobPosting;
        if ($job) {
            $job->status = 'assigned';
            $job->worker_id = $application->user_id;
            $job->save();
        }

        return redirect()->route('gigs.tracking.employer', ['id' => $job->id])
            ->with('success', 'Candidate hired successfully!');
    }

    public function employerLiveTracking($id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        
        $worker = \App\Models\User::find($job->worker_id);
        
        if (!$worker) {
            return redirect()->back()->with('error', 'No worker assigned to this gig.');
        }

        // Calculate real distance using Haversine if both have coords
        $distanceKm = 4.2; // fallback
        $etaMins = 15;
        
        if ($worker && $worker->latitude && $job->latitude) {
            $earthRadius = 6371; // km
            $latFrom = deg2rad($worker->latitude);
            $lonFrom = deg2rad($worker->longitude);
            $latTo = deg2rad($job->latitude);
            $lonTo = deg2rad($job->longitude);
            
            $latDelta = $latTo - $latFrom;
            $lonDelta = $lonTo - $lonFrom;
            
            $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
            
            $distanceKm = round($angle * $earthRadius, 1);
            $etaMins = max(1, round(($distanceKm / 40) * 60)); // assuming 40km/h speed
        }

        $etaTime = \Carbon\Carbon::now()->addMinutes($etaMins)->format('H:i A');

        $data = [
            'gig' => [
                'id' => $job->id,
                'title' => $job->title,
                'status' => $job->status,
                'company' => $job->company,
                'location' => $job->location,
                'salary' => $job->salary,
                'eta_mins' => $etaMins,
                'eta_time' => $etaTime,
                'distance_remaining' => $distanceKm . ' km',
                'coordinates' => [
                    'job' => [$job->latitude ?? -6.200000, $job->longitude ?? 106.816666],
                    'worker' => [$worker ? $worker->latitude ?? -6.210000 : -6.210000, $worker ? $worker->longitude ?? 106.820000 : 106.820000],
                ]
            ],
            'worker' => [
                'id' => $worker->id,
                'name' => $worker->name,
                'role' => $worker->title ?? 'Professional',
                'avatar' => $worker->avatar ?? 'https://ui-avatars.com/api/?name='.urlencode($worker->name).'&background=random',
                'phone' => $worker->phone ?? '+62 812-3456-7890', // fallback if empty
            ]
        ];

        return Inertia::render('employer/MissionControl', $data);
    }

    public function startGig(Request $request, $id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        $job->status = 'in_progress';
        $job->save();

        return redirect()->back()->with('success', 'Gig started!');
    }

    public function completeGig(Request $request, $id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        $job->status = 'reviewing';
        $job->save();

        return redirect()->back()->with('success', 'Gig marked as complete, pending employer review!');
    }

    public function approveGig(Request $request, $id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        
        \Illuminate\Support\Facades\DB::transaction(function () use ($job) {
            $job->status = 'paid';
            $job->save();

            $salary = (float) $job->salary;
            $employerWallet = \App\Models\Wallet::firstOrCreate(['user_id' => $job->user_id]);
            $workerWallet = \App\Models\Wallet::firstOrCreate(['user_id' => $job->worker_id]);

            // Deduct from employer
            $employerWallet->balance -= $salary;
            $employerWallet->save();

            \App\Models\Transaction::create([
                'wallet_id' => $employerWallet->id,
                'amount' => $salary,
                'type' => 'debit',
                'description' => 'Payment for gig ' . $job->title,
                'job_posting_id' => $job->id,
            ]);

            // Add to worker
            $workerWallet->balance += $salary;
            $workerWallet->save();

            \App\Models\Transaction::create([
                'wallet_id' => $workerWallet->id,
                'amount' => $salary,
                'type' => 'credit',
                'description' => 'Earnings from gig ' . $job->title,
                'job_posting_id' => $job->id,
            ]);
        });

        return redirect()->back()->with('success', 'Gig approved and payment released!');
    }

    public function confirmPayment(Request $request, $id)
    {
        $job = \App\Models\JobPosting::findOrFail($id);
        
        if ($job->status === 'paid' && $job->worker_id === auth()->id()) {
            $job->status = 'completed';
            $job->save();
            return redirect()->back()->with('success', 'Payment confirmed!');
        }

        return redirect()->back()->with('error', 'Unauthorized action.');
    }

    public function reviewGig(Request $request, $id)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $job = \App\Models\JobPosting::findOrFail($id);
        $workerId = $job->worker_id;

        \App\Models\Review::create([
            'reviewer_id' => auth()->id(),
            'reviewee_id' => $workerId,
            'job_posting_id' => $job->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        $worker = \App\Models\User::find($workerId);
        if ($worker) {
            $totalReviews = $worker->reviews_count + 1;
            $newRating = (($worker->rating * $worker->reviews_count) + $validated['rating']) / $totalReviews;
            
            $worker->reviews_count = $totalReviews;
            $worker->rating = round($newRating, 1);
            $worker->save();
        }

        return redirect()->route('dashboard')->with('success', 'Review submitted successfully!');
    }

    public function kycForm()
    {
        $user = auth()->user();
        return Inertia::render('profile/KYC', [
            'user' => [
                'kyc_status' => $user->kyc_status ?? 'unverified',
                'name' => $user->name,
            ]
        ]);
    }

    public function submitKyc(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'nik' => 'required|string|min:16|max:16',
            'address' => 'required|string',
            'id_card' => 'required|image|max:5120',
            'selfie' => 'required|image|max:5120',
        ]);
        
        $user = auth()->user();
        $user->kyc_status = 'pending';
        // In a real app we would save full_name, nik, address here too
        
        if ($request->hasFile('id_card')) {
            $idPath = $request->file('id_card')->store('kyc', 'local');
            $user->kyc_id_path = $idPath;
        }
        
        if ($request->hasFile('selfie')) {
            $selfiePath = $request->file('selfie')->store('kyc', 'local');
            $user->kyc_selfie_path = $selfiePath;
        }

        $user->save();

        return redirect()->route('profile.kyc')->with('success', 'KYC application submitted. Please wait for verification.');
    }
}
