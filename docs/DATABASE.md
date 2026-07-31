# Database Design

## Feature

**Mutual Check-in & Attendance Verification**

---

# Overview

Fitur ini menambahkan mekanisme verifikasi kehadiran antara worker dan employer melalui attendance session. Seluruh aktivitas check-in, evidence, timeline, dan dispute akan dicatat sebagai bagian dari satu sesi pekerjaan (`attendance_session`).

---

# Entity Relationship

```text
jobs
 └── 1 : 1 attendance_sessions
          ├── 1 : N check_ins
          ├── 1 : N attendance_events
          ├── 1 : N evidences
          └── 1 : N disputes
```

---

# attendance_sessions

Merepresentasikan satu sesi kehadiran untuk satu pekerjaan.

| Column               | Type               | Notes                             |
| -------------------- | ------------------ | --------------------------------- |
| id                   | uuid               | Primary Key                       |
| job_id               | uuid               | FK → jobs.id                      |
| worker_id            | uuid               | FK → users.id                     |
| employer_id          | uuid               | FK → users.id                     |
| status               | enum               | Current attendance status         |
| meeting_confirmed_at | timestamp nullable | Kedua pihak berhasil diverifikasi |
| work_started_at      | timestamp nullable | Pekerjaan dimulai                 |
| work_completed_at    | timestamp nullable | Worker menandai selesai           |
| employer_approved_at | timestamp nullable | Employer menyetujui pekerjaan     |
| created_at           | timestamp          |                                   |
| updated_at           | timestamp          |                                   |

---

## Status Enum

```text
waiting_checkin
waiting_employer
waiting_worker
meeting_confirmed
working
waiting_approval
completed
disputed
cancelled
```

---

# check_ins

Menyimpan setiap aktivitas check-in.

| Column                | Type          | Notes             |
| --------------------- | ------------- | ----------------- |
| id                    | uuid          | Primary Key       |
| attendance_session_id | uuid          | FK                |
| user_id               | uuid          | FK users          |
| role                  | enum          | worker / employer |
| latitude              | decimal(10,7) |                   |
| longitude             | decimal(10,7) |                   |
| accuracy              | decimal(8,2)  | Meter             |
| qr_verified           | boolean       | Default false     |
| pin_verified          | boolean       | Default false     |
| checked_in_at         | timestamp     |                   |
| created_at            | timestamp     |                   |
| updated_at            | timestamp     |                   |

Constraint:

* Satu user hanya boleh memiliki satu check-in aktif per attendance session.

Unique Index

```text
(attendance_session_id, user_id)
```

---

# attendance_events

Audit trail seluruh perubahan status.

| Column                | Type          |
| --------------------- | ------------- |
| id                    | uuid          |
| attendance_session_id | uuid          |
| event                 | string        |
| actor_id              | uuid nullable |
| metadata              | json          |
| created_at            | timestamp     |

Contoh event:

```text
job_accepted
worker_checked_in
employer_checked_in
meeting_confirmed
work_started
work_completed
approval_requested
approved
rejected
dispute_created
```

---

# evidences

Menyimpan seluruh bukti.

| Column                | Type                   |
| --------------------- | ---------------------- |
| id                    | uuid                   |
| attendance_session_id | uuid                   |
| uploader_id           | uuid                   |
| type                  | enum                   |
| file_path             | string                 |
| mime_type             | string                 |
| latitude              | decimal(10,7) nullable |
| longitude             | decimal(10,7) nullable |
| captured_at           | timestamp nullable     |
| metadata              | json nullable          |
| created_at            | timestamp              |
| updated_at            | timestamp              |

---

## Evidence Type

```text
photo
video
document
```

Metadata dapat berisi:

```json
{
  "device": "iPhone 15",
  "gps_accuracy": 8.2,
  "size": 1827364
}
```

---

# disputes

Menyimpan laporan sengketa.

| Column                | Type               |
| --------------------- | ------------------ |
| id                    | uuid               |
| attendance_session_id | uuid               |
| reporter_id           | uuid               |
| reported_user_id      | uuid nullable      |
| reason                | text               |
| status                | enum               |
| resolution            | enum nullable      |
| resolved_by           | uuid nullable      |
| resolved_at           | timestamp nullable |
| created_at            | timestamp          |
| updated_at            | timestamp          |

---

## Dispute Status

```text
open
reviewing
resolved
closed
```

---

## Resolution

```text
worker_valid
employer_valid
mutual_fault
manual_review
```

---

# qr_verifications

Menyimpan QR yang diterbitkan employer.

| Column                | Type               |
| --------------------- | ------------------ |
| id                    | uuid               |
| attendance_session_id | uuid               |
| token                 | string             |
| expires_at            | timestamp          |
| used_at               | timestamp nullable |
| created_at            | timestamp          |

Constraint:

* Token hanya dapat digunakan satu kali.

---

# pin_verifications

Alternatif selain QR.

| Column                | Type               |
| --------------------- | ------------------ |
| id                    | uuid               |
| attendance_session_id | uuid               |
| pin                   | string             |
| expires_at            | timestamp          |
| verified_at           | timestamp nullable |
| created_at            | timestamp          |

---

# Relationships

```text
Job
 └── hasOne AttendanceSession

AttendanceSession
 ├── belongsTo Job
 ├── belongsTo Worker
 ├── belongsTo Employer
 ├── hasMany CheckIns
 ├── hasMany AttendanceEvents
 ├── hasMany Evidences
 ├── hasMany Disputes
 ├── hasOne QRVerification
 └── hasOne PINVerification
```

---

# Indexes

attendance_sessions

* job_id
* worker_id
* employer_id
* status

check_ins

* attendance_session_id
* user_id
* checked_in_at

attendance_events

* attendance_session_id
* created_at

evidences

* attendance_session_id
* uploader_id

disputes

* attendance_session_id
* status

---

# Cascade Rules

| Parent              | Child               | Action         |
| ------------------- | ------------------- | -------------- |
| jobs                | attendance_sessions | Cascade Delete |
| attendance_sessions | check_ins           | Cascade Delete |
| attendance_sessions | attendance_events   | Cascade Delete |
| attendance_sessions | evidences           | Cascade Delete |
| attendance_sessions | disputes            | Cascade Delete |
| attendance_sessions | qr_verifications    | Cascade Delete |
| attendance_sessions | pin_verifications   | Cascade Delete |

---

# Storage

Evidence disimpan di object storage.

Database hanya menyimpan:

* file_path
* mime_type
* metadata

File fisik tidak disimpan di database.

---

# Future Schema Considerations

Apabila fitur berkembang, tabel berikut dapat ditambahkan:

* `live_locations` untuk menyimpan lokasi worker secara periodik selama pekerjaan berlangsung.
* `attendance_devices` untuk mencatat informasi perangkat yang digunakan saat check-in.
* `fraud_flags` untuk menyimpan hasil deteksi anomali seperti GPS spoofing atau pola aktivitas yang mencurigakan.
* `attendance_reviews` untuk menyimpan hasil evaluasi pasca pekerjaan yang berkaitan dengan kehadiran.
