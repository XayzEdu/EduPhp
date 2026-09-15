# 🐘 XayzEduPhp

**Buku interaktif 100 halaman** untuk belajar inti bahasa PHP — dari sejarah, sintaks dasar, tipe data, array, fungsi, OOP, **database & SQL CRUD lengkap**, arsitektur lanjutan (design pattern, DI), REST API modern (routing, middleware, JWT, CORS), hingga tools & deployment. Tampil seperti buku sungguhan (efek buka-halaman), lengkap dengan:

- ✅ Teks berformat **Markdown** (bold, italic, list, tabel, blockquote)
- ✅ **Syntax highlighting** kode PHP/SQL bergaya **VS Code Dark+**
- ✅ Rumus matematis dengan **LaTeX / KaTeX**
- ✅ Contoh **kode input & output (hasil)** berdampingan
- ✅ **15 Latihan Interaktif** dengan kode PHP/SQL **SUNGGUHAN yang benar-benar dieksekusi di browser** (bukan simulasi) — susun potongan kode yang teracak & lengkapi bagian yang hilang, tekan **Jalankan**, lalu bandingkan dengan tombol **Hasil yang Diharapkan** atau intip **Solusi**. Popup kustom "Benar!"/"Belum Tepat" muncul otomatis setelah kode dijalankan.
- ✅ Navigasi ala buku: klik/`←``→`, lompat ke halaman, dan Daftar Isi (100 bab, dikelompokkan per bagian)
- ✅ Desain minimalis, modern, dan responsif (mobile-friendly)
- ✅ Script PHP asli yang bisa dijalankan (`/php-scripts`, termasuk Mini REST API Todo-List end-to-end) dan API serverless (`/api`)

Dibangun murni dengan **HTML + CSS + JavaScript** (statis) untuk buku itu sendiri, dan **PHP asli** untuk contoh script yang bisa dijalankan serta endpoint API.

### ⚙️ Mesin eksekusi kode latihan interaktif

Latihan interaktif menjalankan kode **sungguhan**, 100% di browser pengguna, tanpa server backend, tanpa API key, dan tanpa batas jumlah request:

| Bahasa | Mesin | Teknologi |
|---|---|---|
| PHP | [php-wasm](https://github.com/seanmorris/php-wasm) | Interpreter PHP asli dikompilasi ke WebAssembly |
| SQL | [sql.js](https://github.com/sql-js/sql.js) | SQLite asli dikompilasi ke WebAssembly |

Karena keduanya berjalan penuh di sisi klien (diunduh dari CDN publik saat halaman dibuka), fitur ini **tetap berfungsi utuh** meski buku di-hosting sebagai situs statis murni di GitHub Pages atau Vercel — tidak ada komponen server yang perlu dijalankan untuk menjalankan latihan.

---

## 📁 Struktur Proyek

```
XayzEduPhp/
├── index.html               # Halaman utama buku
├── css/                      # Desain buku + tema syntax highlight ala VS Code
├── js/
│   ├── app.js                  # Render markdown/KaTeX/Prism + navigasi buku
│   ├── playground-engine.js    # Mesin eksekusi kode sungguhan (php-wasm & sql.js)
│   └── exercise-widget.js      # UI latihan interaktif: susun kode, Run, Solusi, dsb
├── data/                     # Konten 100 halaman (markdown, dalam berkas .js)
├── api/index.php              # Endpoint serverless PHP (untuk Vercel)
├── php-scripts/                # Script PHP asli yang bisa dijalankan lokal
├── vercel.json                  # Konfigurasi Vercel (Hobby/Free tier)
├── package.json                  # Node.js v20 — untuk pratinjau statis lokal
└── .github/workflows/pages.yml    # Auto-deploy ke GitHub Pages
```

---

## ▶️ Menjalankan secara lokal

### Opsi A — Pratinjau buku (statis, via Node.js v20+)
```bash
npm install
npm start
```
Buka `http://localhost:3000`. Latihan interaktif langsung berfungsi penuh — mesin PHP/SQL dimuat otomatis dari CDN saat tombol "Jalankan" pertama kali dipakai.

### Opsi B — Jalankan dengan PHP asli (untuk mencoba `/api` dan `/php-scripts`)
```bash
php -S localhost:8000
```
Buka `http://localhost:8000` untuk buku, atau
`http://localhost:8000/php-scripts/01-hello.php` untuk contoh script PHP,
atau `http://localhost:8000/api/index.php?aksi=bab` untuk API.

> Buku (`index.html`) sepenuhnya statis — ia tidak memerlukan PHP di server untuk tampil maupun untuk menjalankan latihan interaktif (php-wasm & sql.js berjalan di browser). PHP di server sungguhan (`php -S` / Apache) hanya diperlukan untuk mencoba berkas di `/php-scripts` dan `/api` sebagai skrip PHP klasik/serverless.

---

## 🌐 Deploy ke GitHub Pages (statis)

1. Push folder ini ke repository GitHub (branch `main`).
2. Buka **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/pages.yml` akan otomatis mem-build & men-deploy
   setiap kali ada push ke `main`.
4. Situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.

Karena buku ini murni statis (HTML/CSS/JS) — termasuk latihan interaktifnya —
GitHub Pages sudah cukup untuk menampilkan semuanya secara utuh: seluruh 100
halaman, syntax highlight, KaTeX, dan 15 latihan interaktif dengan eksekusi
kode sungguhan.

---

## ▲ Deploy ke Vercel (Free / Hobby plan)

1. Import repository ini ke [vercel.com](https://vercel.com) (akun gratis).
2. Vercel akan otomatis mendeteksi `vercel.json`:
   - Situs statis (`index.html`, `css/`, `js/`, `data/`) disajikan langsung.
   - `api/index.php` dijalankan sebagai **Serverless Function** memakai
     runtime komunitas [`vercel-php`](https://github.com/juicyfx/vercel-php),
     kompatibel dengan paket **Hobby (gratis)**.
3. Setelah deploy, coba:
   - `https://<project>.vercel.app/` — buku (termasuk seluruh latihan interaktif)
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

### Cara memakai Latihan Interaktif (15 halaman flagship)

1. Klik potongan kode di "bank kode" untuk menyusunnya ke posisi yang benar.
2. Isi kotak teks pada baris yang sengaja dikosongkan.
3. Tekan **▶ Jalankan** — kode benar-benar dieksekusi lewat php-wasm/sql.js.
4. Bandingkan hasilnya dengan tombol **Hasil yang Diharapkan**, atau buka **Solusi** jika buntu.
5. Jika hasil kodemu sudah sesuai, kotak pop-up "Benar! 🎉" akan muncul otomatis.
6. Tombol **↺ Atur Ulang** mengembalikan latihan ke kondisi awal (teracak ulang).

Halaman latihan interaktif: **51–58** (pemantapan dasar: variabel, operator,
loop, string/array, fungsi, OOP, dua studi kasus), **61–65** (SQL: SELECT,
INSERT, UPDATE/DELETE, JOIN, GROUP BY), **83** (routing), dan **99** (proyek
akhir). Halaman lain tetap menampilkan kode & output sebagai referensi statis
yang sudah diberi syntax highlight.

---

## 📜 Lisensi

Kode & contoh di proyek ini bebas dipakai untuk belajar, mengajar, atau
dikembangkan lebih lanjut (lisensi MIT).
