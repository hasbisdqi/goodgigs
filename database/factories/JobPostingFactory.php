<?php

namespace Database\Factories;

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobPosting>
 */
class JobPostingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tasks = [
            [
                'title' => 'Urgent: Menjahit Baju Robek',
                'company' => 'Pribadi (Ibu Ambar)',
                'description' => 'Ada 3 pasang celana panjang dan 2 kemeja kerja yang robek di bagian jahitan samping. Butuh tukang jahit yang bisa datang ke lokasi atau saya antar. Pekerjaan harus selesai dalam 1 hari karena kemeja mau dipakai kerja.',
                'location' => 'Jakarta Selatan',
                'salary' => 'Rp 100.000 - Rp 150.000',
                'type' => 'Urgent',
            ],
            [
                'title' => 'Perbaikan Pipa Air Bocor di Dapur',
                'company' => 'Rumah Tangga (Pak Budi)',
                'description' => 'Pipa wastafel dapur bocor merembes hingga membanjiri lantai bawah lemari dapur. Butuh orang yang bisa mengganti pipa PVC yang retak dan memasang seal tape baru. Alat-alat seperti kunci inggris harap dibawa sendiri.',
                'location' => 'Bandung, Jawa Barat',
                'salary' => 'Rp 200.000',
                'type' => 'One-time Task',
            ],
            [
                'title' => 'Bantu Pindahan Kos-Kosan (Angkat Barang)',
                'company' => 'Pribadi (Rian)',
                'description' => 'Mencari 2 orang untuk membantu mengangkut barang kos dari lantai 3 ke dalam mobil pick-up. Barang berupa kasur lipat, kardus pakaian, meja lipat, dan kulkas mini. Estimasi waktu pengerjaan 2 jam.',
                'location' => 'Yogyakarta (Sleman)',
                'salary' => 'Rp 75.000 / jam',
                'type' => 'Short-term',
            ],
            [
                'title' => 'Potong Rumput Halaman Belakang Rumah',
                'company' => 'Keluarga (Ibu Rita)',
                'description' => 'Rumput di halaman belakang sudah cukup tinggi sekitar 30cm. Luas halaman sekitar 5x6 meter. Perlu dirapikan sekaligus dibersihkan sampah daun keringnya. Mesin potong rumput sudah kami sediakan.',
                'location' => 'Surabaya, Jawa Timur',
                'salary' => 'Rp 150.000',
                'type' => 'One-time Task',
            ],
            [
                'title' => 'Bantu Setup Router WiFi Rumah',
                'company' => 'Pribadi (Pak Anton)',
                'description' => 'Baru pasang internet kabel tapi router WiFi di lantai 2 tidak terkonfigurasi dengan baik sehingga sinyal putus-putus. Butuh orang yang paham setting router TP-Link/D-Link agar jangkauan sinyal optimal.',
                'location' => 'Tangerang Selatan',
                'salary' => 'Rp 120.000',
                'type' => 'One-time Task',
            ],
            [
                'title' => 'Service AC Kamar Tidur Bocor Air',
                'company' => 'Pribadi (Siska)',
                'description' => 'AC merk Sharp 1 PK di kamar tidur meneteskan air dari indoor unit. AC baru dicuci 3 bulan lalu, kemungkinan saluran pembuangan tersumbat lendir. Butuh cepat hari ini.',
                'location' => 'Depok, Jawa Barat',
                'salary' => 'Rp 100.000',
                'type' => 'Urgent',
            ],
            [
                'title' => 'Mencuci & Setrika Pakaian Menumpuk',
                'company' => 'Keluarga (Ibu Diana)',
                'description' => 'Ada jemuran baju menumpuk sekitar 3 keranjang besar karena mesin cuci di rumah sedang rusak. Butuh bantuan untuk mencuci manual dan menyetrika rapi semuanya. Deterjen dan setrika uap sudah disediakan.',
                'location' => 'Medan, Sumatera Utara',
                'salary' => 'Rp 180.000',
                'type' => 'Short-term',
            ],
        ];

        $selected = $this->faker->randomElement($tasks);

        return [
            'user_id' => User::factory(),
            'title' => $selected['title'],
            'company' => $selected['company'],
            'description' => $selected['description'],
            'location' => $selected['location'],
            'salary' => $selected['salary'],
            'type' => $selected['type'],
            'status' => 'published',
            'latitude' => $this->faker->latitude(-6.3, -6.1), // Around Jakarta
            'longitude' => $this->faker->longitude(106.7, 106.9),
        ];
    }
}
