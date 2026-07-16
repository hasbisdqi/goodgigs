<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
        Route::patch('users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    });
});

require __DIR__.'/settings.php';
