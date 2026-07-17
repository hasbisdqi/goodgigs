<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|max:5120',
        ]);

        $portfolio = new Portfolio([
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('portfolios', 'public');
            $portfolio->image_path = $path;
        }

        $request->user()->portfolios()->save($portfolio);

        return back()->with('toast', ['type' => 'success', 'message' => 'Portofolio berhasil ditambahkan.']);
    }

    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->user_id !== auth()->id()) {
            abort(403);
        }

        if ($portfolio->image_path) {
            Storage::disk('public')->delete($portfolio->image_path);
        }

        $portfolio->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Portofolio dihapus.']);
    }
}
