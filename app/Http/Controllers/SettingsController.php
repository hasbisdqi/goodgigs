<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/index');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'active_mode' => 'required|in:worker,employer',
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
