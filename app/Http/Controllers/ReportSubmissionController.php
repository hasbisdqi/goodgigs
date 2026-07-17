<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'reportable_id' => 'required|integer',
            'reportable_type' => 'required|string',
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        Report::create([
            'reporter_id' => auth()->id(),
            'reportable_id' => $request->reportable_id,
            'reportable_type' => $request->reportable_type,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Laporan berhasil dikirim dan akan segera ditinjau oleh Admin.');
    }
}
