<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use Illuminate\Http\Request;

class EvidenceController extends Controller
{
    public function upload(Request $request, AttendanceSession $attendanceSession)
    {
        $user = $request->user();

        if ($attendanceSession->worker_id !== $user->id && $attendanceSession->employer_id !== $user->id) {
            abort(403);
        }

        $request->validate([
            'evidence' => 'required|file|mimes:jpg,jpeg,png,mp4,mov|max:10240', // Max 10MB
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $file = $request->file('evidence');
        $path = $file->store('evidences', 'public'); // Object storage should be configured in filesystems.php

        $type = str_starts_with($file->getMimeType(), 'video') ? 'video' : 'photo';

        $attendanceSession->evidences()->create([
            'uploader_id' => $user->id,
            'type' => $type,
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'captured_at' => now(),
            'metadata' => [
                'size' => $file->getSize(),
                'client_original_name' => $file->getClientOriginalName(),
            ],
        ]);

        return back()->with('success', 'Evidence uploaded successfully.');
    }
}
