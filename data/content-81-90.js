window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:81, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Composer & PSR-4 Lanjutan",
  md:`Bab 46 memperkenalkan autoloading dasar lewat Composer. Mari perdalam bagaimana **PSR-4** (standar penamaan namespace-ke-folder) bekerja di proyek nyata dengan struktur lebih kompleks.

\`\`\`json title=composer.json
{
  "name": "xayz/toko-online",
  "autoload": {
    "psr-4": {
      "App\\\\": "src/",
      "Tests\\\\": "tests/"
    }
  },
  "require": {
    "php": ">=8.1"
  }
}
\`\`\`

Dengan konfigurasi di atas, struktur folder berikut otomatis "terpetakan":

\`\`\`output
src/
├── Model/Produk.php        -> namespace App\\Model;      class Produk
├── Repository/ProdukRepository.php  -> namespace App\\Repository; class ProdukRepository
└── Service/LayananPesanan.php       -> namespace App\\Service;    class LayananPesanan
tests/
└── ProdukTest.php           -> namespace Tests;          class ProdukTest
\`\`\`

Aturan PSR-4: **path folder setelah prefix namespace harus identik dengan struktur namespace class-nya**. Class \`App\\Repository\\ProdukRepository\` harus berada persis di \`src/Repository/ProdukRepository.php\`.

\`\`\`php title=index.php
<?php
require 'vendor/autoload.php';

use App\\Repository\\ProdukRepository;
use App\\Service\\LayananPesanan;

$repo = new ProdukRepository($pdo);
$layanan = new LayananPesanan($pdo, $repo);
\`\`\`

Setelah mengubah \`composer.json\`, jalankan \`composer dump-autoload\` agar Composer membaca ulang pemetaan namespace-ke-folder terbaru.

> [!TIP] Selain \`require\`, Composer juga mengelola **dependensi pihak ketiga** (library dari luar proyekmu) lewat \`composer require nama/paket\` — seluruh library tersebut otomatis ikut ter-autoload lewat \`vendor/autoload.php\` yang sama.`
},
{
  id:82, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Unit Testing dengan PHPUnit",
  md:`**Unit testing** memverifikasi potongan kode kecil (biasanya satu fungsi/method) bekerja sesuai harapan — secara otomatis, tanpa perlu mengetes manual lewat browser setiap kali ada perubahan kode. **PHPUnit** adalah framework testing paling populer di ekosistem PHP.

\`\`\`php title=tests/KalkulatorTest.php
<?php
namespace Tests;

use PHPUnit\\Framework\\TestCase;
use App\\Kalkulator;

class KalkulatorTest extends TestCase {
    public function test_penjumlahan_dua_angka(): void {
        $kalkulator = new Kalkulator();
        $hasil = $kalkulator->tambah(4, 6);

        $this->assertEquals(10, $hasil);
    }

    public function test_pembagian_dengan_nol_melempar_exception(): void {
        $kalkulator = new Kalkulator();

        $this->expectException(DivisionByZeroError::class);
        $kalkulator->bagi(10, 0);
    }
}
\`\`\`

\`\`\`bash title=terminal
./vendor/bin/phpunit tests/KalkulatorTest.php
\`\`\`

\`\`\`output
PHPUnit 10.5.0

..                                                                 2 / 2 (100%)

Time: 00:00.012, Memory: 6.00 MB

OK (2 tests, 2 assertions)
\`\`\`

Method assert yang paling sering dipakai:

| Method | Memeriksa |
|---|---|
| \`assertEquals($a, $b)\` | \`$a\` dan \`$b\` bernilai sama |
| \`assertTrue()\` / \`assertFalse()\` | ekspresi bernilai true/false |
| \`assertCount($n, $array)\` | array punya tepat \`$n\` elemen |
| \`expectException(Kelas::class)\` | kode diharapkan melempar exception tertentu |

> [!TIP] Konvensi penamaan: nama method test biasanya diawali \`test_\` dan menjelaskan **apa** yang diuji dalam bahasa natural (\`test_pembagian_dengan_nol_melempar_exception\`) — ini membuat laporan hasil test mudah dibaca bahkan oleh orang yang belum melihat kodenya.`
},
{
  id:83, part:"Bagian XII — Web Modern & API",
  title:"Routing Sederhana — Membangun Router Mini",
  md:`**Router** memetakan URL yang diminta pengguna ke bagian kode yang harus dijalankan — komponen inti di balik semua framework web PHP (Laravel, Symfony, dll). Mari bangun versi sederhananya sendiri untuk memahami cara kerjanya.

\`\`\`php title=router.php
<?php
class Router {
    private array $routes = [];

    public function get(string $path, callable $handler): void {
        $this->routes['GET'][$path] = $handler;
    }

    public function jalankan(string $method, string $path): void {
        $handler = $this->routes[$method][$path] ?? null;
        if ($handler) {
            echo $handler();
        } else {
            http_response_code(404);
            echo "404 - Halaman tidak ditemukan";
        }
    }
}

$router = new Router();
$router->get('/', fn() => "Selamat datang di Beranda!");
$router->get('/tentang', fn() => "Ini halaman Tentang Kami.");

$router->jalankan('GET', '/tentang');
\`\`\`

\`\`\`output
Ini halaman Tentang Kami.
\`\`\`

Latihan di bawah: praktikkan konsep routing dengan array asosiatif sederhana — susun ulang kode yang mencocokkan URL dengan nama halamannya, mirip logika inti \`Router\` di atas.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode routing sederhana berikut agar URL '/tentang' menampilkan halaman yang benar. Baris pencarian rute (pakai null coalescing ??) sengaja dikosongkan.",
    lines:[
      '$routes = ["/" => "Beranda", "/tentang" => "Tentang Kami", "/kontak" => "Kontak"];',
      '$url = "/tentang";',
      '$halaman = $routes[$url] ?? "404 Not Found";',
      'echo $halaman;'
    ],
    blankIndex:2,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Tentang Kami"
  }
},
{
  id:84, part:"Bagian XII — Web Modern & API",
  title:"Middleware — Konsep & Implementasi Sederhana",
  md:`**Middleware** adalah lapisan kode yang dijalankan **sebelum** (atau sesudah) request sampai ke tujuan akhirnya — dipakai untuk hal-hal yang berlaku di banyak rute sekaligus, seperti autentikasi, logging, atau validasi.

\`\`\`php title=middleware.php
<?php
class MiddlewarePipeline {
    private array $middlewares = [];

    public function tambah(callable $middleware): self {
        $this->middlewares[] = $middleware;
        return $this;
    }

    public function jalankan(array $request, callable $tujuanAkhir): mixed {
        $pipeline = array_reduce(
            array_reverse($this->middlewares),
            fn($next, $middleware) => fn($req) => $middleware($req, $next),
            $tujuanAkhir
        );
        return $pipeline($request);
    }
}

$cekLogin = function(array $req, callable $next) {
    echo "[Middleware] Memeriksa login...\\n";
    if (!($req['sudah_login'] ?? false)) {
        return "Ditolak: silakan login dulu.";
    }
    return $next($req);
};

$logRequest = function(array $req, callable $next) {
    echo "[Middleware] Mencatat request ke: {$req['path']}\\n";
    return $next($req);
};

$pipeline = new MiddlewarePipeline();
$pipeline->tambah($logRequest)->tambah($cekLogin);

$hasil = $pipeline->jalankan(
    ['path' => '/dashboard', 'sudah_login' => true],
    fn($req) => "Selamat datang di Dashboard!"
);
echo $hasil;
\`\`\`

\`\`\`output
[Middleware] Mencatat request ke: /dashboard
[Middleware] Memeriksa login...
Selamat datang di Dashboard!
\`\`\`

Analogi sederhana: middleware seperti **pos pemeriksaan berlapis** sebelum sampai ke tujuan — setiap lapisan bisa meneruskan request ke lapisan berikutnya (\`$next($req)\`), atau menghentikannya lebih awal (seperti \`$cekLogin\` yang menolak jika belum login).

> [!TIP] Middleware paling umum dipakai untuk: autentikasi & otorisasi, logging request, validasi input, rate limiting (Bab 88), dan menambahkan header CORS (Bab 87) — semuanya adalah logika yang berlaku lintas banyak rute, bukan spesifik satu halaman saja.`
},
{
  id:85, part:"Bagian XII — Web Modern & API",
  title:"RESTful API CRUD Lengkap (Studi Kasus)",
  md:`Mari satukan routing, middleware, dan database menjadi satu **REST API CRUD lengkap** untuk entitas "produk" — pola yang akan kamu jumpai di hampir semua backend PHP modern.

\`\`\`php title=api/produk.php
<?php
header('Content-Type: application/json');
$pdo = new PDO('sqlite:toko.db');
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

match (true) {
    $method === 'GET' && $id === null => tampilkanSemua($pdo),
    $method === 'GET' && $id !== null => tampilkanSatu($pdo, (int) $id),
    $method === 'POST'   => buatProduk($pdo),
    $method === 'PUT'    => updateProduk($pdo, (int) $id),
    $method === 'DELETE' => hapusProduk($pdo, (int) $id),
    default => kirimError(405, 'Method tidak didukung'),
};

function tampilkanSemua(PDO $pdo): void {
    $data = $pdo->query("SELECT * FROM produk")->fetchAll();
    echo json_encode(['status' => 'sukses', 'data' => $data]);
}

function tampilkanSatu(PDO $pdo, int $id): void {
    $stmt = $pdo->prepare("SELECT * FROM produk WHERE id = ?");
    $stmt->execute([$id]);
    $data = $stmt->fetch();
    $data ? print(json_encode(['status'=>'sukses','data'=>$data]))
          : kirimError(404, 'Produk tidak ditemukan');
}

function buatProduk(PDO $pdo): void {
    $body = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO produk (nama, harga) VALUES (?, ?)");
    $stmt->execute([$body['nama'], $body['harga']]);
    http_response_code(201);
    echo json_encode(['status' => 'sukses', 'id' => $pdo->lastInsertId()]);
}

function kirimError(int $kode, string $pesan): void {
    http_response_code($kode);
    echo json_encode(['status' => 'gagal', 'pesan' => $pesan]);
}
\`\`\`

\`\`\`output
GET  /api/produk.php         -> {"status":"sukses","data":[...]}
GET  /api/produk.php?id=3    -> {"status":"sukses","data":{...}}
POST /api/produk.php         -> {"status":"sukses","id":"7"}
\`\`\`

Struktur ini memetakan **method HTTP** ke **operasi CRUD** secara langsung — konvensi yang disebut arsitektur **RESTful**:

| Method HTTP | Operasi CRUD | Contoh URL |
|---|---|---|
| \`GET\` | Read | \`/api/produk.php\` atau \`/api/produk.php?id=3\` |
| \`POST\` | Create | \`/api/produk.php\` (data di body) |
| \`PUT\` | Update | \`/api/produk.php?id=3\` (data di body) |
| \`DELETE\` | Delete | \`/api/produk.php?id=3\` |

Berkas \`api/index.php\` pada proyek XayzEduPhp ini (lihat folder \`api/\`) adalah contoh nyata dari pola ini yang sudah siap dijalankan sebagai fungsi serverless di Vercel.`
},
{
  id:86, part:"Bagian XII — Web Modern & API",
  title:"Autentikasi Token (JWT) — Konsep & Implementasi Dasar",
  md:`Untuk API yang diakses aplikasi mobile atau frontend terpisah (bukan form HTML biasa), autentikasi berbasis **session/cookie** kurang cocok. Solusi umum: **JWT** (*JSON Web Token*) — token berisi data pengguna yang ditandatangani secara digital, dikirim di setiap request.

Struktur JWT terdiri dari tiga bagian dipisah titik: \`header.payload.signature\`.

\`\`\`php title=jwt-sederhana.php
<?php
function buatJwt(array $payload, string $secret): string {
    $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payloadEncoded = base64UrlEncode(json_encode($payload));

    $signature = hash_hmac('sha256', "$header.$payloadEncoded", $secret, true);
    $signatureEncoded = base64UrlEncode($signature);

    return "$header.$payloadEncoded.$signatureEncoded";
}

function verifikasiJwt(string $token, string $secret): array|false {
    [$header, $payload, $signature] = explode('.', $token);

    $signatureValid = base64UrlEncode(
        hash_hmac('sha256', "$header.$payload", $secret, true)
    );

    if (!hash_equals($signatureValid, $signature)) {
        return false; // token dipalsukan atau rusak
    }
    return json_decode(base64UrlDecode($payload), true);
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

$secret = "kunci-rahasia-super-aman";
$token = buatJwt(['user_id' => 42, 'peran' => 'admin'], $secret);
echo "Token: $token\\n";

$data = verifikasiJwt($token, $secret);
echo "User ID dari token: {$data['user_id']}";
\`\`\`

\`\`\`output
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MiwicGVyYW4iOiJhZG1pbiJ9.4S9q0m...
User ID dari token: 42
\`\`\`

Alur pemakaian JWT untuk API:

\`\`\`output
1. Pengguna login (kirim email+password) -> server verifikasi -> buat JWT -> kirim ke klien
2. Klien simpan token, sertakan di header setiap request:
     Authorization: Bearer eyJhbGciOi...
3. Server verifikasi signature token di setiap request -> jika valid, izinkan akses
\`\`\`

> [!WARN] Contoh di atas untuk **tujuan pembelajaran** dan menyederhanakan banyak detail. Untuk produksi, gunakan library JWT teruji seperti \`firebase/php-jwt\` (via Composer) yang sudah menangani berbagai celah keamanan dan edge case dengan benar.`
},
{
  id:87, part:"Bagian XII — Web Modern & API",
  title:"CORS — Mengizinkan Akses Lintas Domain",
  md:`**CORS** (*Cross-Origin Resource Sharing*) adalah mekanisme keamanan browser yang **secara default memblokir** permintaan JavaScript dari satu domain ke API di domain lain. Jika frontend-mu (misalnya \`app.contoh.com\`) perlu mengakses API di domain berbeda (\`api.contoh.com\`), server API harus **mengizinkannya secara eksplisit** lewat header HTTP.

\`\`\`php title=cors.php
<?php
// Izinkan akses dari domain tertentu
header('Access-Control-Allow-Origin: https://app.contoh.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Browser mengirim request "preflight" OPTIONS sebelum request sungguhan
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');
echo json_encode(['status' => 'sukses', 'pesan' => 'Akses CORS berhasil!']);
\`\`\`

\`\`\`output
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.contoh.com
Content-Type: application/json

{"status":"sukses","pesan":"Akses CORS berhasil!"}
\`\`\`

Header CORS yang penting:

| Header | Kegunaan |
|---|---|
| \`Access-Control-Allow-Origin\` | domain mana saja yang diizinkan mengakses |
| \`Access-Control-Allow-Methods\` | method HTTP apa saja yang diizinkan |
| \`Access-Control-Allow-Headers\` | header kustom apa saja yang boleh dikirim klien |

> [!WARN] Menyetel \`Access-Control-Allow-Origin: *\` (mengizinkan **semua** domain) memang praktis untuk API publik tanpa data sensitif, tapi **hindari** untuk API yang menangani data pengguna atau autentikasi — batasi hanya ke domain frontend yang benar-benar kamu percayai.`
},
{
  id:88, part:"Bagian XII — Web Modern & API",
  title:"Rate Limiting — Konsep & Implementasi Sederhana",
  md:`**Rate limiting** membatasi berapa kali seorang pengguna/IP boleh mengakses API dalam periode waktu tertentu — melindungi server dari penyalahgunaan (spam, brute-force login, atau bot yang menghajar API terus-menerus).

\`\`\`php title=rate-limiter.php
<?php
class RateLimiter {
    public function __construct(
        private string $direktoriPenyimpanan,
        private int $batasRequest = 5,
        private int $periodeDetik = 60,
    ) {}

    public function izinkan(string $identitas): bool {
        $file = "{$this->direktoriPenyimpanan}/" . md5($identitas) . ".json";
        $sekarang = time();

        $data = file_exists($file)
            ? json_decode(file_get_contents($file), true)
            : ['mulai' => $sekarang, 'jumlah' => 0];

        // reset jika periode sudah lewat
        if ($sekarang - $data['mulai'] > $this->periodeDetik) {
            $data = ['mulai' => $sekarang, 'jumlah' => 0];
        }

        $data['jumlah']++;
        file_put_contents($file, json_encode($data));

        return $data['jumlah'] <= $this->batasRequest;
    }
}

$limiter = new RateLimiter(__DIR__ . '/cache', batasRequest: 5, periodeDetik: 60);
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

if (!$limiter->izinkan($ip)) {
    http_response_code(429);
    die(json_encode(['status' => 'gagal', 'pesan' => 'Terlalu banyak permintaan, coba lagi nanti.']));
}

echo json_encode(['status' => 'sukses']);
\`\`\`

\`\`\`output
Request ke-1 sampai ke-5 dalam 60 detik -> 200 OK
Request ke-6 dalam periode yang sama    -> 429 Too Many Requests
\`\`\`

Kode status HTTP \`429 Too Many Requests\` adalah standar untuk memberi tahu klien bahwa mereka melebihi batas — biasanya disertai header \`Retry-After\` yang memberi tahu berapa detik lagi harus menunggu.

> [!TIP] Implementasi di atas memakai berkas sebagai penyimpanan sementara agar mudah dipahami. Aplikasi produksi dengan traffic tinggi biasanya memakai **Redis** (database in-memory super cepat) untuk menyimpan penghitung rate limit, karena jauh lebih cepat daripada baca-tulis berkas.`
},
{
  id:89, part:"Bagian XII — Web Modern & API",
  title:"Caching Sederhana dengan File",
  md:`**Caching** menyimpan hasil komputasi/query yang "mahal" (butuh waktu lama) agar permintaan berikutnya bisa langsung memakai hasil yang sudah tersimpan, tanpa mengulang proses yang sama.

\`\`\`php title=cache-sederhana.php
<?php
class FileCache {
    public function __construct(private string $direktori) {
        if (!is_dir($direktori)) mkdir($direktori, 0755, true);
    }

    public function ingat(string $kunci, int $ttlDetik, callable $hitungUlang): mixed {
        $file = "{$this->direktori}/" . md5($kunci) . ".cache";

        if (file_exists($file) && (time() - filemtime($file)) < $ttlDetik) {
            echo "[cache] Mengambil dari cache untuk: $kunci\\n";
            return unserialize(file_get_contents($file));
        }

        echo "[cache] Menghitung ulang untuk: $kunci\\n";
        $hasil = $hitungUlang();
        file_put_contents($file, serialize($hasil));

        return $hasil;
    }
}

$cache = new FileCache(__DIR__ . '/cache');

$produkPopuler = $cache->ingat('produk-populer', ttlDetik: 300, hitungUlang: function() use ($pdo) {
    // query "mahal" yang tidak perlu diulang tiap request
    return $pdo->query("SELECT * FROM produk ORDER BY terjual DESC LIMIT 5")->fetchAll();
});
\`\`\`

\`\`\`output
Request pertama (dalam 5 menit pertama):
[cache] Menghitung ulang untuk: produk-populer

Request kedua (masih dalam 5 menit yang sama):
[cache] Mengambil dari cache untuk: produk-populer
\`\`\`

Konsep kunci dalam caching:

| Istilah | Arti |
|---|---|
| **TTL** (*Time To Live*) | berapa lama data cache dianggap masih valid |
| **Cache hit** | data ditemukan di cache, tidak perlu hitung ulang |
| **Cache miss** | data belum ada/kedaluwarsa di cache, harus dihitung ulang |
| **Invalidasi** | menghapus cache secara manual saat data sumbernya berubah |

> [!TIP] Sama seperti rate limiting, caching skala besar biasanya memakai **Redis** atau **Memcached** alih-alih berkas — jauh lebih cepat dan mendukung banyak server aplikasi berbagi cache yang sama secara bersamaan.`
},
{
  id:90, part:"Bagian XII — Web Modern & API",
  title:"Environment Variables (.env)",
  md:`Menulis kredensial database atau kunci API **langsung di kode** (seperti \`$pass = "rahasia123"\`) sangat berbahaya — terutama jika kode diunggah ke repository publik. **Environment variables** menyimpan konfigurasi sensitif di luar kode, biasanya lewat berkas \`.env\`.

\`\`\`output title=.env
DB_HOST=localhost
DB_NAME=toko_online
DB_USER=root
DB_PASS=rahasia_super_aman
API_KEY=sk_live_xxxxxxxxxxxx
APP_DEBUG=false
\`\`\`

\`\`\`php title=load-env.php
<?php
function muatEnv(string $path): void {
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $baris) {
        if (str_starts_with(trim($baris), '#')) continue; // lewati komentar
        [$kunci, $nilai] = explode('=', $baris, 2);
        $_ENV[trim($kunci)] = trim($nilai);
    }
}

muatEnv(__DIR__ . '/.env');

$dsn = "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']}";
$pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS']);

echo "Terhubung memakai kredensial dari .env (tidak ter-hardcode di kode)";
\`\`\`

\`\`\`output
Terhubung memakai kredensial dari .env (tidak ter-hardcode di kode)
\`\`\`

Berkas \`.env\` **wajib** ditambahkan ke \`.gitignore\` (seperti pada proyek XayzEduPhp ini) agar tidak pernah ikut ter-commit ke repository — biasanya disertakan berkas \`.env.example\` berisi struktur yang sama tanpa nilai rahasia, sebagai panduan untuk developer lain.

> [!WARN] Kredensial yang pernah ter-commit ke Git (bahkan jika sudah dihapus di commit berikutnya) **tetap tersimpan di riwayat Git** dan bisa ditemukan siapa saja yang mengakses repository. Jika ini terjadi, segera **ganti** kredensial tersebut — jangan hanya menghapusnya dari kode.

> [!TIP] Untuk proyek nyata, gunakan library seperti \`vlucas/phpdotenv\` (via Composer) alih-alih fungsi \`muatEnv()\` buatan sendiri — sudah menangani banyak edge case seperti nilai bertanda kutip, variabel bersarang, dan validasi format.`
}
);
