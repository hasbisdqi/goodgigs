<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobPostingController;
use App\Models\JobPosting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('jobs', [JobPostingController::class, 'index'])->name('jobs.index');

    Route::middleware(['verified'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard', [
                'stats' => [
                    'total_gigs' => JobPosting::count(),
                    'my_gigs' => JobPosting::where('user_id', auth()->id())->count(),
                    'urgent_gigs' => JobPosting::where('type', 'Urgent')->count(),
                ],
            ]);
        })->name('dashboard');

        Route::post('jobs', [JobPostingController::class, 'store'])->name('jobs.store');
        Route::patch('jobs/{job}', [JobPostingController::class, 'update'])->name('jobs.update');
        Route::delete('jobs/{job}', [JobPostingController::class, 'destroy'])->name('jobs.destroy');

        Route::post('job-applications', [JobApplicationController::class, 'store'])->name('job-applications.store');
        Route::patch('job-applications/{application}', [JobApplicationController::class, 'update'])->name('job-applications.update');

        Route::prefix('admin')->middleware(['can:manage users'])->group(function () {
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
