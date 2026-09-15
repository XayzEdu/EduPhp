window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:91, part:"Bagian XII — Web Modern & API",
  title:"Error Handling & Logging Terstruktur",
  md:`Aplikasi produksi butuh penanganan error yang rapi — bukan sekadar menampilkan pesan error mentah PHP ke pengguna (yang bisa membocorkan detail sistem), melainkan mencatatnya untuk developer dan menampilkan pesan ramah untuk pengguna.

\`\`\`php title=error-handler.php
<?php
class ErrorLogger {
    public function __construct(private string $fileLog) {}

    public function catat(\\Throwable $e): void {
        $baris = sprintf(
            "[%s] %s: %s di %s:%d\\n",
            date('Y-m-d H:i:s'),
            get_class($e),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine()
        );
        file_put_contents($this->fileLog, $baris, FILE_APPEND);
    }
}

$logger = new ErrorLogger(__DIR__ . '/error.log');

set_exception_handler(function (\\Throwable $e) use ($logger) {
    $logger->catat($e);
    http_response_code(500);
    echo json_encode([
        'status' => 'gagal',
        'pesan'  => 'Terjadi kesalahan pada server. Tim kami sudah diberi tahu.',
    ]);
});

// Simulasi error tak terduga
function ambilDataProduk(int $id) {
    if ($id <= 0) {
        throw new InvalidArgumentException("ID produk tidak valid: $id");
    }
    // ...
}
ambilDataProduk(-5);
\`\`\`

\`\`\`output
Respons ke pengguna:
{"status":"gagal","pesan":"Terjadi kesalahan pada server. Tim kami sudah diberi tahu."}

Isi error.log (hanya developer yang melihat):
[2026-09-15 10:22:41] InvalidArgumentException: ID produk tidak valid: -5 di /app/index.php:29
\`\`\`

Prinsip penting penanganan error di produksi:

- **Jangan** tampilkan pesan error PHP mentah (\`display_errors\`) ke pengguna — matikan di produksi, aktifkan hanya di lingkungan development.
- **Selalu** catat detail lengkap error ke log untuk keperluan debugging developer.
- Tampilkan pesan **generik dan ramah** ke pengguna, tanpa membocorkan struktur internal aplikasi.

> [!TIP] Untuk aplikasi produksi skala menengah-besar, pertimbangkan layanan pemantauan error seperti Sentry — otomatis mengelompokkan error serupa, memberi notifikasi real-time, dan menyimpan konteks lengkap tiap kejadian error.`
},
{
  id:92, part:"Bagian XII — Web Modern & API",
  title:"Mengonsumsi API Eksternal dengan cURL",
  md:`Selain **menyediakan** API (Bab 85), aplikasi PHP sering perlu **memanggil** API pihak ketiga — misalnya API cuaca, API pembayaran, atau API peta. Ekstensi **cURL** adalah cara standar PHP melakukan ini.

\`\`\`php title=curl-get.php
<?php
function ambilData(string $url): array {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new RuntimeException("Request gagal dengan kode: $httpCode");
    }
    return json_decode($response, true);
}

$data = ambilData('https://api.contoh.com/cuaca?kota=Bandung');
echo "Suhu di {$data['kota']}: {$data['suhu']}°C";
\`\`\`

\`\`\`output
Suhu di Bandung: 24°C
\`\`\`

Untuk mengirim data (misalnya \`POST\` ke API pembayaran), sertakan method dan body:

\`\`\`php title=curl-post.php
<?php
function kirimData(string $url, array $data, string $apiKey): array {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "Authorization: Bearer $apiKey",
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

$hasil = kirimData('https://api.pembayaran.com/charge', [
    'jumlah' => 150000,
    'mata_uang' => 'IDR',
], 'sk_live_xxxxx');

echo "Status pembayaran: {$hasil['status']}";
\`\`\`

\`\`\`output
Status pembayaran: berhasil
\`\`\`

> [!TIP] Alternatif modern dari cURL adalah ekstensi **Guzzle** (via Composer: \`composer require guzzlehttp/guzzle\`) — API-nya lebih ekspresif dan mendukung request asinkron, sangat populer di proyek PHP modern untuk berkomunikasi dengan layanan eksternal.`
},
{
  id:93, part:"Bagian XIII — Tools & Deployment",
  title:"Composer Mendalam — Membuat Package Sendiri",
  md:`Selain memakai package orang lain, kamu juga bisa **membuat package Composer sendiri** — berguna jika ingin membagikan kode yang dipakai ulang di banyak proyek, atau bahkan mempublikasikannya untuk komunitas lewat Packagist.

\`\`\`json title=composer.json
{
  "name": "xayz/validator-sederhana",
  "description": "Package validasi input sederhana untuk belajar Composer",
  "type": "library",
  "license": "MIT",
  "autoload": {
    "psr-4": { "Xayz\\\\Validator\\\\": "src/" }
  },
  "require": {
    "php": ">=8.1"
  }
}
\`\`\`

\`\`\`php title=src/Validator.php
<?php
namespace Xayz\\Validator;

class Validator {
    private array $errors = [];

    public function required(string $field, mixed $value): self {
        if (empty($value)) {
            $this->errors[] = "$field wajib diisi";
        }
        return $this;
    }

    public function email(string $field, string $value): self {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "$field harus berupa email yang valid";
        }
        return $this;
    }

    public function isValid(): bool { return empty($this->errors); }
    public function getErrors(): array { return $this->errors; }
}
\`\`\`

\`\`\`php title=pakai-package.php
<?php
require 'vendor/autoload.php';
use Xayz\\Validator\\Validator;

$v = new Validator();
$v->required('nama', '')->email('email', 'bukan-email');

if (!$v->isValid()) {
    print_r($v->getErrors());
}
\`\`\`

\`\`\`output
Array
(
    [0] => nama wajib diisi
    [1] => email harus berupa email yang valid
)
\`\`\`

Untuk membagikan package ke publik: buat repository Git, daftarkan di [packagist.org](https://packagist.org) (gratis), lalu siapa pun bisa memasangnya dengan \`composer require xayz/validator-sederhana\` — persis seperti memasang package populer lainnya.

> [!TIP] Method \`required()\` dan \`email()\` di atas masing-masing mengembalikan \`$this\` — pola ini disebut **method chaining**, memungkinkan pemanggilan berantai seperti \`$v->required(...)->email(...)\` dalam satu ekspresi.`
},
{
  id:94, part:"Bagian XIII — Tools & Deployment",
  title:"Git Dasar untuk Proyek PHP",
  md:`**Git** adalah sistem kontrol versi yang melacak setiap perubahan kode dari waktu ke waktu — memungkinkan kolaborasi tim, riwayat perubahan, dan kemampuan "kembali" ke versi sebelumnya jika terjadi kesalahan. Hampir semua proyek PHP profesional (termasuk XayzEduPhp ini) memakainya.

\`\`\`bash title=terminal
# Memulai repository Git baru di folder proyek
git init

# Menyimpan perubahan (staging area)
git add index.php css/style.css

# Mencatat perubahan sebagai satu "commit" berlabel
git commit -m "Tambah fitur validasi form"

# Menghubungkan ke repository di GitHub
git remote add origin https://github.com/username/proyek-php.git

# Mengunggah commit ke GitHub
git push -u origin main
\`\`\`

\`\`\`output
[main a1b2c3d] Tambah fitur validasi form
 2 files changed, 15 insertions(+), 2 deletions(-)
\`\`\`

Alur kerja Git sehari-hari untuk fitur baru:

\`\`\`bash title=terminal
git checkout -b fitur/keranjang-belanja   # buat branch baru untuk fitur ini
# ...tulis kode...
git add .
git commit -m "Tambah keranjang belanja"
git push origin fitur/keranjang-belanja
# ...buka Pull Request di GitHub untuk digabung ke main...
\`\`\`

Perintah Git yang paling sering dipakai:

| Perintah | Kegunaan |
|---|---|
| \`git status\` | melihat berkas apa saja yang berubah |
| \`git diff\` | melihat detail perubahan baris kode |
| \`git log\` | melihat riwayat commit |
| \`git branch\` | melihat/membuat cabang pengembangan terpisah |
| \`git pull\` | mengambil perubahan terbaru dari remote |

> [!TIP] Berkas \`.gitignore\` (sudah ada di proyek XayzEduPhp ini) memberi tahu Git berkas/folder mana yang **tidak** perlu dilacak — seperti \`node_modules/\`, berkas \`.env\` berisi kredensial, atau cache sementara.`
},
{
  id:95, part:"Bagian XIII — Tools & Deployment",
  title:"Docker untuk Aplikasi PHP",
  md:`**Docker** mengemas aplikasi beserta seluruh lingkungannya (versi PHP, ekstensi, dependensi sistem) ke dalam sebuah **container** — memastikan aplikasi berjalan identik di laptop developer, server staging, maupun produksi, menghindari masalah klasik "kok di komputer saya jalan?".

\`\`\`output title=Dockerfile
FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
\`\`\`

\`\`\`output title=docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:80"
    volumes:
      - .:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: toko_online
      MYSQL_ROOT_PASSWORD: rahasia
    ports:
      - "3306:3306"
\`\`\`

\`\`\`bash title=terminal
# Membangun & menjalankan seluruh stack (PHP + MySQL) sekaligus
docker-compose up -d

# Melihat log aplikasi
docker-compose logs -f app
\`\`\`

\`\`\`output
✔ Container proyek-db-1   Started
✔ Container proyek-app-1  Started
Aplikasi berjalan di http://localhost:8080
\`\`\`

Manfaat utama Docker untuk proyek PHP:

- **Konsistensi lingkungan** — semua anggota tim memakai versi PHP & ekstensi yang identik.
- **Setup cepat** — anggota tim baru cukup jalankan satu perintah (\`docker-compose up\`), tanpa instalasi manual PHP/MySQL di komputernya.
- **Isolasi** — beberapa proyek dengan versi PHP berbeda bisa berjalan berdampingan tanpa konflik.

> [!TIP] Untuk deployment sederhana yang sudah dibahas di proyek ini (GitHub Pages & Vercel), Docker **tidak diperlukan** — keduanya menangani environment secara otomatis. Docker lebih relevan saat kamu mengelola server sendiri (VPS) atau lingkungan tim yang kompleks.`
},
{
  id:96, part:"Bagian XIII — Tools & Deployment",
  title:"Debugging dengan Xdebug — Konsep Dasar",
  md:`Selama ini kita debugging dengan \`var_dump()\` dan \`echo\` — cukup untuk kasus sederhana, tapi merepotkan untuk bug kompleks. **Xdebug** adalah ekstensi PHP yang memungkinkan **step debugging**: menjalankan kode baris demi baris, memeriksa nilai variabel secara langsung, tanpa menambah/menghapus \`echo\` berulang kali.

\`\`\`bash title=terminal
# Memasang Xdebug lewat PECL
pecl install xdebug
\`\`\`

\`\`\`output title=php.ini
[xdebug]
zend_extension=xdebug
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
\`\`\`

Dengan Xdebug aktif dan terhubung ke editor (VS Code, PhpStorm, dll), kamu bisa memasang **breakpoint** — titik di mana eksekusi kode akan **berhenti sementara**, memungkinkanmu memeriksa nilai setiap variabel pada momen itu:

\`\`\`output
1  function hitungTotal(array $keranjang): float {
2      $total = 0;
3 🔴    foreach ($keranjang as $item) {      <- breakpoint di sini
4          $total += $item['harga'] * $item['qty'];
5      }
6      return $total;
7  }

Saat breakpoint tercapai, editor menampilkan:
  $keranjang = [["nama"=>"Buku","harga"=>25000,"qty"=>2], ...]
  $total = 0
  $item  = (belum terdefinisi, loop belum masuk iterasi pertama)
\`\`\`

Fitur utama yang didapat dari step debugging:

| Fitur | Kegunaan |
|---|---|
| **Breakpoint** | menghentikan eksekusi di baris tertentu |
| **Step over/into** | menjalankan kode satu baris/satu fungsi pada satu waktu |
| **Watch variable** | memantau nilai variabel tertentu berubah sepanjang eksekusi |
| **Call stack** | melihat urutan pemanggilan fungsi yang membawa ke titik saat ini |

> [!TIP] Xdebug juga bisa menghasilkan **profiling** — laporan detail bagian kode mana yang paling banyak memakan waktu eksekusi, sangat berguna saat mengoptimasi performa (dibahas di halaman berikutnya).`
},
{
  id:97, part:"Bagian XIII — Tools & Deployment",
  title:"Deploy ke Produksi — Checklist & Praktik Baik",
  md:`Sebelum aplikasi PHP-mu diakses publik, ada sejumlah hal penting yang perlu dipastikan. Berikut checklist praktis sebelum (dan sesudah) deploy ke produksi.

**Sebelum deploy:**

- [ ] Matikan \`display_errors\` di \`php.ini\` produksi (\`display_errors = Off\`) — jangan bocorkan detail error ke pengguna (Bab 91).
- [ ] Pastikan semua kredensial ada di \`.env\`, **bukan** ter-hardcode di kode (Bab 90).
- [ ] Jalankan seluruh test PHPUnit (Bab 82) — pastikan semuanya lulus (\`OK\`).
- [ ] Periksa seluruh input pengguna sudah divalidasi dan di-escape (Bab 35, 48).
- [ ] Pastikan koneksi database memakai prepared statement di **semua** query (Bab 47–48).
- [ ] Aktifkan HTTPS (sertifikat SSL) — jangan biarkan trafik login/data sensitif lewat HTTP biasa.

**Konfigurasi produksi vs development:**

\`\`\`output title=php.ini (development)
display_errors = On
error_reporting = E_ALL
\`\`\`

\`\`\`output title=php.ini (produksi)
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
\`\`\`

**Setelah deploy:**

- [ ] Uji seluruh alur penting (login, checkout, submit form) langsung di lingkungan produksi.
- [ ] Pantau log error selama beberapa jam pertama setelah rilis.
- [ ] Siapkan **backup database** otomatis dan terjadwal.
- [ ] Dokumentasikan proses rollback jika terjadi masalah serius.

> [!WARN] Kesalahan paling umum yang menyebabkan insiden keamanan bukan karena kurangnya pengetahuan, melainkan **checklist yang terlewat** saat terburu-buru merilis fitur — jadikan checklist ini kebiasaan rutin, bukan langkah opsional.`
},
{
  id:98, part:"Bagian XIII — Tools & Deployment",
  title:"Optimasi Performa PHP",
  md:`Aplikasi yang lambat membuat pengguna frustrasi dan mesin pencari menurunkan peringkat SEO-nya. Berikut teknik optimasi performa PHP yang paling berdampak, diurutkan dari yang paling mudah diterapkan.

**1. Optimasi query database** — biasanya penyebab kelambatan terbesar.

\`\`\`php title=n-plus-1-problem.php
<?php
// LAMBAT — disebut "masalah N+1": 1 query awal + N query tambahan
$pesanan = $pdo->query("SELECT * FROM pesanan")->fetchAll();
foreach ($pesanan as $p) {
    $stmt = $pdo->prepare("SELECT nama FROM pelanggan WHERE id = ?");
    $stmt->execute([$p['pelanggan_id']]);
    // ...1 query per baris pesanan!
}

// CEPAT — gabungkan jadi satu query dengan JOIN
$pesanan = $pdo->query("
    SELECT pesanan.*, pelanggan.nama AS nama_pelanggan
    FROM pesanan
    JOIN pelanggan ON pesanan.pelanggan_id = pelanggan.id
")->fetchAll();
\`\`\`

**2. Manfaatkan caching** (Bab 89) untuk data yang jarang berubah tapi sering dibaca.

**3. Aktifkan OPcache** — menyimpan kode PHP yang sudah dikompilasi di memori, menghindari kompilasi ulang di setiap request.

\`\`\`output title=php.ini
[opcache]
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
\`\`\`

**4. Hindari memuat data yang tidak perlu** — gunakan \`LIMIT\`, pilih hanya kolom yang dibutuhkan (\`SELECT nama, harga\` alih-alih \`SELECT *\`).

**5. Ukur sebelum mengoptimasi** — jangan menebak-nebak bagian mana yang lambat.

\`\`\`php title=ukur-waktu.php
<?php
$mulai = microtime(true);

$hasil = queryYangMauDiukur();

$durasi = (microtime(true) - $mulai) * 1000;
echo "Query selesai dalam " . round($durasi, 2) . " ms";
\`\`\`

\`\`\`output
Query selesai dalam 142.37 ms
\`\`\`

> [!TIP] Prinsip klasik optimasi: *"Premature optimization is the root of all evil"* — jangan mengoptimasi bagian kode yang belum terbukti lambat. Ukur dulu (profiling, lihat Bab 96), baru optimasi bagian yang benar-benar jadi bottleneck.`
},
{
  id:99, part:"Bagian XIV — Proyek Akhir",
  title:"Proyek Akhir: Mini REST API Todo-List End-to-End",
  md:`Saatnya menyatukan **hampir semua** yang telah dipelajari di seluruh buku ini — routing, database, validasi, JSON, penanganan error — menjadi satu Mini REST API Todo-List yang utuh.

\`\`\`php title=api/todos.php
<?php
header('Content-Type: application/json');
$pdo = new PDO('sqlite:' . __DIR__ . '/todos.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    selesai INTEGER DEFAULT 0
)");

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

match ($method) {
    'GET' => (function() use ($pdo) {
        $data = $pdo->query("SELECT * FROM todos ORDER BY id DESC")->fetchAll();
        echo json_encode(['status' => 'sukses', 'data' => $data]);
    })(),
    'POST' => (function() use ($pdo, $body) {
        if (empty($body['judul'])) {
            http_response_code(400);
            echo json_encode(['status' => 'gagal', 'pesan' => 'Judul wajib diisi']);
            return;
        }
        $stmt = $pdo->prepare("INSERT INTO todos (judul) VALUES (?)");
        $stmt->execute([$body['judul']]);
        http_response_code(201);
        echo json_encode(['status' => 'sukses', 'id' => $pdo->lastInsertId()]);
    })(),
    default => (function() {
        http_response_code(405);
        echo json_encode(['status' => 'gagal', 'pesan' => 'Method tidak didukung']);
    })(),
};
\`\`\`

Ini adalah endpoint yang **berjalan sungguhan** — silakan lihat berkas nyatanya di folder \`php-scripts/09-proyek-akhir-todo.php\` pada paket unduhan buku ini, lengkap dengan operasi \`selesaikan\` dan \`hapus\`.

Latihan interaktif di bawah adalah versi ringkas dari logika intinya: menghitung berapa banyak tugas yang **belum selesai** dari sebuah daftar todo, memakai \`array_filter()\` — pola yang persis dipakai di endpoint \`GET\` API sungguhan untuk menyaring data sebelum dikirim sebagai respons.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode berikut untuk menghitung jumlah tugas yang belum selesai dari daftar todo. Baris array_filter() dengan arrow function sengaja dikosongkan.",
    lines:[
      '$todos = [["judul"=>"Belajar PHP","selesai"=>true], ["judul"=>"Bikin API","selesai"=>false], ["judul"=>"Deploy","selesai"=>false]];',
      '$belumSelesai = array_filter($todos, fn($t) => !$t["selesai"]);',
      'echo "Tugas belum selesai: " . count($belumSelesai);'
    ],
    blankIndex:1,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Tugas belum selesai: 2"
  }
},
{
  id:100, part:"Bagian XIV — Proyek Akhir",
  title:"Penutup Jilid 2 & Roadmap Belajar Lanjutan",
  md:`Selamat — kamu telah menyelesaikan **100 halaman penuh** XayzEduPhp! Dari sintaks paling dasar di halaman pertama, hingga database, arsitektur OOP lanjutan, REST API, dan praktik deployment produksi.

**Ringkasan perjalanan 100 halaman:**

| Bagian | Cakupan | Halaman |
|---|---|---|
| I–VIII | Dasar PHP, OOP, Keamanan, API dasar | 1–50 |
| IX | Pemantapan dasar (latihan interaktif) | 51–58 |
| X | Database relasional & SQL CRUD lengkap | 59–72 |
| XI | OOP lanjutan & design pattern | 73–82 |
| XII | Web modern: routing, middleware, REST, JWT, CORS | 83–92 |
| XIII | Tools: Composer, Git, Docker, debugging, deploy | 93–98 |
| XIV | Proyek akhir & penutup | 99–100 |

**Roadmap belajar lanjutan yang disarankan:**

1. **Pelajari framework PHP modern** — Laravel (paling populer, ekosistem luas) atau Symfony (lebih formal, dipakai banyak perusahaan enterprise). Seluruh konsep di buku ini (routing, DI, repository, migration) adalah fondasi langsung dari kedua framework tersebut.
2. **Perdalam testing** — pelajari *Test-Driven Development* (TDD) dan tools seperti Pest (alternatif PHPUnit dengan sintaks lebih ekspresif).
3. **Eksplorasi arsitektur** — pelajari *Clean Architecture*, *Domain-Driven Design (DDD)* untuk aplikasi berskala besar.
4. **Perluas ke real-time** — pelajari WebSocket dengan Ratchet atau Laravel Reverb untuk fitur chat/notifikasi live.
5. **Kontribusi open source** — cara terbaik mengasah kemampuan adalah membaca dan berkontribusi ke proyek PHP sungguhan di GitHub.

\`\`\`php title=selamat-tinggal.php
<?php
$kamu = [
    "status" => "Siap",
    "bekal"  => ["Syntax Dasar", "OOP", "Database", "REST API", "Keamanan", "Deployment"],
];

echo "Selamat, {$kamu['status']} melangkah lebih jauh dengan PHP!\\n";
echo "Bekal yang sudah kamu kuasai: " . implode(", ", $kamu['bekal']);
\`\`\`

\`\`\`output
Selamat, Siap melangkah lebih jauh dengan PHP!
Bekal yang sudah kamu kuasai: Syntax Dasar, OOP, Database, REST API, Keamanan, Deployment
\`\`\`

Terima kasih telah membaca **XayzEduPhp** sampai halaman terakhir jilid ini. Teruslah membangun, teruslah bereksperimen — dan sampai jumpa di proyekmu berikutnya! 🐘✨`
}
);
