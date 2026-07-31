<?php

namespace App\Console\Commands;

use App\Models\AttendanceSession;
use App\Notifications\ReminderCheckInNotification;
use Illuminate\Console\Command;

class SendCheckInReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:remind-check-in';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send check-in reminders to workers and employers if they have not checked in.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();
        $startTimeLimit = $now->copy()->addMinutes(15);
        $endTimeLimit = $now->copy()->subMinutes(15);

        // Find sessions that start within 15 minutes, or started up to 15 minutes ago
        // and have not been confirmed (which means at least one party hasn't checked in)
        // using created_at as a proxy for scheduled_start
        $sessions = AttendanceSession::with(['jobPosting.user', 'worker'])
            ->whereIn('status', ['waiting_checkin', 'waiting_employer', 'waiting_worker'])
            ->whereBetween('created_at', [$endTimeLimit, $startTimeLimit])
            ->get();

        foreach ($sessions as $session) {
            $employer = $session->jobPosting->user;
            $worker = $session->worker;

            if (in_array($session->status, ['waiting_checkin', 'waiting_employer'])) {
                $employer->notify(new ReminderCheckInNotification($session));
            }

            if (in_array($session->status, ['waiting_checkin', 'waiting_worker'])) {
                $worker->notify(new ReminderCheckInNotification($session));
            }
        }

        $this->info('Check-in reminders sent to '.$sessions->count().' sessions.');
    }
}
