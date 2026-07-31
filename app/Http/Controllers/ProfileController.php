<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(User $user)
    {
        return Inertia::render('profile/show', [
            'profileUser' => $user,
        ]);
    }
}
