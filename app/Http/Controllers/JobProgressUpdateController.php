<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use App\Models\JobProgressUpdate;
use Illuminate\Http\Request;

class JobProgressUpdateController extends Controller
{
    public function store(Request $request, JobPosting $jobPosting)
    {
        // Only the assigned worker can post updates
        $application = $jobPosting->jobApplications()->where('user_id', auth()->id())->where('status', 'accepted')->first();
        if (! $application) {
            abort(403, 'Anda bukan pekerja yang ditugaskan untuk pekerjaan ini.');
        }

        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'image' => 'nullable|image|max:5120',
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('progress_updates', 'public');
        }

        JobProgressUpdate::create([
            'job_posting_id' => $jobPosting->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
            'image_path' => $path,
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Pembaruan progres berhasil ditambahkan.']);
    }
}
