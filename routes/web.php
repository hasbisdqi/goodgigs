<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\EvidenceController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\VerificationController;
use App\Models\AttendanceSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/employer/dashboard', [DashboardController::class, 'employer'])->name('employer.dashboard');
    Route::get('/worker/dashboard', [DashboardController::class, 'worker'])->name('worker.dashboard');
    Route::get('/worker/gigs/map', [DashboardController::class, 'browseMap'])->name('worker.gigs.map');
    Route::get('/messages', [DashboardController::class, 'messagesList'])->name('messages.list');
    Route::get('/messages/{id}', [DashboardController::class, 'directChat'])->name('messages.direct');
    Route::get('/profile', [DashboardController::class, 'userProfile'])->name('profile.view');
    Route::get('/gigs/apply/success', [DashboardController::class, 'proposalSuccess'])->name('gigs.apply.success');
    Route::get('/gigs/{id}/apply', [DashboardController::class, 'applyToGig'])->name('gigs.apply');
    Route::post('/gigs/{id}/apply', [DashboardController::class, 'applyToGigSubmit'])->name('gigs.apply.submit');
    Route::get('/gigs/{id}/quick-apply', [DashboardController::class, 'quickApply'])->name('gigs.quick-apply');
    Route::get('/employer/gigs/{id}/candidates', [DashboardController::class, 'reviewCandidates'])->name('employer.gigs.candidates');
    Route::get('/worker/gigs/{id}/tracking', [DashboardController::class, 'liveJobTracking'])->name('worker.gigs.tracking');

    Route::middleware(['verified'])->group(function () {
        // Any verified routes if needed in the future
    });
});
