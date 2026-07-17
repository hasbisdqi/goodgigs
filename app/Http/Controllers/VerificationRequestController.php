<?php

namespace App\Http\Controllers;

use App\Models\VerificationRequest;
use Illuminate\Http\Request;

class VerificationRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:identity,skill',
            'document' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
            'skill_name' => 'required_if:type,skill|string|max:255',
        ]);

        $path = $request->file('document')->store('verifications', 'public');

        VerificationRequest::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'document_path' => $path,
            'skill_name' => $request->type === 'skill' ? $request->skill_name : null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Permintaan verifikasi berhasil dikirim dan sedang menunggu tinjauan Admin.');
    }
}
