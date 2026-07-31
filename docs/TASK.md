# Task Breakdown

## Feature

**Mutual Check-in & Attendance Verification**

---

# Development Rules

* Backend: Laravel
* Frontend: InertiaJS + React
* Routing: Wayfinder
* UI: ShadCN UI
* Testing: Laravel Feature Test
* Semua task dianggap selesai apabila telah memiliki test yang relevan.

---

# Milestone 1 — Foundation

## TASK-001 Create Attendance Session

### Description

Membuat struktur dasar attendance session untuk setiap gig.

### Acceptance Criteria

* Migration `attendance_sessions` dibuat.
* Model dibuat.
* Relasi dengan Job, Worker, dan Employer tersedia.

---

## TASK-002 Create Check-in Table

### Description

Menyimpan data check-in worker maupun employer.

### Acceptance Criteria

* Migration `check_ins` dibuat.
* Menyimpan:

  * latitude
  * longitude
  * accuracy
  * checked_in_at
  * role

---

## TASK-003 Create Evidence Table

### Description

Menyimpan bukti yang diunggah pengguna.

### Acceptance Criteria

* Migration selesai.
* Mendukung foto dan video.
* Relasi dengan attendance session.

---

## TASK-004 Create Dispute Table

### Description

Menyimpan laporan dispute.

### Acceptance Criteria

* Migration selesai.
* Status dispute tersedia.
* Resolution tersedia.

---

# Milestone 2 — Backend

## TASK-005 Worker Check-in API

### Description

Worker dapat melakukan check-in.

### Acceptance Criteria

* Endpoint dibuat.
* Validasi autentikasi.
* Data tersimpan.
* Response sesuai standar API.

---

## TASK-006 Employer Check-in API

Acceptance Criteria

* Endpoint tersedia.
* Data tersimpan.
* Status attendance diperbarui.

---

## TASK-007 Geofence Validation

### Description

Validasi radius lokasi.

### Acceptance Criteria

* Radius configurable.
* Menggunakan Haversine Formula.
* Mengembalikan VALID atau OUTSIDE_GEOFENCE.

---

## TASK-008 Meeting Confirmation

### Description

Mengubah status attendance apabila kedua pihak telah check-in.

### Acceptance Criteria

* Status berubah otomatis.
* Timestamp meeting tersimpan.

---

## TASK-009 QR Verification

### Description

Implementasi QR Code untuk verifikasi pertemuan.

### Acceptance Criteria

* Generate QR.
* QR sekali pakai.
* QR memiliki masa berlaku.

---

## TASK-010 PIN Verification

Acceptance Criteria

* Generate PIN acak.
* PIN kedaluwarsa otomatis.
* PIN hanya dapat digunakan satu kali.

---

## TASK-011 Attendance Timeline

Acceptance Criteria

Sistem menyimpan:

* Job Accepted
* Worker Check-in
* Employer Check-in
* QR Verified
* Work Started
* Work Completed
* Approval

---

## TASK-012 No Show Report

Acceptance Criteria

* Worker dapat melapor employer tidak hadir.
* Employer dapat melapor worker tidak hadir.
* Validasi grace period.

---

## TASK-013 Evidence Upload

Acceptance Criteria

* Upload foto.
* Upload video.
* Metadata lokasi tersimpan.

---

## TASK-014 Automatic Decision

Acceptance Criteria

Implementasi rule:

* QR valid
* GPS valid
* Tidak ada dispute

Status menjadi

Verified Automatically

---

# Milestone 3 — Frontend

## TASK-015 Worker Check-in Page

Acceptance Criteria

* Menggunakan ShadCN.
* Menggunakan Wayfinder.
* Menampilkan status check-in.

---

## TASK-016 Employer Check-in Page

Acceptance Criteria

* Check-in berhasil.
* Status diperbarui secara real-time.

---

## TASK-017 QR Scanner Page

Acceptance Criteria

* Scan QR.
* Menampilkan hasil validasi.

---

## TASK-018 PIN Verification Page

Acceptance Criteria

* Input PIN.
* Validasi berhasil/gagal.

---

## TASK-019 Attendance Timeline Page

Acceptance Criteria

Menampilkan seluruh riwayat attendance.

---

## TASK-020 Evidence Upload Page

Acceptance Criteria

* Upload foto.
* Upload video.
* Preview sebelum upload.

---

## TASK-021 No Show Report Page

Acceptance Criteria

* Form alasan.
* Upload bukti.
* Submit laporan.

---

## TASK-022 Dispute Detail Page

Acceptance Criteria

Menampilkan:

* Timeline
* Evidence
* Status
* Riwayat keputusan

---

# Milestone 4 — Notifications

## TASK-023 Reminder Check-in

Acceptance Criteria

Reminder dikirim apabila:

* Worker belum check-in.
* Employer belum check-in.

---

## TASK-024 Reminder Confirmation

Acceptance Criteria

Employer menerima reminder apabila pekerjaan telah selesai namun belum memberikan keputusan.

---

## TASK-025 Dispute Notification

Acceptance Criteria

Kedua pihak menerima notifikasi ketika dispute dibuat atau diperbarui.

---

# Milestone 5 — Testing

## TASK-026 Feature Test Worker Check-in

Acceptance Criteria

* Radius valid.
* Radius tidak valid.

---

## TASK-027 Feature Test Employer Check-in

Acceptance Criteria

Employer berhasil check-in.

---

## TASK-028 Feature Test Geofence

Acceptance Criteria

Semua rule geofence lolos pengujian.

---

## TASK-029 Feature Test QR

Acceptance Criteria

* QR valid.
* QR kedaluwarsa.
* QR telah digunakan.

---

## TASK-030 Feature Test PIN

Acceptance Criteria

* PIN valid.
* PIN salah.
* PIN kedaluwarsa.

---

## TASK-031 Feature Test No Show

Acceptance Criteria

* Tidak dapat melapor sebelum grace period.
* Dapat melapor setelah grace period.

---

## TASK-032 Feature Test Automatic Decision

Acceptance Criteria

Semua business rule otomatis tervalidasi.

---

## TASK-033 Feature Test Evidence Upload

Acceptance Criteria

* Foto berhasil.
* Video berhasil.
* Format tidak valid ditolak.

---

# Milestone 6 — QA

## TASK-034 End-to-End Flow

Acceptance Criteria

Skenario:

* Job dibuat.
* Worker menerima.
* Check-in.
* Meeting confirmed.
* Bekerja.
* Selesai.
* Employer approve.

Seluruh alur berjalan tanpa intervensi manual.

---

## TASK-035 Edge Case Validation

Acceptance Criteria

Verifikasi skenario:

* Worker tidak hadir.
* Employer tidak hadir.
* GPS di luar radius.
* QR kedaluwarsa.
* PIN kedaluwarsa.
* Kedua pihak saling melapor no-show.
* Upload evidence gagal.
* Internet terputus saat check-in.
* Employer tidak memberikan konfirmasi hingga melewati SLA.

---

# Definition of Done

Sebuah task dianggap selesai apabila:

* Implementasi selesai.
* Mengikuti standar coding project.
* Menggunakan Wayfinder untuk routing frontend.
* Menggunakan komponen ShadCN UI.
* Memiliki Laravel Feature Test yang lulus.
* Tidak terdapat error pada static analysis maupun test suite.
* Telah direview dan disetujui melalui pull request.
