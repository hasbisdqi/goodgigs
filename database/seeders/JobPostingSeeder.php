<?php

namespace Database\Seeders;

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobPostingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testUser = User::first();

        if ($testUser) {
            JobPosting::factory(5)->create([
                'user_id' => $testUser->id,
            ]);
        }

        JobPosting::factory(5)->create();
    }
}
