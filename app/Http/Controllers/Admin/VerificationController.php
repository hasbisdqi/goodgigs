<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VerificationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function index()
    {
        $verifications = VerificationRequest::with('user:id,name,email')
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/verifications/index', [
            'verifications' => $verifications,
        ]);
    }

    public function update(Request $request, VerificationRequest $verificationRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $verificationRequest->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        if ($request->status === 'approved') {
            $user = $verificationRequest->user;
            if ($verificationRequest->type === 'identity') {
                $user->update(['is_identity_verified' => true]);
            } elseif ($verificationRequest->type === 'skill') {
                $skills = $user->verified_skills ?? [];
                if (! in_array($verificationRequest->skill_name, $skills)) {
                    $skills[] = $verificationRequest->skill_name;
                    $user->update(['verified_skills' => $skills]);
                }
            }
        }

        return back()->with('success', 'Status verifikasi berhasil diperbarui.');
    }
}
