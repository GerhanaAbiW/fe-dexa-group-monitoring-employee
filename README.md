# Dexa Group People Monitor

Frontend React untuk use case nomor 2, **Aplikasi Monitoring Karyawan**. Aplikasi ini ditujukan untuk admin HRD dan menggunakan desain yang konsisten dengan project Employee Portal `fe-dexa-group`.

## Fitur

- Dashboard ringkasan jumlah karyawan dan absensi hari ini.
- Daftar karyawan dengan pencarian, filter status, dan pagination.
- Tambah dan update data karyawan.
- Nonaktifkan karyawan menggunakan endpoint soft delete.
- Monitoring absensi seluruh karyawan secara read-only.
- Filter absensi berdasarkan karyawan dan rentang tanggal.
- Notification center untuk perubahan data karyawan, termasuk polling dan penandaan sudah dibaca.
- Tampilan responsif untuk desktop dan mobile.
- Status koneksi Monitoring API.
- Login HRD menggunakan email dan password yang diverifikasi ke Attendance API.
- Logout serta proteksi route dashboard, karyawan, dan absensi.

## Teknologi

- React 19 dan TypeScript strict
- Vite dan Tailwind CSS 4
- React Router
- TanStack React Query
- Orval untuk menghasilkan service, DTO, React Query hooks, dan kontrak Zod dari OpenAPI
- ESLint dan Oxlint

## Menjalankan Aplikasi

```bash
npm install
```

Salin konfigurasi environment:

```powershell
Copy-Item .env.example .env
```

Isi konfigurasi sesuai backend:

```env
VITE_ATTENDANCE_API_URL=http://localhost:3001
VITE_MONITORING_API_URL=http://localhost:3002
```

Monitoring App login melalui endpoint `/api/v1/auth/login` pada Attendance API.
Token hasil login dikirim sebagai bearer token ke Monitoring API. Backend harus
memastikan hanya akun dengan role/izin HRD yang dapat mengakses endpoint admin.

Jika **Ingat saya** dipilih, sesi disimpan di `localStorage`. Jika tidak, sesi
disimpan di `sessionStorage` dan berakhir saat tab browser ditutup.

Kemudian jalankan:

```bash
npm run dev
```

> Monitoring App tidak lagi memerlukan `VITE_MONITORING_ADMIN_API_KEY`.
> Untuk production, penyimpanan sesi melalui cookie `HttpOnly` oleh backend/BFF
> lebih aman daripada menyimpan token pada browser storage.

## OpenAPI

Spesifikasi API disalin dari project `fe-dexa-group` dan tersedia di:

```text
src/open-api/monitoring-employee/openapi.json
```

Generate ulang client API dengan:

```bash
npm run generate:api
```

Output generator berada di `src/services/generated/monitoring` dan `src/contracts/generated/monitoring`. File hasil generator tidak diedit manual.

## Quality Check

```bash
npm run lint
npm run lint:fast
npm run build
```

Hasil build produksi tersedia di folder `dist`.

## Struktur Utama

```text
src/
├── app/                         # Provider dan router
├── components/
│   ├── layout/                  # Sidebar, header, notification center
│   └── ui/                      # Komponen UI reusable
├── features/
│   ├── attendance/              # Monitoring absensi read-only
│   ├── auth/                    # Login, sesi admin, dan logout
│   ├── dashboard/               # Ringkasan admin
│   └── employees/               # CRUD data karyawan
├── open-api/monitoring-employee # Source OpenAPI
├── services/generated/monitoring
└── contracts/generated/monitoring
```
