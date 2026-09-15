window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:71, part:"Bagian X — Database & SQL",
  title:"Studi Kasus: Mini App Todo-List (PHP + SQLite)",
  md:`Mari gabungkan seluruh materi database menjadi satu aplikasi mini yang utuh: **Todo-List** dengan penyimpanan SQLite (berkas tunggal, tanpa perlu server MySQL terpisah — cocok untuk belajar maupun aplikasi kecil).

\`\`\`php title=todo.php
<?php
$pdo = new PDO('sqlite:todo.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec("
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        judul TEXT NOT NULL,
        selesai INTEGER DEFAULT 0
    )
");

function tambahTodo(PDO $pdo, string $judul): void {
    $stmt = $pdo->prepare("INSERT INTO todos (judul) VALUES (?)");
    $stmt->execute([$judul]);
}

function selesaikanTodo(PDO $pdo, int $id): void {
    $stmt = $pdo->prepare("UPDATE todos SET selesai = 1 WHERE id = ?");
    $stmt->execute([$id]);
}

function daftarTodo(PDO $pdo): array {
    return $pdo->query("SELECT * FROM todos ORDER BY id")->fetchAll();
}

// --- pemakaian ---
tambahTodo($pdo, "Belajar PHP");
tambahTodo($pdo, "Bikin API");
tambahTodo($pdo, "Deploy ke Vercel");
selesaikanTodo($pdo, 1);

foreach (daftarTodo($pdo) as $t) {
    $status = $t['selesai'] ? "[x]" : "[ ]";
    echo "$status {$t['judul']}\\n";
}
\`\`\`

\`\`\`output
[x] Belajar PHP
[ ] Bikin API
[ ] Deploy ke Vercel
\`\`\`

Perhatikan bagaimana keempat fungsi (\`tambahTodo\`, \`selesaikanTodo\`, \`daftarTodo\`) masing-masing hanya bertanggung jawab atas **satu** operasi — pola pemisahan tanggung jawab yang sama seperti \`ProdukRepository\` di halaman sebelumnya, hanya ditulis lebih sederhana sebagai fungsi lepas alih-alih method class.

> [!TIP] Berkas \`todo.db\` yang dihasilkan SQLite adalah satu file fisik — kamu bisa menyalin, mem-backup, atau bahkan membukanya dengan aplikasi seperti "DB Browser for SQLite" untuk melihat isinya secara visual.`
},
{
  id:72, part:"Bagian X — Database & SQL",
  title:"Studi Kasus Lanjutan: Pencarian & Paginasi Data",
  md:`Saat data di tabel sudah ribuan baris, menampilkan **semuanya sekaligus** akan lambat dan tidak praktis. Solusinya: **paginasi** (menampilkan sebagian per halaman) dan **pencarian** (menyaring berdasarkan kata kunci).

\`\`\`php title=paginasi.php
<?php
function cariProduk(PDO $pdo, string $kataKunci, int $halaman = 1, int $perHalaman = 10): array {
    $offset = ($halaman - 1) * $perHalaman;

    $stmt = $pdo->prepare("
        SELECT * FROM produk
        WHERE nama LIKE :kata
        ORDER BY nama
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(':kata', "%$kataKunci%");
    $stmt->bindValue(':limit', $perHalaman, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

function totalHalaman(PDO $pdo, string $kataKunci, int $perHalaman = 10): int {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM produk WHERE nama LIKE ?");
    $stmt->execute(["%$kataKunci%"]);
    $total = (int) $stmt->fetchColumn();

    return (int) ceil($total / $perHalaman);
}

// --- pemakaian ---
$hasil = cariProduk($pdo, "mouse", halaman: 1, perHalaman: 5);
$totalHal = totalHalaman($pdo, "mouse", perHalaman: 5);

echo "Ditemukan " . count($hasil) . " produk (halaman 1 dari $totalHal)\\n";
foreach ($hasil as $p) {
    echo "- {$p['nama']}: Rp" . number_format($p['harga']) . "\\n";
}
\`\`\`

\`\`\`output
Ditemukan 2 produk (halaman 1 dari 1)
- Mouse Gaming RGB: Rp185,000
- Mouse Wireless: Rp150,000
\`\`\`

Tiga elemen kunci paginasi:

| Klausa SQL | Kegunaan |
|---|---|
| \`LIKE '%kata%'\` | mencari baris yang mengandung kata kunci di mana pun dalam teks |
| \`LIMIT n\` | membatasi jumlah baris yang dikembalikan |
| \`OFFSET m\` | melompati m baris pertama (dipakai untuk "lompat ke halaman tertentu") |

> [!TIP] Untuk pencarian teks dalam jumlah besar (jutaan baris) dengan performa tinggi, \`LIKE\` mulai terasa lambat — pertimbangkan fitur **full-text search** bawaan database (seperti \`FULLTEXT INDEX\` di MySQL) atau mesin pencarian khusus seperti Elasticsearch/Meilisearch.`
},
{
  id:73, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Magic Methods",
  md:`**Magic methods** adalah method spesial di PHP yang namanya diawali dua garis bawah (\`__\`), dipanggil **otomatis** oleh PHP pada momen tertentu — bukan dipanggil manual seperti method biasa.

\`\`\`php title=magic-methods.php
<?php
class Konfigurasi {
    private array $data = [];

    public function __set(string $nama, mixed $nilai): void {
        echo "Menyimpan '$nama'...\\n";
        $this->data[$nama] = $nilai;
    }

    public function __get(string $nama): mixed {
        echo "Membaca '$nama'...\\n";
        return $this->data[$nama] ?? null;
    }

    public function __toString(): string {
        return "Konfigurasi(" . count($this->data) . " item)";
    }
}

$config = new Konfigurasi();
$config->tema = "gelap";      // otomatis memanggil __set()
echo $config->tema . "\\n";    // otomatis memanggil __get()
echo $config . "\\n";          // otomatis memanggil __toString()
\`\`\`

\`\`\`output
Menyimpan 'tema'...
Membaca 'tema'...
gelap
Konfigurasi(1 item)
\`\`\`

Magic methods yang paling sering dipakai:

| Method | Dipanggil otomatis saat |
|---|---|
| \`__construct()\` | objek dibuat dengan \`new\` |
| \`__destruct()\` | objek dihancurkan |
| \`__get()\` / \`__set()\` | mengakses/mengisi properti yang tidak ada atau \`private\` |
| \`__call()\` | memanggil method yang tidak ada |
| \`__toString()\` | objek diperlakukan sebagai string (mis. di dalam \`echo\`) |
| \`__invoke()\` | objek dipanggil seperti fungsi: \`$obj()\` |

> [!WARN] Magic methods sangat berguna tapi mudah disalahgunakan — kode menjadi "ajaib" dan sulit ditelusuri (IDE tidak bisa mendeteksi properti mana saja yang valid). Gunakan secukupnya, biasanya untuk kasus khusus seperti wrapper konfigurasi atau ORM.`
},
{
  id:74, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Enum (PHP 8.1+)",
  md:`**Enum** (enumerasi) mendefinisikan sekumpulan nilai tetap yang saling terkait — misalnya status pesanan yang hanya boleh berupa beberapa nilai spesifik, bukan string bebas yang rawan salah ketik.

\`\`\`php title=enum.php
<?php
enum StatusPesanan: string {
    case Menunggu = 'menunggu';
    case Diproses = 'diproses';
    case Dikirim  = 'dikirim';
    case Selesai  = 'selesai';

    public function label(): string {
        return match($this) {
            self::Menunggu => 'Menunggu Pembayaran',
            self::Diproses => 'Sedang Diproses',
            self::Dikirim  => 'Dalam Pengiriman',
            self::Selesai  => 'Pesanan Selesai',
        };
    }
}

$status = StatusPesanan::Diproses;

echo $status->value . "\\n";   // 'diproses'
echo $status->label() . "\\n"; // 'Sedang Diproses'

function prosesPesanan(StatusPesanan $status): void {
    echo "Memproses pesanan dengan status: {$status->label()}\\n";
}
prosesPesanan(StatusPesanan::Selesai);
\`\`\`

\`\`\`output
diproses
Sedang Diproses
Memproses pesanan dengan status: Pesanan Selesai
\`\`\`

Sebelum enum ada (PHP < 8.1), pola ini biasanya ditiru dengan konstanta class (\`const MENUNGGU = 'menunggu';\`), tapi itu tidak memberi jaminan tipe — variabel manapun bisa saja diisi string sembarang. Enum memberi **jaminan pada level tipe**: parameter bertipe \`StatusPesanan\` hanya bisa diisi salah satu \`case\` yang terdaftar.

> [!TIP] Enum sangat cocok untuk merepresentasikan status, peran pengguna (admin/member/tamu), atau kategori tetap lainnya — di mana nilai yang mungkin sudah diketahui sejak awal dan tidak berubah-ubah.`
},
{
  id:75, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Readonly Properties & Immutability",
  md:`Properti \`readonly\` (PHP 8.1+) hanya bisa diisi **sekali** — biasanya di dalam constructor — dan tidak bisa diubah lagi setelahnya. Ini mendukung konsep **immutability** (objek yang tidak berubah setelah dibuat), yang membuat kode lebih mudah diprediksi.

\`\`\`php title=readonly.php
<?php
class Koordinat {
    public function __construct(
        public readonly float $lat,
        public readonly float $lng,
    ) {}
}

$titik = new Koordinat(-6.9147, 107.6098);
echo "$titik->lat, $titik->lng\\n";

try {
    $titik->lat = 0; // Error! properti readonly tidak bisa diubah
} catch (Error $e) {
    echo "Gagal: " . $e->getMessage();
}
\`\`\`

\`\`\`output
-6.9147, 107.6098
Gagal: Cannot modify readonly property Koordinat::$lat
\`\`\`

Mengapa immutability berguna? Bayangkan objek \`Koordinat\` dikirim ke banyak bagian program berbeda — dengan \`readonly\`, kamu **yakin** nilainya tidak akan diam-diam berubah oleh kode lain, mengurangi bug yang sulit dilacak akibat *side effect* tak terduga.

Jika ingin membuat "versi baru" dari objek readonly dengan sebagian data berubah, buat method yang mengembalikan **objek baru**, bukan memutasi objek lama:

\`\`\`php title=with-method.php
<?php
class Koordinat {
    public function __construct(
        public readonly float $lat,
        public readonly float $lng,
    ) {}

    public function geser(float $deltaLat, float $deltaLng): self {
        return new self($this->lat + $deltaLat, $this->lng + $deltaLng);
    }
}

$a = new Koordinat(0, 0);
$b = $a->geser(1.5, 2.5); // $a tidak berubah, $b adalah objek baru
echo "$a->lat,$a->lng -> $b->lat,$b->lng";
\`\`\`

\`\`\`output
0,0 -> 1.5,2.5
\`\`\``
},
{
  id:76, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Trait Lanjutan & Conflict Resolution",
  md:`Bab 45 memperkenalkan trait untuk berbagi method antar class. Bagaimana jika sebuah class memakai **dua trait** yang memiliki method dengan **nama sama**? PHP akan melempar error kecuali konfliknya diselesaikan secara eksplisit.

\`\`\`php title=trait-konflik.php
<?php
trait Berenang {
    public function bergerak(): string { return "berenang"; }
}
trait Berlari {
    public function bergerak(): string { return "berlari"; }
}

class Amfibi {
    use Berenang, Berlari {
        Berenang::bergerak insteadof Berlari;   // pilih versi Berenang
        Berlari::bergerak as bergerakDiDarat;   // beri alias untuk versi Berlari
    }
}

$kodok = new Amfibi();
echo $kodok->bergerak() . "\\n";         // berenang
echo $kodok->bergerakDiDarat() . "\\n";  // berlari
\`\`\`

\`\`\`output
berenang
berlari
\`\`\`

Dua kata kunci untuk menyelesaikan konflik trait:

| Kata kunci | Kegunaan |
|---|---|
| \`insteadof\` | menentukan trait mana yang "menang" untuk method dengan nama sama |
| \`as\` | memberi nama alias baru untuk method dari trait tertentu, agar tetap bisa dipakai |

Trait juga bisa memiliki **method abstrak** yang wajib diimplementasikan oleh class pemakainya, mirip interface tapi bisa dicampur dengan method konkret — cocok untuk perilaku bersama yang butuh sedikit informasi spesifik dari tiap class:

\`\`\`php title=trait-abstrak.php
<?php
trait BisaDiekspor {
    abstract public function keArray(): array;

    public function keJson(): string {
        return json_encode($this->keArray());
    }
}
class Produk {
    use BisaDiekspor;
    public function __construct(private string $nama) {}
    public function keArray(): array { return ['nama' => $this->nama]; }
}
echo (new Produk("Sepatu"))->keJson();
\`\`\`

\`\`\`output
{"nama":"Sepatu"}
\`\`\``
},
{
  id:77, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Design Pattern: Singleton",
  md:`**Design pattern** adalah solusi umum yang sudah terbukti untuk masalah desain yang berulang. **Singleton** memastikan sebuah class hanya punya **satu instance** di seluruh aplikasi — sudah kamu lihat sekilas di class \`Database\` pada Bab 66.

\`\`\`php title=singleton.php
<?php
class Logger {
    private static ?self $instance = null;
    private array $log = [];

    private function __construct() {} // dibuat private agar tidak bisa "new" dari luar

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function catat(string $pesan): void {
        $this->log[] = $pesan;
    }

    public function semua(): array {
        return $this->log;
    }
}

Logger::getInstance()->catat("Aplikasi dimulai");
Logger::getInstance()->catat("Pengguna login");

print_r(Logger::getInstance()->semua());
\`\`\`

\`\`\`output
Array
(
    [0] => Aplikasi dimulai
    [1] => Pengguna login
)
\`\`\`

Kedua pemanggilan \`Logger::getInstance()\` mengembalikan **objek yang sama persis** — itulah sebabnya kedua pesan tersimpan di array \`$log\` yang sama, walau dipanggil dari baris kode berbeda.

> [!WARN] Singleton praktis tapi sering dianggap *anti-pattern* jika dipakai berlebihan — ia menciptakan **state global tersembunyi** yang membuat kode sulit diuji (unit test). Pertimbangkan **Dependency Injection** (Bab 80) sebagai alternatif yang lebih fleksibel untuk kasus di luar koneksi database/logger.`
},
{
  id:78, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Design Pattern: Factory",
  md:`**Factory Pattern** menyembunyikan logika "cara membuat objek" di balik satu method — pemanggil cukup meminta objek yang diinginkan tanpa perlu tahu detail class mana yang sebenarnya dipakai.

\`\`\`php title=factory.php
<?php
interface Notifikasi {
    public function kirim(string $pesan): string;
}

class NotifikasiEmail implements Notifikasi {
    public function kirim(string $pesan): string { return "Email terkirim: $pesan"; }
}
class NotifikasiSms implements Notifikasi {
    public function kirim(string $pesan): string { return "SMS terkirim: $pesan"; }
}
class NotifikasiWhatsapp implements Notifikasi {
    public function kirim(string $pesan): string { return "WhatsApp terkirim: $pesan"; }
}

class NotifikasiFactory {
    public static function buat(string $tipe): Notifikasi {
        return match($tipe) {
            'email'    => new NotifikasiEmail(),
            'sms'      => new NotifikasiSms(),
            'whatsapp' => new NotifikasiWhatsapp(),
            default    => throw new InvalidArgumentException("Tipe tidak dikenal: $tipe"),
        };
    }
}

$notif = NotifikasiFactory::buat('whatsapp');
echo $notif->kirim("Pesananmu sudah dikirim!");
\`\`\`

\`\`\`output
WhatsApp terkirim: Pesananmu sudah dikirim!
\`\`\`

Keuntungan pola ini: jika suatu hari ingin menambah tipe notifikasi baru (misalnya Telegram), kamu cukup menambah satu \`case\` di \`NotifikasiFactory\` — kode yang **memakai** factory (seperti baris \`NotifikasiFactory::buat(...)\`) tidak perlu diubah sama sekali.

> [!TIP] Factory sangat berguna ketika keputusan "class mana yang harus dipakai" bergantung pada input yang baru diketahui saat program berjalan (seperti pilihan pengguna), bukan sesuatu yang bisa ditentukan saat menulis kode.`
},
{
  id:79, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Design Pattern: Repository",
  md:`**Repository Pattern** — yang sudah kamu praktikkan di \`ProdukRepository\` (Bab 67–68) — memisahkan logika akses data (query SQL) dari logika bisnis aplikasi. Mari lihat manfaatnya lebih formal lewat sebuah **interface**.

\`\`\`php title=repository-interface.php
<?php
interface ProdukRepositoryInterface {
    public function findAll(): array;
    public function findById(int $id): ?array;
    public function create(string $nama, float $harga): string;
}

class ProdukRepositoryMysql implements ProdukRepositoryInterface {
    public function __construct(private PDO $pdo) {}
    public function findAll(): array {
        return $this->pdo->query("SELECT * FROM produk")->fetchAll();
    }
    public function findById(int $id): ?array { /* ... */ return null; }
    public function create(string $nama, float $harga): string { /* ... */ return "1"; }
}

// Versi palsu untuk keperluan testing, TANPA database sungguhan
class ProdukRepositoryFake implements ProdukRepositoryInterface {
    private array $data = [];
    public function findAll(): array { return array_values($this->data); }
    public function findById(int $id): ?array { return $this->data[$id] ?? null; }
    public function create(string $nama, float $harga): string {
        $id = count($this->data) + 1;
        $this->data[$id] = ['id' => $id, 'nama' => $nama, 'harga' => $harga];
        return (string) $id;
    }
}

function tampilkanSemuaProduk(ProdukRepositoryInterface $repo): void {
    foreach ($repo->findAll() as $p) {
        echo "- {$p['nama']}\\n";
    }
}

$repoPalsu = new ProdukRepositoryFake();
$repoPalsu->create("Sepatu Lari", 450000);
tampilkanSemuaProduk($repoPalsu);
\`\`\`

\`\`\`output
- Sepatu Lari
\`\`\`

Karena \`tampilkanSemuaProduk()\` menerima **interface**, bukan class MySQL secara langsung, fungsi yang sama bisa dites dengan \`ProdukRepositoryFake\` (cepat, tanpa database sungguhan) maupun dijalankan dengan \`ProdukRepositoryMysql\` di produksi — inilah manfaat utama memprogram terhadap **interface**, bukan implementasi konkret.`
},
{
  id:80, part:"Bagian XI — OOP & Arsitektur Lanjutan",
  title:"Dependency Injection Dasar",
  md:`**Dependency Injection (DI)** adalah teknik memberikan (*inject*) objek yang dibutuhkan suatu class **dari luar**, alih-alih class tersebut membuat sendiri objek yang ia butuhkan secara internal.

\`\`\`php title=tanpa-di.php
<?php
// TANPA dependency injection — sulit diuji & kaku
class LayananPesanan {
    private PDO $pdo;
    public function __construct() {
        $this->pdo = new PDO('mysql:host=localhost;dbname=toko', 'root', ''); // terikat erat!
    }
}
\`\`\`

\`\`\`php title=dengan-di.php
<?php
// DENGAN dependency injection — fleksibel & mudah diuji
class LayananPesanan {
    public function __construct(
        private PDO $pdo,                       // dependensi database
        private ProdukRepositoryInterface $repo, // dependensi repository (Bab 79)
    ) {}

    public function buatPesanan(string $namaProduk): string {
        $produk = $this->repo->findAll();
        return "Pesanan untuk '$namaProduk' berhasil dibuat.";
    }
}

// Dependensi disediakan (di-"inject") dari luar, saat objek dibuat
$pdo = new PDO('sqlite::memory:');
$repo = new ProdukRepositoryFake();
$layanan = new LayananPesanan($pdo, $repo);

echo $layanan->buatPesanan("Sepatu Lari");
\`\`\`

\`\`\`output
Pesanan untuk 'Sepatu Lari' berhasil dibuat.
\`\`\`

Keuntungan DI:

- **Mudah diuji** — saat testing, kirim versi "palsu" (\`ProdukRepositoryFake\`) alih-alih koneksi database sungguhan.
- **Fleksibel** — mengganti implementasi (misalnya dari MySQL ke PostgreSQL) tidak mengubah kode \`LayananPesanan\` sama sekali.
- **Jelas** — semua yang dibutuhkan suatu class terlihat langsung di parameter constructor-nya, tidak "tersembunyi" di dalam method.

> [!TIP] Framework PHP modern seperti Laravel dan Symfony punya **Service Container** — sistem yang otomatis "merangkai" dependensi ini untukmu, sehingga kamu jarang perlu membuat objek dependensi secara manual seperti contoh di atas.`
}
);
