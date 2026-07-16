<?php

namespace App\Http\Controllers;

use App\Models\Endorsement;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EndorsementController extends Controller
{
    /**
     * Store a newly created endorsement in storage.
     */
    public function store(Request $request, User $user): RedirectResponse
    {
        $endorser = $request->user();

        if ($endorser->id === $user->id) {
            abort(403, 'You cannot endorse yourself.');
        }

        $existingEndorsement = Endorsement::where('endorser_id', $endorser->id)
            ->where('endorsee_id', $user->id)
            ->first();

        if ($existingEndorsement) {
            abort(403, 'You have already endorsed this user.');
        }

        Endorsement::create([
            'endorser_id' => $endorser->id,
            'endorsee_id' => $user->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('You have endorsed '.$user->name.'.'),
        ]);

        return redirect()->back();
    }
}
