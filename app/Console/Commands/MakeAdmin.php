<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-admin {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Make a user an admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        if ($email) {
            $user = \App\Models\User::where('email', $email)->first();
        } else {
            $user = \App\Models\User::first();
        }

        if (!$user) {
            $this->error('User not found.');
            return;
        }

        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        $user->assignRole($role);

        $this->info("User {$user->email} is now an admin.");
    }
}
