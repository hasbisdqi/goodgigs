<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobTrackingController extends Controller
{
    /**
     * Display the live tracking view for a specific job posting.
     */
    public function show(Request $request, JobPosting $jobPosting)
    {
        // Load the accepted application (which represents the assigned worker)
        $application = $jobPosting->applications()->where('status', 'accepted')->with('user')->first();

        if (!$application) {
            // If no worker is assigned yet, we could either show a waiting state or redirect.
            // For now, we'll just allow it and the UI will show "Waiting for worker"
        }

        // We load the employer (job poster) as well
        $jobPosting->load('user');

        return Inertia::render('jobs/tracking', [
            'job' => $jobPosting,
            'application' => $application,
        ]);
    }
}
