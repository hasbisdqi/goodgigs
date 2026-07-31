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

    Route::middleware(['verified'])->group(function () {

        // Navigation modules
        Route::get('jobs', [JobPostingController::class, 'index'])->name('jobs.index');
        Route::get('jobs/{jobPosting}', [JobPostingController::class, 'show'])->name('jobs.show');
        Route::post('jobs/{jobPosting}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');

        Route::get('user/{user}', [ProfileController::class, 'show'])->name('profile.show');
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update');

        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('jobs/{jobPosting}/attendance/check-in', [AttendanceController::class, 'store'])->name('jobs.attendance.checkin');
        Route::get('attendance/{attendanceSession}', [AttendanceController::class, 'show'])->name('attendance.show');

        // Views for Verification
        Route::get('attendance/{attendanceSession}/qr-verification', function (AttendanceSession $attendanceSession) {
            return Inertia::render('attendance/qr-verification', ['session' => $attendanceSession]);
        })->name('attendance.qr.view');

        Route::get('attendance/{attendanceSession}/pin-verification', function (AttendanceSession $attendanceSession) {
            return Inertia::render('attendance/pin-verification', ['session' => $attendanceSession]);
        })->name('attendance.pin.view');

        Route::get('attendance/{attendanceSession}/evidence', function (AttendanceSession $attendanceSession) {
            $attendanceSession->load('evidences');

            return Inertia::render('attendance/evidence-upload', ['session' => $attendanceSession]);
        })->name('attendance.evidence.view');

        Route::get('attendance/{attendanceSession}/no-show', function (AttendanceSession $attendanceSession) {
            $attendanceSession->load('disputes');

            return Inertia::render('attendance/no-show-report', ['session' => $attendanceSession]);
        })->name('attendance.dispute.view');

        // Actions for Verification
        Route::post('attendance/{attendanceSession}/qr/generate', [VerificationController::class, 'generateQr'])->name('attendance.qr.generate');
        Route::post('attendance/{attendanceSession}/qr/verify', [VerificationController::class, 'verifyQr'])->name('attendance.qr.verify');

        Route::post('attendance/{attendanceSession}/pin/generate', [VerificationController::class, 'generatePin'])->name('attendance.pin.generate');
        Route::post('attendance/{attendanceSession}/pin/verify', [VerificationController::class, 'verifyPin'])->name('attendance.pin.verify');

        Route::post('attendance/{attendanceSession}/no-show', [DisputeController::class, 'reportNoShow'])->name('attendance.dispute.noshow');
        Route::post('attendance/{attendanceSession}/evidence', [EvidenceController::class, 'upload'])->name('attendance.evidence.upload');

    });
});
