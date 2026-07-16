<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    /**
     * Display a listing of the job postings.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $userId = $request->user()->id;
        $isAdmin = $request->user()->hasRole('Super Admin') || $request->user()->hasRole('Admin');

        $jobs = JobPosting::query()
            ->with([
                'user',
                'jobApplications' => function ($query) use ($userId, $isAdmin) {
                    $query->with('user')
                        ->where(function ($q) use ($userId, $isAdmin) {
                            if ($isAdmin) {
                                return;
                            }
                            $q->where('user_id', $userId)
                                ->orWhereHas('jobPosting', function ($sub) use ($userId) {
                                    $sub->where('user_id', $userId);
                                });
                        });
                },
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created job posting in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'salary' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->jobPostings()->create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Job vacancy posted successfully.'),
        ]);

        return redirect()->back();
    }

    /**
     * Update the specified job posting in storage.
     */
    public function update(Request $request, JobPosting $job): RedirectResponse
    {
        if ($job->user_id !== $request->user()->id && ! $request->user()->hasRole('Super Admin') && ! $request->user()->hasRole('Admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'salary' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
        ]);

        $job->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Job vacancy updated successfully.'),
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified job posting from storage.
     */
    public function destroy(Request $request, JobPosting $job): RedirectResponse
    {
        if ($job->user_id !== $request->user()->id && ! $request->user()->hasRole('Super Admin') && ! $request->user()->hasRole('Admin')) {
            abort(403);
        }

        $job->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Job vacancy deleted successfully.'),
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified job posting as JSON.
     */
    public function show(Request $request, JobPosting $job): JsonResponse
    {
        $userId = $request->user()->id;
        $isAdmin = $request->user()->hasRole('Super Admin') || $request->user()->hasRole('Admin');

        $job->load([
            'user',
            'jobApplications' => function ($query) use ($userId, $isAdmin) {
                $query->with('user')
                    ->where(function ($q) use ($userId, $isAdmin) {
                        if ($isAdmin) {
                            return;
                        }
                        $q->where('user_id', $userId)
                            ->orWhereHas('jobPosting', function ($sub) use ($userId) {
                                $sub->where('user_id', $userId);
                            });
                    });
            },
        ]);

        return response()->json($job);
    }

    /**
     * Mark the specified job posting as completed.
     */
    public function complete(Request $request, JobPosting $job): RedirectResponse
    {
        if ($job->user_id !== $request->user()->id && ! $request->user()->hasRole('Super Admin') && ! $request->user()->hasRole('Admin')) {
            abort(403);
        }

        $job->update(['status' => 'completed']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Job vacancy marked as completed.'),
        ]);

        return redirect()->back();
    }
}
