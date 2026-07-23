<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    /**
     * Display the specified user's public profile.
     */
    public function show(Request $request, User $user): Response
    {
        $user->load([
            'reviewsReceived.reviewer',
            'endorsementsReceived',
        ]);

        $averageRating = $user->reviewsReceived()->avg('rating');
        $totalReviews = $user->reviewsReceived()->count();
        $totalEndorsements = $user->endorsementsReceived()->count();

        $hasEndorsed = false;
        if ($request->user()) {
            $hasEndorsed = $user->endorsementsReceived()
                ->where('endorser_id', $request->user()->id)
                ->exists();
        }

        return Inertia::render('profile/show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'active_mode' => $user->active_mode,
                'created_at' => $user->created_at,
                'address' => $user->address,
                'latitude' => $user->latitude,
                'longitude' => $user->longitude,
                'bio' => $user->bio,
                'skills' => $user->skills ?? [],
                'is_worker_active' => $user->is_worker_active ?? true,
                'is_employer_active' => $user->is_employer_active ?? false,
            ],
            'stats' => [
                'average_rating' => $averageRating ? round($averageRating, 1) : 0,
                'total_reviews' => $totalReviews,
                'total_endorsements' => $totalEndorsements,
            ],
            'reviews' => $user->reviewsReceived,
            'has_endorsed' => $hasEndorsed,
        ]);
    }
}
