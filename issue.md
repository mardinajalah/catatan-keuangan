# Ringkasan Perbaikan Mobile

## Issue Terkait

GitHub issue:

```text
https://github.com/mardinajalah/catatan-keuangan/issues/13
```

## Masalah yang Diperbaiki

### 1. Aplikasi Langsung Masuk Halaman Utama Tanpa Login

Sebelumnya aplikasi langsung merender halaman utama saat APK dibuka, walaupun user belum login. Penyebabnya adalah belum ada auth gate yang menunggu status Firebase Authentication.

Perbaikan:

- Menambahkan `components/AuthGate.tsx`.
- Auth gate memakai `onAuthStateChanged(auth, ...)`.
- Saat status auth masih dicek, aplikasi menampilkan loading.
- Jika tidak ada user, aplikasi diarahkan ke `/(auth)/login`.
- Jika user sudah login dan membuka route auth, aplikasi diarahkan ke halaman utama.
- Token lokal dihapus saat Firebase user tidak tersedia.

File terkait:

- `components/AuthGate.tsx`
- `app/_layout.tsx`

### 2. Refresh Transaksi Berjalan Sebelum Auth Siap

Sebelumnya `TransactionsStore` bisa memanggil API transaksi saat app baru mount, sebelum Firebase Auth siap. Ini dapat menyebabkan request tanpa token, token lama, atau network error yang membingungkan.

Perbaikan:

- `TransactionsStore` sekarang mengecek `auth.currentUser` sebelum request transaksi.
- Store subscribe ke `onAuthStateChanged`.
- Jika user logout atau tidak ada user, transaksi lokal dibersihkan.
- Request transaksi hanya berjalan saat Firebase user tersedia.

File terkait:

- `components/TransactionsStore.tsx`

### 3. Base URL Development Membingungkan

Sebelumnya development mode mencoba memakai IP laptop dari Expo host, sehingga saat backend lokal tidak berjalan muncul `AxiosError: Network Error`.

Perbaikan:

- Default API sekarang memakai backend Vercel:

```text
https://api-catatan-keuangan.vercel.app/api
```

- Jika ingin memakai backend lain, gunakan:

```env
EXPO_PUBLIC_API_BASE_URL=http://ip-laptop:5000
```

atau:

```env
EXPO_PUBLIC_API_BASE_URL=https://api-catatan-keuangan.vercel.app
```

- Saat development, aplikasi mencetak base URL ke terminal:

```text
API Base URL: ...
```

File terkait:

- `utils/api.ts`

### 4. Error Login/Register Terlalu Umum

Sebelumnya login/register sering hanya menampilkan `Terjadi kesalahan pada server`, sehingga sulit membedakan apakah error berasal dari Firebase Auth, backend Vercel, atau jaringan.

Perbaikan:

- Menambahkan `utils/errors.ts`.
- Error Firebase Auth dipetakan menjadi pesan yang lebih jelas:
  - email sudah terdaftar
  - email/password salah
  - password lemah
  - jaringan Firebase gagal
- Error backend sync profile diberi pesan khusus:

```text
Login Firebase berhasil, tetapi gagal sinkron ke backend...
```

atau:

```text
Register Firebase berhasil, tetapi gagal sinkron ke backend...
```

- Jika sync profile gagal, user di-logout dari Firebase agar app tidak masuk ke halaman utama dalam kondisi data belum sinkron.

File terkait:

- `utils/errors.ts`
- `app/(auth)/login.tsx`
- `app/(auth)/register.tsx`
- `utils/api.ts`

### 5. Token Lama Tidak Dipakai Lagi

Sebelumnya helper token masih dapat memakai token cache sebagai fallback ketika Firebase `currentUser` belum tersedia. Ini berisiko memakai token lama.

Perbaikan:

- `getAuthToken()` sekarang hanya mengembalikan token dari `auth.currentUser`.
- Jika tidak ada Firebase user aktif, token lokal dihapus dan API tidak mengirim bearer token.

File terkait:

- `utils/auth.ts`

## Verifikasi

Perintah yang sudah dijalankan:

```bash
npm.cmd exec tsc -- --noEmit
```

Hasil:

```text
berhasil
```

## Catatan Manual Test

Untuk APK production:

1. Clear app data di HP.
2. Buka app saat online.
3. Pastikan diarahkan ke login.
4. Register user baru.
5. Pastikan user tersimpan di Firebase Authentication.
6. Pastikan profile berhasil sync ke backend.
7. Tambah pemasukan dan pengeluaran.
8. Tutup dan buka ulang app.
9. Pastikan data transaksi tetap muncul.
10. Matikan internet.
11. Pastikan muncul `Anda sedang offline`.

Untuk Expo development dengan backend Vercel:

```bash
set EXPO_PUBLIC_API_BASE_URL=https://api-catatan-keuangan.vercel.app
npm.cmd run dev
```

Untuk Expo development dengan backend lokal:

```bash
set EXPO_PUBLIC_API_BASE_URL=http://ip-laptop:5000
npm.cmd run dev
```

## Update Perbaikan Register dan Navigasi Auth

Perubahan tambahan:

- Setelah register berhasil, user tidak langsung masuk ke halaman utama.
- User baru diarahkan kembali ke halaman login agar login manual terlebih dahulu.
- Jika akun Firebase berhasil dibuat tetapi sync profile ke backend gagal, akun Firebase yang baru dibuat akan dihapus.
- Token lokal tidak disimpan saat proses register sampai alur register benar-benar selesai.
- Route auth Expo Router diperbaiki dari `/(auth)/login` dan `/(auth)/register` menjadi `/login` dan `/register`.

File terkait:

- `app/(auth)/register.tsx`
- `app/(auth)/login.tsx`
- `app/(home)/index.tsx`
- `components/AuthGate.tsx`
- `utils/api.ts`
- `utils/auth.ts`

Verifikasi tambahan:

```bash
npm.cmd exec tsc -- --noEmit
```

Hasil:

```text
berhasil
```
