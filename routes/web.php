<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\JobCategoryController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\EndorsementController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\JobProgressUpdateController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PublicProfileController;
use App\Http\Controllers\ReportSubmissionController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SwitchModeController;
use App\Http\Controllers\VerificationRequestController;
use App\Http\Controllers\WorkerDirectoryController;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('jobs', [JobPostingController::class, 'index'])->name('jobs.index');
    Route::post('profile/switch-mode', SwitchModeController::class)->name('profile.switch-mode');
    Route::get('workers', [WorkerDirectoryController::class, 'index'])->name('workers.index');

    Route::middleware(['verified'])->group(function () {
        Route::get('dashboard', function () {
            $user = auth()->user();
            $stats = [];

            if ($user->isEmployer()) {
                $stats = [
                    'total_gigs' => JobPosting::count(),
                    'my_gigs' => JobPosting::where('user_id', $user->id)->count(),
                    'urgent_gigs' => JobPosting::where('type', 'Urgent')->count(),
                ];
            } else {
                $stats = [
                    'total_applications' => JobApplication::where('user_id', $user->id)->count(),
                    'accepted_applications' => JobApplication::where('user_id', $user->id)->where('status', 'accepted')->count(),
                    'completed_jobs' => JobApplication::where('user_id', $user->id)
                        ->whereHas('jobPosting', fn ($q) => $q->where('status', 'completed'))->count(),
                ];
            }

            return Inertia::render('dashboard', [
                'stats' => $stats,
            ]);
        })->name('dashboard');

        Route::post('jobs', [JobPostingController::class, 'store'])->name('jobs.store');
        Route::patch('jobs/{job}', [JobPostingController::class, 'update'])->name('jobs.update');
        Route::patch('jobs/{job}/complete', [JobPostingController::class, 'complete'])->name('jobs.complete');
        Route::delete('jobs/{job}', [JobPostingController::class, 'destroy'])->name('jobs.destroy');
        Route::get('api/jobs/{job}', [JobPostingController::class, 'show'])->name('jobs.show-api');
        Route::get('api/wage-recommendation', [JobPostingController::class, 'wageRecommendation'])->name('wage.recommendation');

        Route::post('job-applications', [JobApplicationController::class, 'store'])->name('job-applications.store');
        Route::patch('job-applications/{application}', [JobApplicationController::class, 'update'])->name('job-applications.update');

        Route::post('portfolios', [PortfolioController::class, 'store'])->name('portfolios.store');
        Route::delete('portfolios/{portfolio}', [PortfolioController::class, 'destroy'])->name('portfolios.destroy');

        Route::get('jobs/{jobPosting}/messages', [ChatMessageController::class, 'index'])->name('chat-messages.index');
        Route::post('jobs/{jobPosting}/messages', [ChatMessageController::class, 'store'])->name('chat-messages.store');

        Route::post('jobs/{jobPosting}/progress', [JobProgressUpdateController::class, 'store'])->name('job-progress-updates.store');

        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        Route::post('reviews', [ReviewController::class, 'store'])->name('reviews.store');

        Route::get('user/{user}', [PublicProfileController::class, 'show'])->name('profile.show');
        Route::post('user/{user}/endorse', [EndorsementController::class, 'store'])->name('endorsements.store');
        Route::post('verifications', [VerificationRequestController::class, 'store'])->name('verifications.store');
        Route::post('reports', [ReportSubmissionController::class, 'store'])->name('reports.store');

        Route::prefix('admin')->middleware(['can:manage users'])->group(function () {
            Route::get('analytics', [AnalyticsController::class, 'index'])->name('admin.analytics.index');

            Route::get('categories', [JobCategoryController::class, 'index'])->name('admin.categories.index');
            Route::post('categories', [JobCategoryController::class, 'store'])->name('admin.categories.store');
            Route::patch('categories/{category}', [JobCategoryController::class, 'update'])->name('admin.categories.update');
            Route::delete('categories/{category}', [JobCategoryController::class, 'destroy'])->name('admin.categories.destroy');

            Route::get('verifications', [VerificationController::class, 'index'])->name('admin.verifications.index');
            Route::patch('verifications/{verificationRequest}', [VerificationController::class, 'update'])->name('admin.verifications.update');

            Route::get('reports', [ReportController::class, 'index'])->name('admin.reports.index');
            Route::patch('reports/{report}', [ReportController::class, 'update'])->name('admin.reports.update');

            Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
            Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
            Route::patch('users/{user}', [UserController::class, 'update'])->name('admin.users.update');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

            Route::get('roles', [RoleController::class, 'index'])->name('admin.roles.index');
            Route::post('roles', [RoleController::class, 'store'])->name('admin.roles.store');
            Route::patch('roles/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('admin.roles.destroy');
        });
    });
});

require __DIR__.'/settings.php';
