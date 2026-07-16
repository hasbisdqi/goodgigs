# Product Requirement Document (PRD): GoodGigs

---

## 1. Executive Summary

**GoodGigs** adalah platform penghubung lokal untuk pekerjaan informal dan tugas harian cepat (*odd-jobs*). Platform ini dirancang untuk memudahkan individu mencari bantuan terdekat untuk masalah sehari-hari (seperti pipa bocor, menjahit pakaian robek, membersihkan taman) dengan penyedia jasa informal (pekerja harian, freelancer lokal).

---

## 2. Target Audience & Peran Pengguna

Platform ini melayani dua audiens utama dalam satu akun terpadu menggunakan **Sistem Switch Mode**:
1. **Pemberi Kerja (Employer)**: Orang yang membutuhkan bantuan harian cepat dan bersedia membayar imbalan tertentu.
2. **Pekerja / Penyedia Jasa (Worker)**: Orang yang memiliki keahlian praktis harian dan ingin mendapatkan penghasilan tambahan di lingkungan sekitarnya.

---

## 3. Fitur Utama (Core Features)

### A. Autentikasi & Pengamanan Akun
* **User Registration & User Authentication**: Registrasi, Login, Forgot Password, dan 2-Factor Authentication (2FA) via Fortify.
* Login modern tanpa password menggunakan **Passkeys**.
* Pembatasan keamanan: Pengguna wajib melakukan **Verifikasi Email** sebelum diizinkan memposting tugas atau melamar lowongan.

### B. Role-Based Access Control (Spatie RBAC)
* Pembagian hak akses admin via Spatie Permissions.
* **User Management**: Halaman panel administrasi terintegrasi untuk mengelola pengguna dan matriks hak akses (*roles & permissions*).

### C. Sistem Switch Mode UI
* Pengguna memiliki satu akun dengan preferensi mode (`active_mode`) yang tersimpan di database.
* Tampilan antarmuka berubah dinamis berdasarkan mode aktif:
  * **Mode Pemberi Kerja**: Fokus pada pembuatan tugas baru, pemantauan status tugas yang diposting, dan pemilihan pelamar.
  * **Mode Pekerja**: Fokus pada pencarian/browsing tugas di sekitar, pengajuan lamaran (pitching), dan melacak status lamaran.

### D. Manajemen Tugas & Lamaran
* **Create Job Posting**: Formulir posting tugas harian dengan parameter judul, deskripsi tugas, alamat/lokasi, upah/imbalan, dan tipe tugas.
* **Emergency Job Posting**: Fitur penandaan tugas bersifat "Urgent" untuk prioritas tampilan.
* **Edit & Delete Job Posting**: Kemampuan pemberi kerja merubah/menghapus tugas sebelum dikerjakan.
* Tampilan modal adaptif (**Dialog** untuk desktop, **Drawer bottom** untuk mobile).
* **Apply for Job**: Formulir lamaran terintegrasi langsung di modal detail tugas bagi pekerja.
* **Review Applications**: Daftar pelamar terintegrasi di modal detail tugas bagi pemberi kerja dengan aksi instan: **Terima (Accept)** atau **Tolak (Reject)**.

### E. Komunikasi & Reputasi
* **Messaging**: Obrolan (chat) instan antar pengguna berdasarkan tugas terkait untuk memudahkan koordinasi.
* **Rating and Review**: Penilaian bintang 1-5 dan ulasan tertulis setelah tugas selesai dikerjakan.
* **Map View (Leaflet)**: Peta interaktif berbasis Leaflet untuk menampilkan lokasi gigs/tugas terdekat.
* **Community Endorsement**: Fitur untuk memberikan dukungan komunitas (endorsement) pada profil pekerja.
* **Notification**: Sistem pemberitahuan *real-time* untuk pelamar baru, pesan masuk, dll.

### F. Manajemen Profil & Dashboard Pengguna
* **Employer Dashboard & Worker Dashboard**: Tampilan ringkasan statistik dan aktivitas (tugas diposting, lamaran dikirim) yang disesuaikan dengan mode pengguna.
* **Manage Employer Profile & Manage Worker Profile**: Pengaturan profil spesifik sesuai dengan peran (misal: portofolio bagi pekerja, profil bisnis/rumah bagi pemberi kerja).
* **Portfolio Management**: Fitur unggah hasil kerja sebelumnya sebagai bukti nyata keterampilan pekerja.

### G. Eksekusi & Pembaruan Tugas
* **Job Status Management**: Alur kontrol status tugas dari "Terbuka", "Dalam Pengerjaan", "Selesai", hingga "Dibatalkan".
* **Job Progress Update**: Fitur bagi pekerja untuk memperbarui progres saat melaksanakan tugas (misal mengirim bukti foto progres kepada employer).

### H. Pencarian & Rekomendasi Pintar (Smart Features)
* **Search Jobs & Search Workers**: Direktori dan mesin telusur terpadu untuk mencari tugas maupun talenta lokal berdasarkan keahlian.
* **Smart Job Matching**: Sistem rekomendasi algoritma yang mempertemukan pekerja dengan pekerjaan di sekitarnya yang sesuai dengan profil keahlian.
* **Fair Wage Recommendation**: Saran rentang upah otomatis berdasarkan harga pasar atau minimum yang disarankan saat pemberi kerja memposting tugas.

### I. Kepercayaan, Keamanan, & Administrasi (Trust & Safety)
* **Identity Verification & Skill Verification**: Verifikasi KTP/Identitas dan keahlian profesi (sertifikasi) untuk mendapatkan lencana (badge) "Terverifikasi".
* **Verification Management**: Sistem manajemen bagi tim Admin untuk mengecek, menyetujui, atau menolak dokumen identitas yang masuk.
* **Report Management**: Fitur melaporkan pekerjaan fiktif, spam, atau akun bermasalah (Fraud Detection).
* **Analytics Dashboard**: Dashboard data untuk admin melihat performa aplikasi (GMV transaksi, lonjakan pencarian tugas, dsb).
* **Job Category Management**: Admin dapat menyesuaikan, menambah, dan mengelompokkan kategori tugas secara dinamis.

---

## 4. Persyaratan Teknis & Kepatuhan
* **Backend**: Laravel 13, PHP 8.4, Laravel Fortify (Auth), Spatie (Roles).
* **Frontend**: Inertia.js v3, React 19, Tailwind CSS v4, Lucide React (Icons).
* **Responsive Layout**: Dukungan penuh untuk seluler/mobile (Dialog/Drawer switch).
