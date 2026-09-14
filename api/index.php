<?php
/**
 * XayzEduPhp — API Serverless (Vercel)
 * -------------------------------------------------------------
 * Endpoint ini adalah contoh nyata PHP yang benar-benar dieksekusi
 * di server (bukan sekadar ditampilkan sebagai teks di buku).
 *
 * Jalan di:
 *   - Vercel (Serverless Function, lihat /vercel.json)
 *   - Server PHP lokal manapun: `php -S localhost:8000` lalu buka
 *     http://localhost:8000/api/index.php
 *
 * Contoh pemakaian:
 *   GET /api/index.php            -> info API
 *   GET /api/index.php?aksi=bab   -> daftar bab buku
 *   GET /api/index.php?aksi=hitung&a=4&b=6 -> kalkulator sederhana
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$aksi = $_GET['aksi'] ?? 'info';

$babBuku = [
    ['id' => 1,  'judul' => 'Sejarah Singkat PHP'],
    ['id' => 6,  'judul' => 'Variabel di PHP'],
    ['id' => 15, 'judul' => 'Array Terindeks'],
    ['id' => 27, 'judul' => 'Fungsi Dasar'],
    ['id' => 40, 'judul' => 'Class & Object'],
    ['id' => 47, 'judul' => 'PHP + MySQL dengan PDO'],
    ['id' => 48, 'judul' => 'Keamanan PHP'],
    ['id' => 50, 'judul' => 'Best Practice & Penutup'],
];

switch ($aksi) {
    case 'bab':
        echo json_encode([
            'status' => 'sukses',
            'total_halaman' => 50,
            'contoh_bab' => $babBuku,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        break;

    case 'hitung':
        $a = filter_var($_GET['a'] ?? null, FILTER_VALIDATE_FLOAT);
        $b = filter_var($_GET['b'] ?? null, FILTER_VALIDATE_FLOAT);

        if ($a === false || $b === false || $a === null || $b === null) {
            http_response_code(400);
            echo json_encode([
                'status' => 'gagal',
                'pesan'  => 'Parameter "a" dan "b" wajib berupa angka. Contoh: ?aksi=hitung&a=4&b=6',
            ], JSON_PRETTY_PRINT);
            break;
        }

        echo json_encode([
            'status' => 'sukses',
            'input'  => ['a' => $a, 'b' => $b],
            'hasil'  => [
                'tambah' => $a + $b,
                'kurang' => $a - $b,
                'kali'   => $a * $b,
                'bagi'   => $b != 0 ? $a / $b : null,
            ],
        ], JSON_PRETTY_PRINT);
        break;

    default:
        echo json_encode([
            'status'  => 'sukses',
            'pesan'   => 'Selamat datang di API XayzEduPhp — dijalankan dengan PHP ' . PHP_VERSION,
            'waktu_server' => date('Y-m-d H:i:s'),
            'endpoint_tersedia' => [
                '/api/index.php?aksi=info',
                '/api/index.php?aksi=bab',
                '/api/index.php?aksi=hitung&a=4&b=6',
            ],
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
