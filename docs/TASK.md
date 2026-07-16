# Task List & Progress: GoodGigs

Berikut adalah daftar tugas pengembangan GoodGigs beserta status pengerjaannya untuk memastikan konsistensi proyek:

---

## Fase 1: Autentikasi, Hak Akses, & Modul Tugas Dasar (Selesai)
- [x] User Registration & User Authentication (Fortify, Passkeys).
- [x] Instalasi & Konfigurasi Spatie Roles & Permissions (User Management).
- [x] Pembuatan helper frontend `usePermission` dan middleware bypass untuk Super Admin.
- [x] Halaman administrasi manajemen User & Role di sidebar.
- [x] Model, Migrasi, Seeder, dan Controller CRUD `JobPosting` (Create Job Posting).
- [x] Integrasi Edit Job Posting & Delete Job Posting.
- [x] Penambahan fitur Emergency Job Posting (Tanda Urgent/Darurat).
- [x] Integrasi antarmuka Dialog/Drawer responsif untuk lowongan tugas.
- [x] Penambahan modul lamaran tugas `JobApplication` (Apply for Job).
- [x] Fitur Review Applications (Terima/Tolak pelamar di modal tugas).
- [x] Implementasi syarat verifikasi email (`MustVerifyEmail`) untuk posting dan lamaran tugas.
- [x] Unit/Feature test coverage untuk seluruh modul autentikasi, tugas, dan lamaran.

---

## Fase 2: Sistem Switch Mode UI (Selesai)
- [x] Buat migrasi untuk menambahkan kolom `active_mode` (default: `'worker'`) ke tabel `users`.
- [x] Buat `SwitchModeController` dan route `POST /profile/switch-mode` di backend.
- [x] Tambahkan tombol Toggle Switch di Sidebar (`app-sidebar.tsx`) untuk merubah mode aktif.
- [x] Sembunyikan/Tampilkan navigasi link sidebar berdasarkan `active_mode` yang aktif.
- [x] Update feature test untuk validasi ganti mode.

---

## Fase 3: Sistem Chat Internal & Notifikasi (Selesai)
- [x] Messaging: Buat migrasi tabel `chat_messages` (id, job_posting_id, sender_id, receiver_id, message, read_at).
- [x] Buat Model `ChatMessage` dan controller endpoint untuk mengirim/mengambil pesan.
- [x] Buat komponen UI Chat Box di dalam modal detail tugas.
- [x] Notification: Integrasi sistem notifikasi (lamaran baru, pesan masuk, update tugas).
- [x] Buat feature test pengiriman pesan dan notifikasi.

---

## Fase 4: Sistem Rating & Ulasan (Selesai)
- [x] Rating and Review: Buat migrasi tabel `reviews` (id, reviewer_id, reviewee_id, job_posting_id, rating, comment).
- [x] Tambahkan status tugas `'completed'` (Selesai) pada lowongan tugas.
- [x] Buat form ulasan pasca-tugas selesai dikerjakan.
- [x] Tampilkan rata-rata ulasan bintang di profil pengguna.
- [x] Community Endorsement: Tambahkan fitur endorsement antar pengguna di profil.

---

## Fase 5: Visualisasi Peta & Pencarian Tugas (Belum Dikerjakan)
- [ ] Search Jobs: Fitur pencarian lanjutan dan filter (lokasi, kategori, harga) untuk pekerja.
- [ ] Tambahkan kolom koordinat (`latitude`, `longitude`) di tabel `job_postings`.
- [ ] Integrasikan peta Leaflet.js di halaman utama pencarian tugas.
- [ ] Tampilkan pin penanda lokasi gig/tugas secara visual di peta.

---

## Fase 6: Manajemen Profil, Dashboard, & Eksekusi Tugas (Belum Dikerjakan)
- [ ] Employer Dashboard & Worker Dashboard: Tampilan ringkasan aktivitas sesuai peran.
- [ ] Manage Employer Profile & Manage Worker Profile: Halaman khusus untuk memperbarui info terkait peran (alamat usaha vs keterampilan).
- [ ] Portfolio Management: Fitur unggah dokumen/foto portofolio untuk pekerja.
- [ ] Job Status Management: Alur manajemen status tugas yang lebih rinci (Dalam Pengerjaan, Pending, Selesai).
- [ ] Job Progress Update: Pekerja dapat memberikan update harian/progres dari tugas yang sedang dikerjakan.
- [ ] Search Workers: Fitur pencarian direktori pekerja bagi pemberi kerja.

---

## Fase 7: Fitur Pintar & Rekomendasi (Belum Dikerjakan)
- [ ] Smart Job Matching: Algoritma pencocokan pekerja dengan lowongan terdekat dan relevan dengan keahliannya.
- [ ] Fair Wage Recommendation: Sistem saran upah minimal otomatis berdasarkan jenis tugas dan tren lokasi agar gaji adil.

---

## Fase 8: Trust & Safety (Kepercayaan & Verifikasi) (Belum Dikerjakan)
- [ ] Identity Verification: Modul unggah kartu identitas (KTP) / swafoto untuk validasi pengguna.
- [ ] Skill Verification: Pengajuan verifikasi keahlian khusus (misal: sertifikat teknisi kelistrikan).
- [ ] Verification Management: Halaman admin (backend) untuk meninjau (Review) dan menyetujui dokumen identitas.
- [ ] Report Management: Sistem pelaporan postingan pekerjaan palsu, spam, atau akun bermasalah.

---

## Fase 9: Administrasi & Analitik (Belum Dikerjakan)
- [ ] Analytics Dashboard: Panel Super Admin untuk melihat jumlah transaksi, pertumbuhan pengguna, dan rasio sukses pekerjaan.
- [ ] Job Category Management: Modul CRUD untuk menambah/mengedit kategori dan sub-kategori pekerjaan secara dinamis.
