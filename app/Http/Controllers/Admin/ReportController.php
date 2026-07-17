<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['reporter:id,name,email', 'reportable'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/reports/index', [
            'reports' => $reports,
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $request->validate([
            'status' => 'required|in:reviewed,resolved,dismissed',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $report->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }
}
