<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function employer()
    {
        // Mock data matching the employer_dashboard screen requirements
        $data = [
            'stats' => [
                'active_projects' => 8,
                'total_applicants' => 42,
                'escrow_budget' => 3240,
                'avg_hire_time' => '1.4d',
            ],
            'active_gigs' => [
                [
                    'id' => 1,
                    'title' => 'Senior React Developer - Fintech App',
                    'status' => 'Searching for talent',
                    'duration' => '3 months',
                    'price' => 8000,
                    'tags' => ['React.js', 'TypeScript', 'Financial APIs'],
                    'new_applicants' => 12,
                    'icon' => 'Terminal',
                    'color_class' => 'bg-primary-fixed',
                    'text_class' => 'text-primary',
                ],
                [
                    'id' => 2,
                    'title' => 'Brand Identity for Sustainable Start-up',
                    'status' => '3 applicants',
                    'duration' => '2 weeks',
                    'price' => 1500,
                    'tags' => ['Logo Design', 'Guidelines'],
                    'new_applicants' => 3,
                    'icon' => 'Palette',
                    'color_class' => 'bg-tertiary-fixed',
                    'text_class' => 'text-tertiary',
                ],
            ],
            'in_progress_gig' => [
                'id' => 3,
                'title' => 'Short Social Media Video Editor',
                'assigned_to' => 'Alex Rivera',
                'due_in' => '2 days',
                'progress' => 65,
                'icon' => 'Video',
            ],
            'recommended_talent' => [
                [
                    'id' => 1,
                    'name' => 'Marcus Chen',
                    'role' => 'UI/UX Designer',
                    'rating' => 4.9,
                    'reviews' => 120,
                    'description' => 'Specializes in building complex dashboard systems for SaaS startups.',
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAp28dFrnebY78TTtgEP6w28ftFMc-9X62ZIM6jDACWotjfDQZvk0gLQfGOaUvO9XjyWHFEhKXNXSbDLHg7m8Arz0joDQWGpjG38Wu6Oj2NebqfFCk9Ieq1BzBCu7DCm4C0OD3ccINgCtwhbxa_FPYY-wlXRbUVnV2FfA2zqkUeTsvR6W_LoVqTgVBeuiw9PSqHlsAshUxChbJURfTj8KVKo7SYUYoUiEZwHoiYPwVqlfNuaUXPMJe7A',
                ],
                [
                    'id' => 2,
                    'name' => 'Sarah J.',
                    'role' => 'Fullstack Dev',
                    'rating' => 5.0,
                    'reviews' => 88,
                    'description' => 'Expert in Node.js and AWS infrastructure scaling.',
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU0CngwaCp-xIaaP5SvyMNDAAkJvf4qvEVCOiVpy9kfqrz_QDCSnJFkAzbANdZI1S6cYk4zb0_vajK-M2w9v8vz_17p66zaAiZRnxSjhz7RZ7Ut6cjcDs83smAvVe9EajbG21ZBgsE28kl7Q79QvQYVdPGlsb_cjX4JCVVdNHcgka8ZWHYHpjo3wrWF5Kt_OZPs87SBKOLdyHXaIrls6SRE-9KCAyZA9csv3dMrWCk1bZQL2hB_KDisw',
                ],
                [
                    'id' => 3,
                    'name' => 'Elena Rodriguez',
                    'role' => 'Brand Strategist',
                    'rating' => 4.8,
                    'reviews' => 215,
                    'description' => 'Award-winning brand designer with a focus on tech ethics companies.',
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8mVWxVtpXx4WGE5EUqxdYotUwGHXmMeEVX6vFk8ktUlEP98_X1OMqm4dBlRP7Ig7cRV_NYFIvh9-1Z1AHCbXQEKqk5B7SK4ooXoWXKKniMpFsw8kIjXIO5WPoRv_fCn6QxnbE0-OBTBayFyqYMUyJ_jbfBPLvfsV8wTjrD7Tbe1c8VQtkmAxotLcUBqpr7NujzHPcFO1ZrWz4TzKCtTpMW7kKOU0BwCRH2Umrc2eb975LFaKh62g52w',
                ],
            ],
        ];

        return Inertia::render('employer/Dashboard', $data);
    }

    public function worker()
    {
        // Mock data matching the worker_dashboard_home screen requirements
        $data = [
            'stats' => [
                'total_earnings' => 12450.00,
                'active_gigs' => 4,
                'rating' => 4.9,
            ],
            'recommended_gigs' => [
                [
                    'id' => 1,
                    'title' => 'Senior Graphic Designer',
                    'company' => 'Nebula Systems',
                    'location' => 'Remote',
                    'posted_time' => '2h ago',
                    'rate' => 85,
                    'tags' => ['Figma', 'Prototyping', 'Brand Identity'],
                    'logo' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKaPqVb2UUu_ln-1Vtj4C9551_VG1rgh4yacys8P6ZBbapX_c-BLNQgu1pmLG5W8hJxaCoy2k0kp8I_8LAXFjtgUYLkc8x1Yw6WN7mxsMboaapr3TKSh_ezoUjc2hItCLQvEmbgV1MHVW5OnCpNcnn5uFRD0cnQIsHDR4Kx-NUPkJM-2_a-KEqs16WYv8-pMUsOzKSMwFuir7Xx2Gz4U1AhTBYyWaiAAf9R26JuQzcviby8dsMX-uhvA',
                ],
                [
                    'id' => 2,
                    'title' => 'UI/UX Consultant (FinTech)',
                    'company' => 'EcoPay Solutions',
                    'location' => 'New York, NY',
                    'posted_time' => '5h ago',
                    'rate' => 110,
                    'tags' => ['React Native', 'Financial Systems'],
                    'logo' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBMo6wSpj3upIelibnDCV70BV7BDODxozQE55bSX1Cb87wQBMialKONFXnrQLDo8G6hJS9SeDXQEyf8jvVACEzNWlybayh50VJuNbec4KW0UFD-ZWVet8RWUMtNlqd5fK3hrlMhvoth1uaxHk8HPG0cgyASzieRwpG7p-anRS4D508oyK5MbBCGxc--bVjE7YBkr30RYgNZ0l1uiv6QSr1LXmONTYKWCKJqVKf_wGaiezr4ggQNvkkw',
                ],
            ],
        ];

        return Inertia::render('worker/Dashboard', $data);
    }

    public function browseMap()
    {
        $data = [
            'categories' => ['All Gigs', 'Plumbing', 'Home Repair', 'Gardening', 'Electrician'],
            'map_image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMCRV0-U_1qudmCw8jraCPGQq5ftjivlupcTOYQ56iGhIF7t1rRvlxuAF1V-T47-W9oZQyXx4WErja6IxwLehfeY3LuotUiLgxaw1Yg0aLgm5iABbaa-_KRX6OfGhRSZ0kmJOm46bZs7YBB0yaT_v7dzxj-7YjDXzzcwmik-5mNIdkIX3bcvmStdgLvkmODllGa3cCPe6ASXC21MCjphRGzVvVc3dBFcuElKPpXkq5yQ3nPJQ7zjgwyg',
            'markers' => [
                [
                    'id' => 1,
                    'top' => '30%',
                    'left' => '25%',
                    'color_class' => 'bg-primary',
                    'text_class' => 'text-on-primary',
                    'icon' => 'Wrench' // using Wrench as proxy for plumbing
                ],
                [
                    'id' => 2,
                    'top' => '60%',
                    'left' => '70%',
                    'color_class' => 'bg-secondary',
                    'text_class' => 'text-on-secondary',
                    'icon' => 'Hammer' // proxy for build
                ],
                [
                    'id' => 3,
                    'top' => '45%',
                    'left' => '55%',
                    'color_class' => 'bg-primary',
                    'text_class' => 'text-on-primary',
                    'icon' => 'Wrench',
                    'selected' => true,
                    'preview' => [
                        'title' => 'Emergency Pipe Repair',
                        'price' => 85.00,
                        'distance' => '0.8 miles away',
                        'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEfkVtgoEGp3OEsPyk_aGRm6VUQfe452-f5AB7wYqAE4X5F69aRLZkZU66UMNPMshPgDafwt87jMv9HX2c3hkcUyaoX8dFCjffRwbSs3xPXzz3IB2pEn4HbL--Uk9c6eAF9Upb9tOg7bxrMr-A2iX8xCxqbZBIxJqlH_QBSev_H-1gggfp2rKcPE632ldqHB0XMFNYU5vpP7-6yQHOBccJdYj48Ofm84KMu54uj2VlYZez2x6LNDbw6A'
                    ]
                ]
            ]
        ];
        
        return Inertia::render('worker/MapBrowse', $data);
    }

    public function messagesList()
    {
        $data = [
            'filters' => ['All Chats', 'Unread', 'Archived'],
            'conversations' => [
                [
                    'id' => 1,
                    'name' => 'Alex Rivera',
                    'time' => '2m ago',
                    'last_message' => "Hey! I've finished the initial wireframes for the project. Can you check them out?",
                    'unread_count' => 2,
                    'online' => true,
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4hVfnD0AhVvcA8J_0YLFhhY9MNuxmwqax3g_TXU9Eft6zXCPGmMB4IT9efDeE33T1DUkEk6DvNdQYNWLsRgxVEitHAwAbJixZ-1WoaHc0G2zQLGwJbO4fmaLpbj4L6M8EPtWuV2t8hRLAtUu1ZPC3ffnjU7NqKg7JG1f3TzSlzyJen8V8-g6Nn5MPC2dIs_o-lS-7Pvk48FMM3_F-HWbIMVNvVH6BE9WMRxueXH_zE7o2ty1o__SVyQ'
                ],
                [
                    'id' => 2,
                    'name' => 'Sarah Miller',
                    'time' => '1h ago',
                    'last_message' => "The milestone payment has been processed. Great work on the marketing copy!",
                    'unread_count' => 0,
                    'online' => false,
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc45AflEQ0K2ce22y4xYKAmbg2cgC659Cxjzgw9uBVqkSg1be7x7AaHNlOMkw21eZxXSCwdSlG7lfIXDoPUFxZeQn5zE5O876FhclEOfRK6ssHKCVoQQEPbQPoaXLhnf83-NDPo5Pde83dj2Vm-u5Wo-AH-gm9hoGwMLNKPJgy_1foSuR5ei3ygOO8ge0PZM8wt-SVfwgcgA3rwU35SsNhzLDVbBbWySk3_RabwXdYlQ4as566vGWqEQ'
                ],
                [
                    'id' => 3,
                    'name' => 'James Chen',
                    'time' => '4h ago',
                    'last_message' => "Sent over the API documentation. Let me know if you have any questions.",
                    'unread_count' => 0,
                    'online' => true,
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd5TRj5NrtS3zeoNo4hJTOJ0B36QiPjHD7SxuXNSP9XeDoYp7gKcd4w4Hx30p7JxYvRQyg1_vbc6gjjuhOjzyqntSsBT6gXOJt9YRECSBIvI7UMfxnnABHAroAADhiJ5cQNf2Kony7buL_8NpW0O9SLiEE-DbivM0H7VzPZDEeXu2ADSjIfLfJgsndkyqsBezgqlZWS_OzGCz8K7sEoSpO2TQyQf8_LVF0Q95lBQnrFs0cD5XHOR0CWg'
                ],
                [
                    'id' => 4,
                    'name' => 'Elena Rodriguez',
                    'time' => 'Yesterday',
                    'last_message' => "I really liked the color palette you suggested for the brand refresh!",
                    'unread_count' => 0,
                    'online' => false,
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUSRldY3wkP2PWWhL5kXND_TjHBI6MbyRpI_fAM9m4So9gic52D81c-xP82xqF0SnvpYps7FAmp8hkl6toPsO46KJlQbGnE7USai4p1oCvfvSmSL4pGCsAuVCW7o2PhJvBlzbQWuUlvd2wZKYqQ5A1jlX7A-AyE-CqeZ2Bq3-sQc24vaPXmCTcYSfzFYrJydjxpPLhn0z2SW7m9vyO6C7iVMPQLIaQ5QumtuhJ04J0kxWJ6CWJ79gOlg'
                ],
                [
                    'id' => 5,
                    'name' => 'Marcus Thorne',
                    'time' => '2d ago',
                    'last_message' => "Can we jump on a quick call at 2 PM to finalize the contract details?",
                    'unread_count' => 1,
                    'online' => false,
                    'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqFVEWwmO0N9zWIE-rRPZ5usp5QjCHH93RaFB95BnXoTF_Qz8kaV8v1usPztNrNwtQ2kTYRS6lbdtUCTafs-y-PVW7KmTx9P1zQ8fPWxJlP_eyy6SqJhIflsXdd7HZdBZ84nJ2pBWzdVJqntnxW5oOT0WQl3plklQwqarFcIXJVeV_50mVhokuR_jsPRNQ5LrUQZ1EfZVER31DRBj_bB5Wm-Ccv9jvEOgng4WeNYwmmLgLQJNR8E7zlg'
                ]
            ]
        ];

        return Inertia::render('MessagesList', $data);
    }

    public function directChat($id)
    {
        // Mock data for direct chat
        $data = [
            'contact' => [
                'id' => $id,
                'name' => 'Alex Rivera',
                'role' => 'Senior Frontend Engineer',
                'status' => 'Online',
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA56TbX534XtJiqB-sbknIDSRBL1WMzHVPpVc2i6sb0XMxKUc15E66Ge3qcUXPhc40FKnS8m0A_79CDsrarsc2snS97Etx_NyiAoq4ZeUMtW6X2bHNTiKU-Lwxw4SrzpcqwLt9zq4C28mwSTv3qz6E_PksXf3OgOe0A1mTNpezOaPSiyuUlpqGCfad1nhHQPwvsakzqP1evs94_Wsva-4MiydcPMplVG5DoJfZ8QdM6em3xYpmSQlGbUg',
            ],
            'messages' => [
                [
                    'id' => 1,
                    'type' => 'received',
                    'text' => "Hey! I saw the requirements for the GoodGigs dashboard project. I'm really excited about the kinetic design system you've proposed.",
                    'time' => '09:41 AM',
                    'date' => 'Today',
                ],
                [
                    'id' => 2,
                    'type' => 'sent',
                    'text' => "That's great to hear, Alex! We're aiming for a \"Corporate Modern\" feel. Do you have experience with complex Tailwind configurations?",
                    'time' => '09:43 AM',
                    'status' => 'read',
                ],
                [
                    'id' => 3,
                    'type' => 'received',
                    'text' => "Absolutely. I've sent over a few snippets of my previous design systems. Check the PDF below!",
                    'time' => '09:45 AM',
                    'attachment' => [
                        'name' => 'portfolio_v2_2024.pdf',
                        'size' => '4.2 MB',
                        'type' => 'PDF',
                        'icon' => 'FileText',
                    ]
                ]
            ]
        ];

        return Inertia::render('DirectChat', $data);
    }

    public function userProfile()
    {
        // Mock data for user profile
        $data = [
            'user' => [
                'name' => 'Sarah Jenkins',
                'title' => 'Senior UX/UI Designer & Brand Strategist',
                'description' => 'Senior UX/UI Designer & Brand Strategist with 8+ years of experience helping startups scale their digital presence through intuitive interfaces.',
                'rating' => 4.9,
                'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj1GB4wx3Qpry3I6gw6RMc379HmHgBg1zBJ4sfd7A3R6BYJ9ez7Xr849qe4ys0b6QkUPLIxpHgpiB_1VPAozNwK29OwqETr5oPD_CQIF8Vv5fv-FsutI7f5PYaslT-o_2f_vfVu9fZ2MSbdI_K1xjAXhe8IX1KZlDcM1PNZqXRy6HFkfywie1u7I88zW4rkjUaytKkgy5bhCnz4JrXFldhyOnYoDQr6N7XPuVcXpSwU4TSVXellevHdQ',
                'skills' => ['UX Design', 'Brand Identity', 'Figma', 'Prototyping'],
                'extra_skills_count' => 4,
            ]
        ];

        return Inertia::render('UserProfile', $data);
    }
}
