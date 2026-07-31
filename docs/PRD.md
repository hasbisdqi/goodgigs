# Product Requirements Document (PRD)

## Feature

Mutual Check-in & Attendance Verification

---

## Tech Stack & Development Rules

Fitur ini wajib dikembangkan menggunakan stack berikut:

* Backend: Laravel (gunakan MCP Laravel Boost untuk akselerasi development)
* Frontend: InertiaJS + React
* Routing: Wajib menggunakan Wayfinder (dilarang menggunakan `route()` di frontend)
* UI: ShadCN UI (semua komponen UI wajib menggunakan ShadCN)
* Testing: Setiap fitur wajib memiliki Feature Test (Laravel)

---

## Background

Pada platform GIGS Finder, pekerjaan lapangan sangat bergantung pada kehadiran kedua belah pihak di lokasi yang telah disepakati. Saat ini terdapat beberapa potensi penyalahgunaan, antara lain:

* Worker mengklaim employer tidak berada di lokasi padahal employer telah hadir.
* Employer mengklaim telah hadir padahal sebenarnya belum datang.
* Worker melakukan check-in dari lokasi lain (GPS spoofing atau lokasi yang tidak sesuai).
* Employer sengaja mengulur waktu sehingga worker dianggap tidak datang.
* Perselisihan mengenai siapa yang terlambat atau tidak hadir.

Permasalahan tersebut dapat menyebabkan sengketa, penurunan kepercayaan pengguna, hingga keterlambatan pembayaran.

---

# Goal

Membangun mekanisme verifikasi kehadiran yang objektif menggunakan kombinasi lokasi, waktu, bukti digital, dan konfirmasi kedua belah pihak sehingga:

* Meminimalkan laporan palsu.
* Mengurangi sengketa.
* Mempercepat penyelesaian pekerjaan.
* Menjadi dasar evaluasi otomatis.

---

# Success Metrics

* Penurunan jumlah dispute terkait ketidakhadiran ≥ 70%.
* ≥95% pekerjaan berhasil memulai sesi kerja tanpa bantuan admin.
* Waktu penyelesaian dispute rata-rata <24 jam.
* Tingkat false report <5%.

---

# User Stories

### Sebagai Worker

Saya ingin membuktikan bahwa saya benar-benar telah datang ke lokasi agar employer tidak dapat mengklaim saya mangkir.

### Sebagai Employer

Saya ingin memastikan worker benar-benar hadir sebelum pekerjaan dimulai.

### Sebagai Admin

Saya ingin memiliki bukti yang cukup ketika harus memutuskan suatu sengketa.

---

# Scope

## In Scope

* GPS Check-in
* QR/PIN Verification
* Geofence Validation
* Timestamp Recording
* Photo Evidence
* Attendance Status
* No Show Report
* Dispute Trigger

## Out of Scope

* Face Recognition
* Biometric Authentication
* CCTV Integration

---

# Functional Requirements

## FR-01 Worker Check-in

Worker dapat melakukan check-in ketika berada dalam radius lokasi pekerjaan.

Data yang disimpan:

* waktu
* latitude
* longitude
* akurasi GPS
* device id
* foto lokasi (opsional)

Status

Waiting Employer

---

## FR-02 Employer Check-in

Employer melakukan check-in menggunakan aplikasi.

Data yang disimpan:

* timestamp
* lokasi
* device
* foto (opsional)

Status

Waiting Worker

---

## FR-03 Geofence Validation

Sistem memvalidasi:

* Worker berada dalam radius ≤100 meter.
* Employer berada dalam radius ≤100 meter.

Jika gagal

Status

Outside Service Area

---

## FR-04 Meeting Verification

Setelah kedua pihak berhasil check-in

Status berubah menjadi

Meeting Confirmed

Pekerjaan dapat dimulai.

---

## FR-05 QR/PIN Verification

Employer menampilkan QR Code atau PIN.

Worker harus:

* scan QR

atau

* memasukkan PIN

Jika berhasil

Status

Session Started

---

## FR-06 Attendance Timeline

Sistem menyimpan kronologi:

* Job Accepted
* Employer Check-in
* Worker Check-in
* QR Verified
* Work Started
* Work Completed
* Employer Confirmation

---

## FR-07 No Show Report

Apabila salah satu pihak tidak hadir setelah melewati SLA.

Contoh:

Jadwal
09.00

Grace Period

30 menit

Worker dapat memilih

Employer Tidak Hadir

atau

Employer memilih

Worker Tidak Hadir

Laporan wajib disertai:

* foto lokasi
* GPS
* timestamp
* alasan

---

## FR-08 Evidence Collection

Ketika terjadi dispute sistem menyimpan:

* GPS
* Timestamp
* Chat
* Call Attempt
* QR Verification
* Foto
* Status Timeline

---

## FR-09 Automatic Decision

Sistem dapat melakukan keputusan otomatis apabila:

* QR berhasil diverifikasi
* GPS valid
* Tidak ada laporan

Status

Verified Automatically

---

# Business Rules

## BR-01

Worker hanya dapat check-in dalam radius lokasi yang ditentukan.

---

## BR-02

Employer hanya dapat melakukan konfirmasi kehadiran di lokasi pekerjaan.

---

## BR-03

QR Code hanya berlaku satu sesi pekerjaan.

---

## BR-04

PIN memiliki masa berlaku maksimal 10 menit.

---

## BR-05

No Show hanya dapat dilaporkan setelah grace period berakhir.

---

## BR-06

Laporan tanpa bukti tidak dapat diproses otomatis.

---

# User Flow

```
Job Accepted
      │
      ▼
Employer Check-in
      │
      ▼
Worker Check-in
      │
      ▼
GPS Valid?
      │
 ┌────┴────┐
 │         │
Ya        Tidak
 │         │
 ▼         ▼
QR/PIN   Gagal Check-in
 │
 ▼
Meeting Confirmed
 │
 ▼
Start Working
```

---

# Dispute Flow

```
Worker Report
Employer Tidak Hadir
        │
        ▼
Upload Bukti
        │
        ▼
Employer Diberi Kesempatan Menanggapi
        │
        ▼
Evidence Analysis
        │
 ┌───────────────┐
 │ Bukti cukup   │
 │ → Auto Decide │
 └───────────────┘
        │
        ▼
Bukti kurang
        │
        ▼
Admin Review
```

---

# UI Screens (ShadCN UI + Inertia React)

1. Worker Check-in Page (gunakan ShadCN Button, Card, Alert)
2. Employer Check-in Page
3. QR Verification Page (gunakan camera component + ShadCN Dialog)
4. PIN Verification Page (gunakan ShadCN Input + Form)
5. Meeting Confirmed Page
6. Attendance Timeline Page (gunakan ShadCN Timeline / List)
7. No Show Report Page (Form + Upload)
8. Dispute Detail Page
9. Evidence Viewer Page (Image + Video viewer)
10. Admin Decision Page

Semua navigasi wajib menggunakan Wayfinder.

---

# Testing Requirements

Setiap fitur wajib memiliki Feature Test menggunakan Laravel:

Contoh:

* Worker dapat check-in dalam radius valid
* Worker gagal check-in di luar radius
* Employer dapat check-in
* QR verification berhasil
* PIN verification gagal jika expired
* No show report hanya bisa setelah grace period
* Automatic decision berjalan sesuai rule

Gunakan MCP Laravel Boost untuk mempercepat pembuatan test dan boilerplate.

---

# Non Functional Requirements

* GPS validation <2 detik.
* Check-in tetap dapat dilakukan pada jaringan 3G.
* Data lokasi dienkripsi saat transmisi.
* Semua aktivitas memiliki audit log.
* Sistem tetap menyimpan aktivitas ketika offline dan melakukan sinkronisasi setelah koneksi kembali.

---

# Risks

| Risiko                          | Mitigasi                                                                 |
| ------------------------------- | ------------------------------------------------------------------------ |
| GPS Spoofing                    | Deteksi mock location, validasi akurasi GPS, dan analisis pola lokasi.   |
| Employer tidak membuka aplikasi | Reminder otomatis dan SLA konfirmasi.                                    |
| Worker memalsukan foto          | Kamera dalam aplikasi, watermark waktu/lokasi, dan pemeriksaan metadata. |
| Internet tidak stabil           | Penyimpanan lokal dan sinkronisasi otomatis.                             |
| QR dibagikan ke orang lain      | QR bersifat sekali pakai dan memiliki masa berlaku singkat.              |

---

# Future Enhancements

* AI Vision untuk memverifikasi hasil pekerjaan berdasarkan foto sebelum dan sesudah.
* Live Location Sharing selama pekerjaan berlangsung.
* NFC Check-in untuk lokasi tertentu.
* Wearable Safety Check bagi pekerjaan berisiko tinggi.
* Dynamic Geofence berdasarkan luas area proyek.
