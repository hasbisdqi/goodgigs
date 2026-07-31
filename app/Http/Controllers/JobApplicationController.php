<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function store(Request $request, JobPosting $jobPosting)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();

        // Prevent employer from applying to their own job
        if ($jobPosting->user_id === $user->id) {
            return back()->withErrors(['message' => 'You cannot apply to your own job.']);
        }

        // Check if already applied
        if ($jobPosting->jobApplications()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['message' => 'You have already applied to this job.']);
        }

        $jobPosting->jobApplications()->create([
            'user_id' => $user->id,
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your application has been submitted successfully.');
    }
}
