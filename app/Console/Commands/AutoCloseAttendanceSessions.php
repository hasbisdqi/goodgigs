<?php

namespace App\Console\Commands;

use App\Models\AttendanceSession;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

class AutoCloseAttendanceSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:auto-close';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically close attendance sessions that have been working for over 24 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sessions = AttendanceSession::where('status', 'working')
            ->where('work_started_at', '<', now()->subHours(24))
            ->get();

        foreach ($sessions as $session) {
            $session->update([
                'status' => 'completed',
                'work_completed_at' => now(),
            ]);

            $session->events()->create([
                'event' => 'auto_closed',
                'metadata' => ['reason' => 'time_limit_exceeded'],
            ]);

            $this->info("Session {$session->id} auto-closed.");
        }

        $this->info("Processed {$sessions->count()} sessions.");
    }
}
