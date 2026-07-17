<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use App\Models\JobPosting;
use App\Services\RecommendationService;
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
        $type = $request->query('type');

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
                'progressUpdates.user',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($type, function ($query, $type) {
                if ($type !== 'All') {
                    $query->where('type', $type);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $recommendedJobs = collect();
        if ($request->user()->active_mode === 'worker') {
            $recommendationService = app(RecommendationService::class);
            $recommendedJobs = $recommendationService->getRecommendedJobs($request->user(), 5);
        }

        $categories = JobCategory::with('parent')->latest()->get();

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'recommendedJobs' => $recommendedJobs,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'type' => $type,
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
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'job_category_id' => ['nullable', 'exists:job_categories,id'],
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
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'job_category_id' => ['nullable', 'exists:job_categories,id'],
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
            'progressUpdates.user',
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

    /**
     * Get a fair wage recommendation based on job type.
     */
    public function wageRecommendation(Request $request, RecommendationService $recommendationService): JsonResponse
    {
        $type = $request->query('type');

        if (! $type) {
            return response()->json(['wage' => null]);
        }

        $wage = $recommendationService->getFairWageRecommendation($type);

        return response()->json(['wage' => $wage]);
    }
}
