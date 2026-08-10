# RIG ORDER — Panduan Deploy

## 1. Setup Supabase (kalau belum)
1. Jalankan `setup-database.sql` di Supabase SQL Editor.
2. Buat storage bucket bernama **rigops-photos**, set jadi **Public**.
3. Ambil **Project URL** dan **anon public key** dari Project Settings → API.

## 2. Unggah ke GitHub
1. Buat repository baru di github.com (nama bebas, misal `rig-order`).
2. Upload semua file di folder ini ke repository itu (bisa lewat tombol "uploading an existing file" di GitHub, tarik semua file & folder `src`).

## 3. Deploy ke Vercel
1. Login ke vercel.com, klik **Add New → Project**.
2. Pilih repository `rig-order` yang baru diunggah.
3. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = Project URL dari Supabase
   - `VITE_SUPABASE_ANON_KEY` = anon public key dari Supabase
4. Klik **Deploy**. Tunggu 1-2 menit.
5. Setelah selesai, Anda akan dapat alamat seperti `rig-order.vercel.app` — itu link yang dibagikan ke tim MA.

## Catatan
- Password akses Pengawas masih `workshop2026`, diatur di `src/App.jsx` (cari `PENGAWAS_PASSWORD`) — bisa diganti sebelum upload ke GitHub.
- Kalau nanti tambah fitur, ubah file di `src/App.jsx`, lalu upload ulang ke GitHub — Vercel otomatis build ulang.
