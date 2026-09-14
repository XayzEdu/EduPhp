window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:41, part:"Bagian VII — OOP",
  title:"Properti, Method & Konstruktor",
  md:`**Constructor** (\`__construct\`) adalah method spesial yang otomatis dipanggil saat objek dibuat dengan \`new\` — tempat ideal untuk mengisi properti awal.

\`\`\`php title=konstruktor.php
<?php
class Produk {
    public string $nama;
    public float $harga;

    public function __construct(string $nama, float $harga) {
        $this->nama = $nama;
        $this->harga = $harga;
    }

    public function hargaFinal(float $diskonPersen = 0): float {
        return $this->harga * (1 - $diskonPersen / 100);
    }
}

$laptop = new Produk("Laptop XZ", 8500000);
echo $laptop->nama . ": Rp" . number_format($laptop->hargaFinal(10));
\`\`\`

\`\`\`output
Laptop XZ: Rp7,650,000
\`\`\`

PHP 8 memperkenalkan **constructor property promotion** — menyingkat deklarasi properti + constructor jadi satu baris per parameter:

\`\`\`php title=constructor-promotion.php
<?php
class Produk {
    public function __construct(
        public string $nama,
        public float $harga,
    ) {}
}

$mouse = new Produk("Mouse Wireless", 150000);
echo "{$mouse->nama}: Rp" . number_format($mouse->harga);
\`\`\`

\`\`\`output
Mouse Wireless: Rp150,000
\`\`\`

Ada juga \`__destruct()\`, dipanggil otomatis saat objek dihancurkan (biasanya di akhir skrip) — berguna untuk membersihkan sumber daya seperti koneksi berkas atau database.`
},
{
  id:42, part:"Bagian VII — OOP",
  title:"Encapsulation (Visibility)",
  md:`**Encapsulation** membatasi akses langsung ke properti/method internal suatu objek, sehingga data hanya bisa diubah lewat cara yang terkontrol. PHP mengenal tiga tingkat *visibility*.

| Visibility | Diakses dari class sendiri | Dari subclass (turunan) | Dari luar class |
|---|---|---|---|
| \`public\` | ✅ | ✅ | ✅ |
| \`protected\` | ✅ | ✅ | ❌ |
| \`private\` | ✅ | ❌ | ❌ |

\`\`\`php title=encapsulation.php
<?php
class RekeningBank {
    private float $saldo;

    public function __construct(float $saldoAwal) {
        $this->saldo = $saldoAwal;
    }

    public function setor(float $jumlah): void {
        if ($jumlah > 0) {
            $this->saldo += $jumlah;
        }
    }

    public function tarik(float $jumlah): bool {
        if ($jumlah > $this->saldo) {
            return false; // saldo tidak cukup
        }
        $this->saldo -= $jumlah;
        return true;
    }

    public function getSaldo(): float {
        return $this->saldo;
    }
}

$rek = new RekeningBank(500000);
$rek->setor(200000);
$rek->tarik(100000);

echo "Saldo akhir: Rp" . number_format($rek->getSaldo());
// echo $rek->saldo; // Error! properti private tidak bisa diakses langsung
\`\`\`

\`\`\`output
Saldo akhir: Rp600,000
\`\`\`

> [!TIP] Menjadikan properti \`private\` lalu menyediakan method \`get\`/\`set\` (disebut *getter/setter*) memungkinkan kita menambahkan validasi — seperti mencegah saldo negatif — tanpa mengubah cara kode lain memakai class ini.`
},
{
  id:43, part:"Bagian VII — OOP",
  title:"Inheritance (Pewarisan)",
  md:`**Inheritance** memungkinkan sebuah class (*child*) mewarisi properti dan method dari class lain (*parent*) menggunakan kata kunci \`extends\` — menghindari duplikasi kode antar class yang serupa.

\`\`\`php title=inheritance.php
<?php
class Hewan {
    public function __construct(protected string $nama) {}

    public function bersuara(): string {
        return "$this->nama mengeluarkan suara.";
    }
}

class Kucing extends Hewan {
    public function bersuara(): string {
        return "$this->nama berkata: Meong!";
    }
}

class Ular extends Hewan {
    // tidak override -> pakai method dari parent apa adanya
}

$kucing = new Kucing("Milo");
$ular = new Ular("Sisa");

echo $kucing->bersuara(), "\\n";
echo $ular->bersuara(), "\\n";
\`\`\`

\`\`\`output
Milo berkata: Meong!
Sisa mengeluarkan suara.
\`\`\`

\`Kucing\` **meng-override** method \`bersuara()\` dengan versinya sendiri (disebut *method overriding*), sementara \`Ular\` memakai versi bawaan dari \`Hewan\` apa adanya karena tidak mendefinisikan ulang.

Gunakan \`parent::\` untuk tetap memanggil method versi induk dari dalam class turunan:

\`\`\`php title=parent-call.php
<?php
class KucingRumahan extends Kucing {
    public function bersuara(): string {
        return parent::bersuara() . " (dengan manja)";
    }
}
echo (new KucingRumahan("Momo"))->bersuara();
\`\`\`

\`\`\`output
Momo berkata: Meong! (dengan manja)
\`\`\``
},
{
  id:44, part:"Bagian VII — OOP",
  title:"Interface & Abstract Class",
  md:`**Interface** mendefinisikan "kontrak" method yang wajib diimplementasikan oleh class mana pun yang memakainya (\`implements\`), tanpa berisi logika sama sekali.

\`\`\`php title=interface.php
<?php
interface BisaDibayar {
    public function bayar(float $jumlah): string;
}

class DompetDigital implements BisaDibayar {
    public function bayar(float $jumlah): string {
        return "Membayar Rp" . number_format($jumlah) . " via Dompet Digital.";
    }
}

class TransferBank implements BisaDibayar {
    public function bayar(float $jumlah): string {
        return "Membayar Rp" . number_format($jumlah) . " via Transfer Bank.";
    }
}

function proses(BisaDibayar $metode, float $jumlah) {
    echo $metode->bayar($jumlah);
}

proses(new DompetDigital(), 150000);
\`\`\`

\`\`\`output
Membayar Rp150,000 via Dompet Digital.
\`\`\`

**Abstract class** mirip class biasa, tapi tidak bisa dibuat objeknya langsung (\`new\`) — hanya boleh diturunkan. Ia boleh mencampur method yang sudah punya isi dan method abstrak yang wajib diimplementasikan turunannya.

\`\`\`php title=abstract-class.php
<?php
abstract class Bentuk {
    abstract public function luas(): float;

    public function deskripsi(): string {
        return "Luas bentuk ini: " . $this->luas();
    }
}

class Lingkaran extends Bentuk {
    public function __construct(private float $jariJari) {}
    public function luas(): float {
        return pi() * $this->jariJari ** 2;
    }
}

echo (new Lingkaran(7))->deskripsi();
\`\`\`

\`\`\`output
Luas bentuk ini: 153.93804002589
\`\`\`

| | Interface | Abstract class |
|---|---|---|
| Bisa berisi kode jadi | tidak | ya (sebagian) |
| Multiple inheritance | ✅ (\`implements A, B\`) | ❌ (hanya satu \`extends\`) |
| Properti | tidak (PHP 8) | ya |`
},
{
  id:45, part:"Bagian VII — OOP",
  title:"Static, Const & Trait",
  md:`Anggota \`static\` dimiliki oleh **class itu sendiri**, bukan oleh objek tertentu — nilainya dibagikan ke semua instance.

\`\`\`php title=static.php
<?php
class Counter {
    public static int $jumlah = 0;

    public static function tambah(): void {
        self::$jumlah++;
    }
}

Counter::tambah();
Counter::tambah();
Counter::tambah();

echo "Total dipanggil: " . Counter::$jumlah;
\`\`\`

\`\`\`output
Total dipanggil: 3
\`\`\`

\`const\` di dalam class mendefinisikan nilai tetap milik class:

\`\`\`php title=class-const.php
<?php
class Matematika {
    const PI = 3.14159;
}
echo Matematika::PI;
\`\`\`

\`\`\`output
3.14159
\`\`\`

**Trait** memungkinkan "berbagi" method antar class yang tidak berhubungan lewat *inheritance* — solusi untuk keterbatasan PHP yang hanya mengizinkan satu \`extends\`.

\`\`\`php title=trait.php
<?php
trait Logging {
    public function log(string $pesan): void {
        echo "[LOG] " . static::class . ": $pesan\\n";
    }
}

class Pembayaran {
    use Logging;
}
class Pengiriman {
    use Logging;
}

(new Pembayaran())->log("Transaksi berhasil");
(new Pengiriman())->log("Paket dikirim");
\`\`\`

\`\`\`output
[LOG] Pembayaran: Transaksi berhasil
[LOG] Pengiriman: Paket dikirim
\`\`\`

> [!TIP] Gunakan \`static\` untuk data/perilaku yang benar-benar milik "class secara keseluruhan" (misalnya penghitung global), dan trait ketika beberapa class tak berkerabat butuh method yang sama persis.`
},
{
  id:46, part:"Bagian VII — OOP",
  title:"Namespace & Autoload",
  md:`**Namespace** mengelompokkan class agar tidak bentrok nama antar library/berkas berbeda — seperti sistem folder untuk kode.

\`\`\`php title=Model/Produk.php
<?php
namespace App\\Model;

class Produk {
    public function __construct(public string $nama) {}
}
\`\`\`

\`\`\`php title=index.php
<?php
require 'Model/Produk.php';

use App\\Model\\Produk;

$p = new Produk("Keyboard Mekanik");
echo $p->nama;
\`\`\`

\`\`\`output
Keyboard Mekanik
\`\`\`

Tanpa \`use\`, kamu harus menulis nama lengkap \`App\\Model\\Produk\` setiap kali — \`use\` membuatnya bisa dipanggil dengan nama singkat \`Produk\`.

Untuk proyek nyata, memuat setiap berkas satu-satu dengan \`require\` sangat merepotkan. Solusinya adalah **autoloading** — PHP otomatis mencari dan memuat berkas class saat dibutuhkan, biasanya lewat **Composer** (manajer paket standar PHP):

\`\`\`json title=composer.json
{
  "autoload": {
    "psr-4": { "App\\\\": "src/" }
  }
}
\`\`\`

\`\`\`php title=index.php
<?php
require 'vendor/autoload.php'; // dari Composer

use App\\Model\\Produk;
$p = new Produk("Headset Gaming");
echo $p->nama;
\`\`\`

\`\`\`output
Headset Gaming
\`\`\`

Standar **PSR-4** memetakan namespace ke struktur folder secara otomatis, sehingga kamu tidak perlu menulis \`require\` manual untuk setiap class lagi.`
},
{
  id:47, part:"Bagian VIII — Lanjutan",
  title:"PHP + MySQL dengan PDO",
  md:`**PDO** (*PHP Data Objects*) adalah lapisan akses database universal di PHP — mendukung MySQL, PostgreSQL, SQLite, dan lainnya dengan sintaks yang konsisten.

\`\`\`php title=koneksi.php
<?php
$host = "localhost";
$db   = "toko_online";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "Koneksi berhasil.";
} catch (PDOException $e) {
    die("Koneksi gagal: " . $e->getMessage());
}
\`\`\`

\`\`\`output
Koneksi berhasil.
\`\`\`

Mengambil data dengan **prepared statement** (aman dari SQL Injection karena nilai dipisah dari struktur query):

\`\`\`php title=ambil-data.php
<?php
$stmt = $pdo->prepare("SELECT nama, harga FROM produk WHERE harga > :min");
$stmt->execute(['min' => 100000]);
$produk = $stmt->fetchAll();

foreach ($produk as $p) {
    echo "{$p['nama']}: Rp" . number_format($p['harga']) . "\\n";
}
\`\`\`

\`\`\`output
Laptop XZ: Rp7,650,000
Headset Gaming: Rp350,000
\`\`\`

Menambah data baru dengan parameter *bind*:

\`\`\`php title=tambah-data.php
<?php
$stmt = $pdo->prepare("INSERT INTO produk (nama, harga) VALUES (?, ?)");
$stmt->execute(["Webcam HD", 275000]);

echo "Produk baru ditambahkan dengan ID: " . $pdo->lastInsertId();
\`\`\`

\`\`\`output
Produk baru ditambahkan dengan ID: 15
\`\`\`

> [!TIP] Selalu gunakan *placeholder* (\`?\` atau \`:nama\`) dan \`execute()\` alih-alih menyisipkan variabel langsung ke string SQL — ini adalah pertahanan utama terhadap SQL Injection, dibahas lebih dalam di bab berikutnya.`
},
{
  id:48, part:"Bagian VIII — Lanjutan",
  title:"Keamanan PHP",
  md:`Tiga ancaman keamanan paling umum di aplikasi web PHP: **SQL Injection**, **XSS**, dan penyimpanan password yang tidak aman.

**1. SQL Injection** — terjadi saat input pengguna disisipkan langsung ke query SQL.

\`\`\`php title=rentan.php
<?php
// JANGAN LAKUKAN INI — sangat rentan!
$id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = $id";
// Input seperti "1 OR 1=1" bisa membongkar seluruh tabel
\`\`\`

\`\`\`php title=aman.php
<?php
// Aman — memakai prepared statement
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);
\`\`\`

**2. XSS (Cross-Site Scripting)** — terjadi saat input pengguna ditampilkan mentah ke HTML, memungkinkan skrip jahat berjalan di browser korban.

\`\`\`php title=xss-aman.php
<?php
$komentar = $_POST['komentar']; // misal: "<script>alert('hack')</script>"

// Selalu escape sebelum ditampilkan ke HTML
echo htmlspecialchars($komentar, ENT_QUOTES, 'UTF-8');
\`\`\`

\`\`\`output
&lt;script&gt;alert(&#039;hack&#039;)&lt;/script&gt;
\`\`\`

**3. Password** — jangan pernah menyimpan password apa adanya (*plaintext*). Gunakan fungsi hashing bawaan PHP.

\`\`\`php title=password.php
<?php
$passwordAsli = "rahasia123";
$hash = password_hash($passwordAsli, PASSWORD_DEFAULT);

echo $hash . "\\n";

// Saat login, verifikasi begini:
var_dump(password_verify("rahasia123", $hash));
var_dump(password_verify("salah", $hash));
\`\`\`

\`\`\`output
$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
bool(true)
bool(false)
\`\`\`

> [!WARN] \`password_hash()\` otomatis menambahkan *salt* acak dan memilih algoritma aman (bcrypt/argon2). Jangan pernah membuat fungsi hashing sendiri atau memakai \`md5()\`/\`sha1()\` untuk password — keduanya terlalu cepat dihitung sehingga mudah ditembus *brute force*.`
},
{
  id:49, part:"Bagian VIII — Lanjutan",
  title:"RESTful API Mini dengan PHP",
  md:`**REST API** memungkinkan aplikasi lain (mobile app, frontend JavaScript, sistem eksternal) berkomunikasi dengan server lewat HTTP, biasanya bertukar data format **JSON**.

\`\`\`php title=api/produk.php
<?php
header('Content-Type: application/json');

$produk = [
    ['id' => 1, 'nama' => 'Laptop XZ', 'harga' => 7650000],
    ['id' => 2, 'nama' => 'Mouse Wireless', 'harga' => 150000],
];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(['status' => 'sukses', 'data' => $produk]);
} else {
    http_response_code(405);
    echo json_encode(['status' => 'gagal', 'pesan' => 'Method tidak didukung']);
}
\`\`\`

\`\`\`output
{"status":"sukses","data":[{"id":1,"nama":"Laptop XZ","harga":7650000},{"id":2,"nama":"Mouse Wireless","harga":150000}]}
\`\`\`

Menerima data JSON dari client (misalnya request \`POST\` dengan body JSON):

\`\`\`php title=api/tambah-produk.php
<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['nama']) || empty($input['harga'])) {
    http_response_code(400);
    echo json_encode(['status' => 'gagal', 'pesan' => 'Nama dan harga wajib diisi']);
    exit;
}

http_response_code(201);
echo json_encode([
    'status' => 'sukses',
    'pesan'  => 'Produk ditambahkan',
    'data'   => $input,
]);
\`\`\`

\`\`\`output
{"status":"sukses","pesan":"Produk ditambahkan","data":{"nama":"Webcam HD","harga":275000}}
\`\`\`

Kode status HTTP yang umum dipakai di API:

| Kode | Arti |
|---|---|
| \`200\` | OK — berhasil |
| \`201\` | Created — data baru berhasil dibuat |
| \`400\` | Bad Request — input tidak valid |
| \`401\` | Unauthorized — belum login/token salah |
| \`404\` | Not Found — data tak ditemukan |
| \`500\` | Internal Server Error — error di server |

Berkas \`api/index.php\` pada proyek ini adalah contoh nyata endpoint semacam ini, dan siap dijalankan sebagai fungsi *serverless* PHP di Vercel.`
},
{
  id:50, part:"Bagian VIII — Lanjutan",
  title:"Best Practice & Penutup",
  md:`Selamat! Kamu telah menuntaskan seluruh 50 halaman buku ini — dari sintaks paling dasar hingga OOP, database, dan keamanan. Berikut rangkuman kebiasaan baik untuk dibawa ke proyek nyata:

- **Selalu validasi & escape** setiap data yang berasal dari pengguna (form, URL, API) — jangan pernah percaya input mentah.
- **Gunakan \`===\` alih-alih \`==\`** kecuali kamu benar-benar butuh konversi tipe otomatis.
- **Pisahkan logika dan tampilan.** Hindari mencampur query database langsung di tengah HTML; pertimbangkan struktur MVC seiring proyek membesar.
- **Pakai prepared statement (PDO)** untuk setiap interaksi database, tanpa kecuali.
- **Hash password dengan \`password_hash()\`**, jangan pernah simpan plaintext atau pakai \`md5()\`.
- **Beri nama variabel & fungsi yang jelas** — kode dibaca lebih sering daripada ditulis.
- **Gunakan Composer** untuk mengelola dependensi dan autoloading di proyek berskala menengah ke atas.
- **Tulis komentar untuk "mengapa"**, bukan "apa" — kode yang baik sudah menjelaskan "apa" dengan sendirinya.

\`\`\`php title=ringkasan.php
<?php
// Potongan kode ini merangkum banyak konsep dari buku ini sekaligus:
class Sapaan {
    public function __construct(private string $nama) {}

    public function untuk(): string {
        return match(true) {
            $this->nama === '' => "Halo, Tamu!",
            default => "Halo, " . htmlspecialchars($this->nama) . "!",
        };
    }
}

$daftarNama = ["Xayz", "", "Dewi"];
$sapaan = array_map(fn($n) => (new Sapaan($n))->untuk(), $daftarNama);

echo implode("\\n", $sapaan);
\`\`\`

\`\`\`output
Halo, Xayz!
Halo, Tamu!
Halo, Dewi!
\`\`\`

> [!TIP] Langkah selanjutnya yang disarankan: pelajari sebuah *framework* PHP modern seperti **Laravel** atau **Symfony** — keduanya dibangun di atas seluruh konsep yang sudah kamu kuasai di buku ini, hanya dengan struktur dan tooling yang lebih rapi.

Terima kasih telah membaca **XayzEduPhp** sampai halaman terakhir. Selamat terus berkarya dengan PHP! 🐘`
}
);
