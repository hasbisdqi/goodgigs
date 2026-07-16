<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    /**
     * Store a newly created job application in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'job_posting_id' => ['required', 'exists:job_postings,id'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $job = JobPosting::findOrFail($validated['job_posting_id']);

        // Check if user is the creator of the gig
        if ($job->user_id === $request->user()->id) {
            return back()->withErrors(['message' => __('Anda tidak bisa melamar ke tugas yang Anda buat sendiri.')]);
        }

        // Check if user already applied
        $exists = JobApplication::where('job_posting_id', $job->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['message' => __('Anda sudah melamar ke tugas ini.')]);
        }

        $request->user()->jobApplications()->create([
            'job_posting_id' => $job->id,
            'message' => $validated['message'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lamaran tugas berhasil dikirim.'),
        ]);

        return redirect()->back();
    }

    /**
     * Update the status of the job application.
     */
    public function update(Request $request, JobApplication $application): RedirectResponse
    {
        $job = $application->jobPosting;

        // Ensure current user is the owner of the gig or an admin
        if ($job->user_id !== $request->user()->id && ! $request->user()->hasRole('Super Admin') && ! $request->user()->hasRole('Admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:accepted,rejected,pending'],
        ]);

        $application->update(['status' => $validated['status']]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Status lamaran berhasil diperbarui.'),
        ]);

        return redirect()->back();
    }
}
