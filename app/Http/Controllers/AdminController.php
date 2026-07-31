<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Setting;
use App\Models\JobPosting;

class AdminController extends Controller
{
    public function dashboard()
    {
        $data = [
            'total_users' => User::count(),
            'pending_kyc' => User::where('kyc_status', 'pending')->count(),
            'active_gigs' => JobPosting::where('status', 'open')->count(),
        ];
        return Inertia::render('admin/Dashboard', $data);
    }

    public function kycList()
    {
        $users = User::where('kyc_status', 'pending')->get();
        return Inertia::render('admin/KYC', ['users' => $users]);
    }

    public function kycVerify(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:verified,rejected',
        ]);
        
        $user->kyc_status = $request->status;
        $user->save();

        return back()->with('success', 'User KYC status updated to ' . $request->status);
    }

    public function kycDocument(User $user, $type)
    {
        $path = $type === 'id' ? $user->kyc_id_path : $user->kyc_selfie_path;
        
        if (!$path || !\Illuminate\Support\Facades\Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return response()->file(storage_path('app/' . $path));
    }

    public function settings()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        return Inertia::render('admin/Settings', ['settings' => $settings]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'type' => gettype($value)]
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
