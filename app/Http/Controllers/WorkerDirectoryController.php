<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkerDirectoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $workers = User::where('active_mode', 'worker')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('skills', 'like', "%{$search}%")
                        ->orWhere('bio', 'like', "%{$search}%");
                });
            })
            ->withCount('reviewsReceived')
            ->withAvg('reviewsReceived', 'rating')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('workers/index', [
            'workers' => $workers,
            'filters' => ['search' => $search],
        ]);
    }
}
