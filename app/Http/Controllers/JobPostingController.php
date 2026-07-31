<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Inertia\Inertia;

class JobPostingController extends Controller
{
    public function index()
    {
        $jobs = JobPosting::with('user')->latest()->get();

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
        ]);
    }

    public function show(JobPosting $jobPosting)
    {
        $jobPosting->load('user');

        $hasApplied = false;
        if (auth()->check()) {
            $hasApplied = $jobPosting->jobApplications()->where('user_id', auth()->id())->exists();
        }

        return Inertia::render('jobs/show', [
            'job' => $jobPosting,
            'hasApplied' => $hasApplied,
        ]);
    }
}
