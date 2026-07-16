<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'job_posting_id' => ['required', 'exists:job_postings,id'],
            'reviewee_id' => ['required', 'exists:users,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $job = JobPosting::findOrFail($validated['job_posting_id']);
        $reviewer = $request->user();
        $reviewee = User::findOrFail($validated['reviewee_id']);

        // Check if job is completed
        if ($job->status !== 'completed') {
            abort(403, 'You can only review completed jobs.');
        }

        // Verify relationship (Reviewer and Reviewee must be part of this job)
        $isEmployer = $job->user_id === $reviewer->id;
        $isWorker = $job->jobApplications()->where('user_id', $reviewer->id)->where('status', 'accepted')->exists();

        if (! $isEmployer && ! $isWorker) {
            abort(403, 'You are not authorized to review this job.');
        }

        // Check if reviewer is trying to review themselves
        if ($reviewer->id === $reviewee->id) {
            abort(403, 'You cannot review yourself.');
        }

        // Verify reviewee is part of this job
        if ($isEmployer) {
            $revieweeIsWorker = $job->jobApplications()->where('user_id', $reviewee->id)->where('status', 'accepted')->exists();
            if (! $revieweeIsWorker) {
                abort(403, 'You can only review the hired worker.');
            }
        } else {
            if ($reviewee->id !== $job->user_id) {
                abort(403, 'You can only review the employer of this job.');
            }
        }

        // Check if already reviewed
        $existingReview = Review::where('job_posting_id', $job->id)
            ->where('reviewer_id', $reviewer->id)
            ->first();

        if ($existingReview) {
            abort(403, 'You have already submitted a review for this job.');
        }

        Review::create([
            'reviewer_id' => $reviewer->id,
            'reviewee_id' => $reviewee->id,
            'job_posting_id' => $job->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Review submitted successfully.'),
        ]);

        return redirect()->back();
    }
}
