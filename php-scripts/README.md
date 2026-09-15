# Contoh Script PHP — XayzEduPhp

Folder ini berisi **script PHP asli yang bisa langsung dijalankan**,
mendampingi contoh kode yang ada di dalam buku interaktif (`index.html`).

## Cara menjalankan

1. Pastikan PHP terpasang di komputer (`php -v`).
2. Jalankan server bawaan PHP dari dalam folder ini:
   ```bash
   php -S localhost:8000
   ```
3. Buka salah satu berkas di browser, contoh:
   `http://localhost:8000/01-hello.php`

## Daftar script

| Berkas | Topik |
|---|---|
| `01-hello.php` | Syntax dasar & echo |
| `02-variabel-tipe-data.php` | Variabel, tipe data, konstanta |
| `03-array.php` | Array indeks, asosiatif, fungsi array |
| `04-fungsi.php` | Fungsi, closure, arrow function |
| `05-oop.php` | Class, inheritance, interface |
| `06-form.html` + `06-form-handling.php` | Menangani form GET/POST |
| `07-pdo-koneksi.php` | Koneksi & query database dengan PDO |
| `08-keamanan.php` | Hashing password & escaping XSS |
| `09-proyek-akhir-todo.php` | Proyek Akhir — Mini REST API Todo-List lengkap (SQLite, CRUD via HTTP) |

> Catatan: `07-pdo-koneksi.php` memerlukan server MySQL aktif dan
> menyesuaikan kredensial pada baris `$host/$db/$user/$pass`. Script
> lain berjalan mandiri tanpa dependensi tambahan.
