# 🐘 XayzEduPhp

**Buku interaktif 50 halaman** untuk belajar inti bahasa PHP — dari sejarah, sintaks dasar, tipe data, array, fungsi, OOP, hingga database dan keamanan. Tampil seperti buku sungguhan (efek buka-halaman), lengkap dengan:

- ✅ Teks berformat **Markdown** (bold, italic, list, tabel, blockquote)
- ✅ **Syntax highlighting** kode PHP bergaya **VS Code Dark+**
- ✅ Rumus matematis dengan **LaTeX / KaTeX**
- ✅ Contoh **kode input & output (hasil)** berdampingan
- ✅ Navigasi ala buku: klik/`←``→`, lompat ke halaman, dan Daftar Isi
- ✅ Desain minimalis, modern, dan responsif (mobile-friendly)
- ✅ Script PHP asli yang bisa dijalankan (`/php-scripts`) dan API serverless (`/api`)

Dibangun murni dengan **HTML + CSS + JavaScript** (statis) untuk buku itu sendiri, dan **PHP asli** untuk contoh script yang bisa dijalankan serta endpoint API.

---

## 📁 Struktur Proyek

```
XayzEduPhp/
├── index.html              # Halaman utama buku
├── css/                    # Desain buku + tema syntax highlight ala VS Code
├── js/app.js                # Logika render markdown/KaTeX/Prism + navigasi buku
├── data/                    # Konten 50 halaman (markdown, dalam berkas .js)
├── api/index.php             # Endpoint serverless PHP (untuk Vercel)
├── php-scripts/              # Script PHP asli yang bisa dijalankan lokal
├── vercel.json                # Konfigurasi Vercel (Hobby/Free tier)
├── package.json                # Node.js v20 — untuk pratinjau statis lokal
└── .github/workflows/pages.yml  # Auto-deploy ke GitHub Pages
```

---

## ▶️ Menjalankan secara lokal

### Opsi A — Pratinjau buku (statis, via Node.js v20+)
```bash
npm install
npm start
```
Buka `http://localhost:3000`.

### Opsi B — Jalankan dengan PHP asli (untuk mencoba `/api` dan `/php-scripts`)
```bash
php -S localhost:8000
```
Buka `http://localhost:8000` untuk buku, atau
`http://localhost:8000/php-scripts/01-hello.php` untuk contoh script PHP,
atau `http://localhost:8000/api/index.php?aksi=bab` untuk API.

> Buku (`index.html`) sepenuhnya statis — ia tidak memerlukan PHP untuk tampil,
> karena semua contoh kode & output ditampilkan sebagai teks yang sudah diberi
> highlight. PHP baru benar-benar dieksekusi saat kamu membuka berkas di
> `/php-scripts` atau `/api` lewat server PHP sungguhan.

---

## 🌐 Deploy ke GitHub Pages (statis)

1. Push folder ini ke repository GitHub (branch `main`).
2. Buka **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/pages.yml` akan otomatis mem-build & men-deploy
   setiap kali ada push ke `main`.
4. Situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.

Karena buku ini murni statis (HTML/CSS/JS), GitHub Pages sudah cukup untuk
menampilkannya sepenuhnya — termasuk seluruh 50 halaman, syntax highlight,
dan KaTeX.

---

## ▲ Deploy ke Vercel (Free / Hobby plan)

1. Import repository ini ke [vercel.com](https://vercel.com) (akun gratis).
2. Vercel akan otomatis mendeteksi `vercel.json`:
   - Situs statis (`index.html`, `css/`, `js/`, `data/`) disajikan langsung.
   - `api/index.php` dijalankan sebagai **Serverless Function** memakai
     runtime komunitas [`vercel-php`](https://github.com/juicyfx/vercel-php),
     kompatibel dengan paket **Hobby (gratis)**.
3. Setelah deploy, coba:
   - `https://<project>.vercel.app/` — buku
   - `https://<project>.vercel.app/api/index.php?aksi=bab` — API PHP sungguhan
   - `https://<project>.vercel.app/api/index.php?aksi=hitung&a=4&b=6` — kalkulator PHP

Tidak ada konfigurasi berbayar yang dipakai (tanpa cron job, tanpa region
khusus, tanpa Edge Config) — proyek ini didesain agar tetap berjalan penuh
di paket gratis Vercel.

---

## 🧭 Navigasi Buku

| Aksi | Cara |
|---|---|
| Halaman berikutnya | tombol `›` atau tombol panah kanan (`→`) |
| Halaman sebelumnya | tombol `‹` atau tombol panah kiri (`←`) |
| Lompat ke halaman tertentu | isi kotak nomor halaman lalu Enter |
| Buka Daftar Isi | ikon `☰` di kiri atas, atau cari bab lewat kotak pencarian |

---

## 📜 Lisensi

Kode & contoh di proyek ini bebas dipakai untuk belajar, mengajar, atau
dikembangkan lebih lanjut (lisensi MIT).
