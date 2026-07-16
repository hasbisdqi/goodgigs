<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobs = JobPosting::all();
        $users = User::all();

        if ($jobs->isEmpty() || $users->count() < 2) {
            return;
        }

        foreach ($jobs as $job) {
            $potentialApplicants = $users->filter(fn ($u) => $u->id !== $job->user_id);
            if ($potentialApplicants->isEmpty()) {
                continue;
            }

            $applicants = $potentialApplicants->random(min($potentialApplicants->count(), rand(1, 2)));

            foreach ($applicants as $applicant) {
                JobApplication::factory()->create([
                    'job_posting_id' => $job->id,
                    'user_id' => $applicant->id,
                ]);
            }
        }
    }
}
