<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\JobPosting;
use App\Models\JobApplication;

class PrototypeSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Employer (Alex Rivera)
        $employer = User::updateOrCreate(
            ['email' => 'alex@example.com'],
            [
                'name' => 'Alex Rivera',
                'username' => 'alexrivera',
                'password' => bcrypt('password'),
                'role' => 'employer',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6y4e4430TxP-HS8Mdh8pnwuIRrh3t7oOgYvenAHaDAQ1Wod-4rS4vPoHCZnhWNo_y4PKkuBIg6I-10L6IvhswSBdnyczlq_62Hw1EfCGKptRTsODGLbTcqZFRyxv20eRkEWoYqL5XHLVhWLISYulTZQdToW-VRCu6RFfOWQM3jnridGKE7l7VVvtJUdWe1HdH8FHAtl5chCyyDiJWokwXZpln7LTG_vMTdLyVA7kWxb7qVB4nVipN8w',
                'title' => 'Product Manager at Nebula',
                'active_mode' => 'employer',
            ]
        );

        // 2. Create Worker (Sarah Jenkins)
        $worker = User::updateOrCreate(
            ['email' => 'sarah@example.com'],
            [
                'name' => 'Sarah Jenkins',
                'username' => 'sarahj',
                'password' => bcrypt('password'),
                'role' => 'worker',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj1GB4wx3Qpry3I6gw6RMc379HmHgBg1zBJ4sfd7A3R6BYJ9ez7Xr849qe4ys0b6QkUPLIxpHgpiB_1VPAozNwK29OwqETr5oPD_CQIF8Vv5fv-FsutI7f5PYaslT-o_2f_vfVu9fZ2MSbdI_K1xjAXhe8IX1KZlDcM1PNZqXRy6HFkfywie1u7I88zW4rkjUaytKkgy5bhCnz4JrXFldhyOnYoDQr6N7XPuVcXpSwU4TSVXellevHdQ',
                'title' => 'Senior UX/UI Designer & Brand Strategist',
                'rating' => 4.9,
                'reviews_count' => 120,
                'total_earnings' => 12450.00,
                'active_mode' => 'worker',
                'bio' => 'Expert in React Native and AWS infrastructure scaling.',
            ]
        );

        $worker2 = User::updateOrCreate(
            ['email' => 'marcus@example.com'],
            [
                'name' => 'Marcus Chen',
                'username' => 'marcusc',
                'password' => bcrypt('password'),
                'role' => 'worker',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAp28dFrnebY78TTtgEP6w28ftFMc-9X62ZIM6jDACWotjfDQZvk0gLQfGOaUvO9XjyWHFEhKXNXSbDLHg7m8Arz0joDQWGpjG38Wu6Oj2NebqfFCk9Ieq1BzBCu7DCm4C0OD3ccINgCtwhbxa_FPYY-wlXRbUVnV2FfA2zqkUeTsvR6W_LoVqTgVBeuiw9PSqHlsAshUxChbJURfTj8KVKo7SYUYoUiEZwHoiYPwVqlfNuaUXPMJe7A',
                'title' => 'UI/UX Designer',
                'rating' => 4.8,
                'reviews_count' => 88,
                'total_earnings' => 9500.00,
                'active_mode' => 'worker',
                'bio' => 'Specializes in building complex dashboard systems for SaaS startups.',
            ]
        );

        // 3. Create active gigs posted by Employer
        $gig1 = JobPosting::updateOrCreate(
            ['id' => 1],
            [
                'user_id' => $employer->id,
                'title' => 'Senior React Developer - Fintech App',
                'company' => 'Nebula Systems',
                'description' => 'Looking for a senior React developer to lead the frontend development of our new Fintech application.',
                'location' => 'Remote',
                'salary' => '$80/hr',
                'type' => 'Contract',
                'status' => 'published',
                'duration' => '3 months',
                'tags' => ['React.js', 'TypeScript', 'Financial APIs'],
                'new_applicants' => 12,
                'icon' => 'Terminal',
                'color_class' => 'bg-primary-fixed',
                'text_class' => 'text-primary',
                'latitude' => -7.7956,
                'longitude' => 110.3695,
            ]
        );

        $gig2 = JobPosting::updateOrCreate(
            ['id' => 2],
            [
                'user_id' => $employer->id,
                'title' => 'Brand Identity for Sustainable Start-up',
                'company' => 'Eco Solutions',
                'description' => 'Need a complete brand identity package including logo, guidelines, and assets.',
                'location' => 'Remote',
                'salary' => '$1500',
                'type' => 'Contract',
                'status' => 'published',
                'duration' => '2 weeks',
                'tags' => ['Logo Design', 'Guidelines'],
                'new_applicants' => 3,
                'icon' => 'Palette',
                'color_class' => 'bg-tertiary-fixed',
                'text_class' => 'text-tertiary',
            ]
        );

        $gig3 = JobPosting::updateOrCreate(
            ['id' => 3],
            [
                'user_id' => $employer->id,
                'title' => 'Emergency Pipe Repair',
                'company' => 'Mrs. Diana',
                'description' => 'Urgent: Kitchen sink pipe is leaking heavily. Need immediate repair.',
                'location' => 'Yogyakarta',
                'salary' => '$85',
                'type' => 'One-time',
                'status' => 'published',
                'duration' => '1 day',
                'tags' => ['Plumbing', 'Urgent'],
                'icon' => 'Wrench',
                'color_class' => 'bg-primary',
                'text_class' => 'text-on-primary',
                'latitude' => -7.7956, // Jogja
                'longitude' => 110.3695,
            ]
        );

        // 4. Create an application from Worker to Employer's gig
        $application = JobApplication::updateOrCreate(
            ['job_posting_id' => $gig1->id, 'user_id' => $worker->id],
            [
                'status' => 'pending',
                'message' => 'I would love to help build this Fintech app.',
            ]
        );

        JobApplication::updateOrCreate(
            ['job_posting_id' => $gig1->id, 'user_id' => $worker2->id],
            [
                'status' => 'pending',
                'message' => 'I have 5 years of experience building dashboards for SaaS.',
            ]
        );

        // 5. Create chat history between Employer and Worker
        \App\Models\ChatMessage::updateOrCreate(
            ['id' => 1],
            [
                'job_posting_id' => $gig1->id,
                'sender_id' => $employer->id,
                'receiver_id' => $worker->id,
                'message' => 'Hi Sarah, thanks for applying. Can we see some of your previous Fintech work?',
                'created_at' => now()->subHours(2),
                'read_at' => now()->subHours(1),
            ]
        );

        \App\Models\ChatMessage::updateOrCreate(
            ['id' => 2],
            [
                'job_posting_id' => $gig1->id,
                'sender_id' => $worker->id,
                'receiver_id' => $employer->id,
                'message' => 'Absolutely! I just sent over a link to my portfolio. Let me know if you need more details.',
                'created_at' => now()->subMinutes(30),
                'read_at' => now()->subMinutes(15),
            ]
        );

        \App\Models\ChatMessage::updateOrCreate(
            ['id' => 3],
            [
                'job_posting_id' => $gig1->id,
                'sender_id' => $employer->id,
                'receiver_id' => $worker->id,
                'message' => 'This looks great. Can we schedule a quick call tomorrow?',
                'created_at' => now()->subMinutes(5),
                'read_at' => null, // unread
            ]
        );
    }
}
