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
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/gigs', [DashboardController::class, 'browseMap'])->name('gigs.index');
    Route::get('/messages', [DashboardController::class, 'messagesList'])->name('messages.list');
    Route::post('/messages/{id}', [DashboardController::class, 'sendMessage'])->name('messages.send');
    Route::get('/messages/{id}', [DashboardController::class, 'directChat'])->name('messages.direct');
    Route::get('/gigs/create', [DashboardController::class, 'createGig'])->name('gigs.create');
    Route::post('/gigs', [DashboardController::class, 'storeGig'])->name('gigs.store');
    
    Route::get('/profile', [DashboardController::class, 'userProfile'])->name('profile.view');
    Route::get('/profile/edit', [DashboardController::class, 'editProfile'])->name('profile.edit');
    Route::post('/profile/edit', [DashboardController::class, 'updateProfile'])->name('profile.update');
    Route::get('/profile/kyc', [DashboardController::class, 'kycForm'])->name('profile.kyc');
    Route::post('/profile/kyc', [DashboardController::class, 'submitKyc'])->name('profile.kyc.submit');
    Route::post('/profile/switch-mode', [DashboardController::class, 'switchMode'])->name('profile.switch-mode');
    
    Route::get('/gigs/apply/success', [DashboardController::class, 'proposalSuccess'])->name('gigs.apply.success');
    Route::get('/gigs/{id}/apply', [DashboardController::class, 'applyToGig'])->name('gigs.apply');
    Route::post('/gigs/{id}/apply', [DashboardController::class, 'applyToGigSubmit'])->name('gigs.apply.submit');
    Route::get('/gigs/{id}/quick-apply', [DashboardController::class, 'quickApply'])->name('gigs.quick-apply');
    Route::get('/gigs/{id}/candidates', [DashboardController::class, 'reviewCandidates'])->name('gigs.candidates');
    Route::post('/applications/{id}/shortlist', [DashboardController::class, 'shortlistCandidate'])->name('applications.shortlist');
    Route::post('/applications/{id}/hire', [DashboardController::class, 'hireCandidate'])->name('applications.hire');
    Route::get('/gigs/{id}/tracking', [DashboardController::class, 'liveJobTracking'])->name('gigs.tracking');
    Route::get('/gigs/{id}/tracking/employer', [DashboardController::class, 'employerLiveTracking'])->name('gigs.tracking.employer');
    
    // Gig Completion Flow Routes
    Route::post('/gigs/{id}/start', [DashboardController::class, 'startGig'])->name('gigs.start');
    Route::post('/gigs/{id}/complete', [DashboardController::class, 'completeGig'])->name('gigs.complete');
    Route::post('/gigs/{id}/approve', [DashboardController::class, 'approveGig'])->name('gigs.approve');
    Route::post('/gigs/{id}/review', [DashboardController::class, 'reviewGig'])->name('gigs.review');

    Route::middleware(['verified'])->group(function () {
        // Any verified routes if needed in the future
    });
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/kyc', [\App\Http\Controllers\AdminController::class, 'kycList'])->name('kyc.list');
    Route::post('/kyc/{user}/verify', [\App\Http\Controllers\AdminController::class, 'kycVerify'])->name('kyc.verify');
    Route::get('/kyc/{user}/document/{type}', [\App\Http\Controllers\AdminController::class, 'kycDocument'])->name('kyc.document');
    Route::get('/settings', [\App\Http\Controllers\AdminController::class, 'settings'])->name('settings');
    Route::post('/settings', [\App\Http\Controllers\AdminController::class, 'updateSettings'])->name('settings.update');
});
