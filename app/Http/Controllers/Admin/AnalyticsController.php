<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\Report;
use App\Models\User;
use App\Models\VerificationRequest;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $employers = User::where('active_mode', 'employer')->count();
        $workers = User::where('active_mode', 'worker')->count();

        $totalJobs = JobPosting::count();
        $activeJobs = JobPosting::where('status', 'published')->count();
        $completedJobs = JobPosting::where('status', 'completed')->count();

        $totalApplications = JobApplication::count();
        $acceptedApplications = JobApplication::where('status', 'accepted')->count();

        $pendingVerifications = VerificationRequest::where('status', 'pending')->count();
        $pendingReports = Report::where('status', 'pending')->count();

        return Inertia::render('admin/analytics/index', [
            'stats' => [
                'users' => [
                    'total' => $totalUsers,
                    'employers' => $employers,
                    'workers' => $workers,
                ],
                'jobs' => [
                    'total' => $totalJobs,
                    'active' => $activeJobs,
                    'completed' => $completedJobs,
                ],
                'applications' => [
                    'total' => $totalApplications,
                    'accepted' => $acceptedApplications,
                ],
                'trust' => [
                    'pending_verifications' => $pendingVerifications,
                    'pending_reports' => $pendingReports,
                ],
            ],
        ]);
    }
}
