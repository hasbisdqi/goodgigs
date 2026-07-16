<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

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

require __DIR__.'/settings.php';
