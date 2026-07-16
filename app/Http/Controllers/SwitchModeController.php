<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SwitchModeController extends Controller
{
    /**
     * Handle the request to switch the user's active mode.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mode' => ['required', 'string', 'in:employer,worker'],
        ]);

        $request->user()->update([
            'active_mode' => $validated['mode'],
        ]);

        $modeLabel = $validated['mode'] === 'employer' ? 'Pemberi Kerja' : 'Penyedia Jasa';

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Mode aktif berhasil diubah ke {$modeLabel}."),
        ]);

        return redirect()->back();
    }
}
