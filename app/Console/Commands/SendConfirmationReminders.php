<?php

namespace App\Console\Commands;

use App\Models\AttendanceSession;
use App\Notifications\ReminderConfirmationNotification;
use Illuminate\Console\Command;

class SendConfirmationReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:remind-confirmation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send confirmation reminders to employers for completed work.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find sessions waiting for approval for more than 1 hour
        $limit = now()->subHour();

        // Using work_completed_at as the completion time
        $sessions = AttendanceSession::with('jobPosting.user')
            ->where('status', 'waiting_approval')
            ->whereNotNull('work_completed_at')
            ->where('work_completed_at', '<=', $limit)
            ->get();

        foreach ($sessions as $session) {
            $employer = $session->jobPosting->user;
            $employer->notify(new ReminderConfirmationNotification($session));
        }

        $this->info('Confirmation reminders sent for '.$sessions->count().' sessions.');
    }
}
