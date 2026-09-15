window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:61, part:"Bagian X — Database & SQL",
  title:"SQL: SELECT, WHERE & ORDER BY",
  md:`\`SELECT\` adalah perintah SQL paling sering dipakai — mengambil data dari tabel. Klausa \`WHERE\` menyaring baris, dan \`ORDER BY\` mengurutkan hasil.

\`\`\`sql title=select.sql
SELECT nama, nilai
FROM siswa
WHERE nilai >= 75
ORDER BY nilai DESC;
\`\`\`

Latihan di bawah memakai tabel \`siswa\` yang sudah disiapkan berisi data: Ani (88), Budi (72), Citra (95), Dedi (60). Susun ulang query agar hanya menampilkan siswa dengan nilai ≥ 75, diurutkan dari nilai tertinggi.`,
  exercise:{
    runtime:"sql",
    instruksi:"Susun ulang query berikut untuk menampilkan nama & nilai siswa dengan nilai minimal 75, diurutkan dari tertinggi ke terendah. Baris klausa WHERE sengaja dikosongkan.",
    lines:[
      "SELECT nama, nilai",
      "FROM siswa",
      "WHERE nilai >= 75",
      "ORDER BY nilai DESC;"
    ],
    blankIndex:2,
    wrapperBefore:"",
    wrapperAfter:"",
    seedSql:"CREATE TABLE siswa (id INTEGER PRIMARY KEY, nama TEXT, nilai INTEGER); INSERT INTO siswa (nama, nilai) VALUES ('Ani', 88), ('Budi', 72), ('Citra', 95), ('Dedi', 60);",
    expectedOutput:"nama | nilai\n-----------|-----------\nCitra | 95\nAni | 88"
  }
},
{
  id:62, part:"Bagian X — Database & SQL",
  title:"SQL: INSERT — Membuat Data Baru",
  md:`\`INSERT INTO\` menambahkan baris baru ke sebuah tabel — inilah huruf **C** (*Create*) dalam **CRUD**.

\`\`\`sql title=insert.sql
INSERT INTO produk (nama, harga)
VALUES ('Headset', 250000);
\`\`\`

Kamu bisa memasukkan beberapa baris sekaligus dalam satu perintah:

\`\`\`sql title=insert-banyak.sql
INSERT INTO produk (nama, harga) VALUES
  ('Mouse', 120000),
  ('Keyboard', 210000),
  ('Monitor', 1450000);
\`\`\`

Latihan di bawah: tabel \`produk\` sudah dibuat tapi masih kosong. Susun ulang query untuk menambahkan satu produk baru ("Headset", harga 250000), lalu tampilkan seluruh isi tabel untuk membuktikan datanya berhasil masuk.`,
  exercise:{
    runtime:"sql",
    instruksi:"Susun ulang query berikut untuk menambahkan produk baru bernama 'Headset' seharga 250000, lalu tampilkan seluruh isi tabel produk. Baris nilai VALUES sengaja dikosongkan.",
    lines:[
      "INSERT INTO produk (nama, harga)",
      "VALUES ('Headset', 250000);",
      "SELECT nama, harga FROM produk;"
    ],
    blankIndex:1,
    wrapperBefore:"",
    wrapperAfter:"",
    seedSql:"CREATE TABLE produk (id INTEGER PRIMARY KEY, nama TEXT, harga INTEGER);",
    expectedOutput:"nama | harga\n-----------|-----------\nHeadset | 250000"
  }
},
{
  id:63, part:"Bagian X — Database & SQL",
  title:"SQL: UPDATE & DELETE",
  md:`\`UPDATE\` mengubah data yang sudah ada (huruf **U**), dan \`DELETE\` menghapus baris (huruf **D**) — melengkapi keempat operasi **CRUD**.

\`\`\`sql title=update-delete.sql
UPDATE produk SET stok = 8 WHERE nama = 'Mouse';
DELETE FROM produk WHERE stok = 0;
\`\`\`

> [!WARN] **Selalu sertakan \`WHERE\`** pada \`UPDATE\`/\`DELETE\` kecuali kamu benar-benar ingin mengubah/menghapus **seluruh baris** di tabel — kesalahan ini adalah salah satu penyebab kehilangan data paling umum di dunia nyata.

Latihan di bawah: tabel \`produk\` berisi Mouse (stok 10), Keyboard (stok 0), Monitor (stok 5). Susun ulang query untuk: ubah stok Mouse menjadi 8, hapus produk yang stoknya 0, lalu tampilkan sisa produk terurut berdasarkan nama.`,
  exercise:{
    runtime:"sql",
    instruksi:"Susun ulang query berikut: ubah stok Mouse jadi 8, hapus produk berstok 0, lalu tampilkan sisa produk terurut nama. Baris DELETE sengaja dikosongkan.",
    lines:[
      "UPDATE produk SET stok = 8 WHERE nama = 'Mouse';",
      "DELETE FROM produk WHERE stok = 0;",
      "SELECT nama, stok FROM produk ORDER BY nama;"
    ],
    blankIndex:1,
    wrapperBefore:"",
    wrapperAfter:"",
    seedSql:"CREATE TABLE produk (id INTEGER PRIMARY KEY, nama TEXT, stok INTEGER); INSERT INTO produk (nama, stok) VALUES ('Mouse', 10), ('Keyboard', 0), ('Monitor', 5);",
    expectedOutput:"nama | stok\n-----------|-----------\nMonitor | 5\nMouse | 8"
  }
},
{
  id:64, part:"Bagian X — Database & SQL",
  title:"SQL: JOIN Antar Tabel",
  md:`Data di dunia nyata jarang muat dalam satu tabel. \`JOIN\` menggabungkan baris dari dua tabel atau lebih berdasarkan kolom yang saling berhubungan (relasi).

\`\`\`sql title=join.sql
SELECT pelanggan.nama, pesanan.item
FROM pesanan
JOIN pelanggan ON pesanan.pelanggan_id = pelanggan.id
ORDER BY pelanggan.nama;
\`\`\`

\`\`\`output
Tabel pelanggan          Tabel pesanan
+----+-------+           +----+---------------+--------+
| id | nama  |           | id | pelanggan_id  | item   |
+----+-------+           +----+---------------+--------+
| 1  | Rina  |           | 1  | 1             | Buku   |
| 2  | Toni  |           | 2  | 1             | Pensil |
+----+-------+           | 3  | 2             | Tas    |
                          +----+---------------+--------+
\`\`\`

\`JOIN ... ON ...\` mencocokkan \`pesanan.pelanggan_id\` dengan \`pelanggan.id\` — pola relasi "satu pelanggan bisa punya banyak pesanan" ini disebut **one-to-many**, pola relasi paling umum di database.

Latihan di bawah menyiapkan kedua tabel di atas. Susun ulang query untuk menampilkan nama pelanggan beserta item yang mereka pesan.`,
  exercise:{
    runtime:"sql",
    instruksi:"Susun ulang query JOIN berikut untuk menampilkan nama pelanggan beserta item pesanan mereka, terurut berdasarkan nama. Baris JOIN...ON sengaja dikosongkan.",
    lines:[
      "SELECT pelanggan.nama, pesanan.item",
      "FROM pesanan",
      "JOIN pelanggan ON pesanan.pelanggan_id = pelanggan.id",
      "ORDER BY pelanggan.nama;"
    ],
    blankIndex:2,
    wrapperBefore:"",
    wrapperAfter:"",
    seedSql:"CREATE TABLE pelanggan (id INTEGER PRIMARY KEY, nama TEXT); CREATE TABLE pesanan (id INTEGER PRIMARY KEY, pelanggan_id INTEGER, item TEXT); INSERT INTO pelanggan (nama) VALUES ('Rina'), ('Toni'); INSERT INTO pesanan (pelanggan_id, item) VALUES (1,'Buku'), (1,'Pensil'), (2,'Tas');",
    expectedOutput:"nama | item\n-----------|-----------\nRina | Buku\nRina | Pensil\nToni | Tas"
  }
},
{
  id:65, part:"Bagian X — Database & SQL",
  title:"SQL: Aggregate & GROUP BY",
  md:`Fungsi agregat menghitung ringkasan dari banyak baris sekaligus — seperti total, rata-rata, atau jumlah data. Dipasangkan dengan \`GROUP BY\`, kita bisa menghitung ringkasan **per kategori**.

\`\`\`sql title=aggregate.sql
SELECT kategori, SUM(jumlah) AS total
FROM penjualan
GROUP BY kategori
ORDER BY total DESC;
\`\`\`

Fungsi agregat yang umum dipakai:

| Fungsi | Kegunaan |
|---|---|
| \`COUNT()\` | menghitung jumlah baris |
| \`SUM()\` | menjumlahkan nilai kolom |
| \`AVG()\` | rata-rata nilai kolom |
| \`MIN()\` / \`MAX()\` | nilai terkecil/terbesar |

> [!TIP] Aturan pentingnya: setiap kolom di \`SELECT\` yang **bukan** hasil fungsi agregat **harus** muncul di \`GROUP BY\` — di atas, \`kategori\` ada di keduanya, sedangkan \`SUM(jumlah)\` adalah hasil agregat sehingga boleh berdiri sendiri.

Latihan di bawah menyiapkan tabel \`penjualan\` dengan beberapa transaksi per kategori. Susun ulang query untuk menghitung total penjualan per kategori, diurutkan dari yang terbesar.`,
  exercise:{
    runtime:"sql",
    instruksi:"Susun ulang query berikut untuk menjumlahkan penjualan per kategori, terurut dari total terbesar. Baris GROUP BY sengaja dikosongkan.",
    lines:[
      "SELECT kategori, SUM(jumlah) AS total",
      "FROM penjualan",
      "GROUP BY kategori",
      "ORDER BY total DESC;"
    ],
    blankIndex:2,
    wrapperBefore:"",
    wrapperAfter:"",
    seedSql:"CREATE TABLE penjualan (id INTEGER PRIMARY KEY, kategori TEXT, jumlah INTEGER); INSERT INTO penjualan (kategori, jumlah) VALUES ('Elektronik',3), ('Elektronik',2), ('Fashion',5), ('Fashion',1), ('Makanan',10);",
    expectedOutput:"kategori | total\n-----------|-----------\nMakanan | 10\nFashion | 6\nElektronik | 5"
  }
},
{
  id:66, part:"Bagian X — Database & SQL",
  title:"Koneksi PHP ke MySQL dengan PDO",
  md:`Sekarang kita hubungkan apa yang sudah dipelajari: menjalankan query SQL **dari dalam kode PHP**, memakai **PDO** yang sudah diperkenalkan di Bab 47. Mari kita perdalam dengan pola koneksi yang lebih matang untuk aplikasi nyata.

\`\`\`php title=Database.php
<?php
class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = 'localhost';
            $db   = 'toko_online';
            $user = 'root';
            $pass = '';

            self::$instance = new PDO(
                "mysql:host=$host;dbname=$db;charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        }
        return self::$instance;
    }
}
\`\`\`

\`\`\`php title=pakai-koneksi.php
<?php
require 'Database.php';

$pdo = Database::getConnection();
echo "Terhubung ke database!";
\`\`\`

\`\`\`output
Terhubung ke database!
\`\`\`

Pola di atas disebut **Singleton** (akan dibahas lebih formal di Bab 77) — koneksi database hanya dibuat **sekali** dan dipakai ulang di seluruh aplikasi, alih-alih membuka koneksi baru berulang kali yang boros sumber daya.

> [!TIP] Untuk latihan tanpa perlu instalasi MySQL, kamu bisa memakai driver \`sqlite:\` di PDO — misalnya \`new PDO('sqlite:toko.db')\` — sangat praktis untuk belajar dan pengembangan lokal sebelum pindah ke MySQL di produksi.`
},
{
  id:67, part:"Bagian X — Database & SQL",
  title:"CRUD Lengkap: Create & Read dengan PDO",
  md:`Mari implementasikan **Create** dan **Read** secara lengkap dalam bentuk fungsi-fungsi yang bisa dipakai ulang — pola yang akan kamu temukan di hampir semua aplikasi PHP berbasis database.

\`\`\`php title=ProdukRepository.php
<?php
class ProdukRepository {
    public function __construct(private PDO $pdo) {}

    public function create(string $nama, float $harga, int $stok = 0): string {
        $stmt = $this->pdo->prepare(
            "INSERT INTO produk (nama, harga, stok) VALUES (?, ?, ?)"
        );
        $stmt->execute([$nama, $harga, $stok]);
        return $this->pdo->lastInsertId();
    }

    public function findAll(): array {
        return $this->pdo->query("SELECT * FROM produk ORDER BY id DESC")->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM produk WHERE id = ?");
        $stmt->execute([$id]);
        $hasil = $stmt->fetch();
        return $hasil ?: null;
    }
}
\`\`\`

\`\`\`php title=pakai-repository.php
<?php
$repo = new ProdukRepository($pdo);

$id = $repo->create("Webcam HD", 275000, 10);
echo "Produk baru dibuat dengan ID: $id\\n";

$produk = $repo->findById((int) $id);
echo "Ditemukan: {$produk['nama']} - Rp" . number_format($produk['harga']);
\`\`\`

\`\`\`output
Produk baru dibuat dengan ID: 16
Ditemukan: Webcam HD - Rp275,000
\`\`\`

Pola pengelompokan operasi database ke dalam satu class seperti \`ProdukRepository\` disebut **Repository Pattern** — memisahkan logika akses data dari logika bisnis lainnya, membuat kode lebih rapi dan mudah diuji (dibahas lebih dalam di Bab 79).`
},
{
  id:68, part:"Bagian X — Database & SQL",
  title:"CRUD Lengkap: Update & Delete dengan PDO",
  md:`Melengkapi \`ProdukRepository\` dari halaman sebelumnya dengan operasi **Update** dan **Delete**.

\`\`\`php title=ProdukRepository-lanjutan.php
<?php
class ProdukRepository {
    public function __construct(private PDO $pdo) {}

    // ...create(), findAll(), findById() dari halaman sebelumnya...

    public function update(int $id, array $data): bool {
        $stmt = $this->pdo->prepare(
            "UPDATE produk SET nama = ?, harga = ?, stok = ? WHERE id = ?"
        );
        return $stmt->execute([
            $data['nama'], $data['harga'], $data['stok'], $id
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->pdo->prepare("DELETE FROM produk WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
\`\`\`

\`\`\`php title=pakai-update-delete.php
<?php
$repo = new ProdukRepository($pdo);

$repo->update(16, ['nama' => 'Webcam HD Pro', 'harga' => 320000, 'stok' => 7]);
echo "Produk #16 berhasil diperbarui.\\n";

$repo->delete(16);
echo "Produk #16 berhasil dihapus.";
\`\`\`

\`\`\`output
Produk #16 berhasil diperbarui.
Produk #16 berhasil dihapus.
\`\`\`

Dengan ini, \`ProdukRepository\` sudah mengimplementasikan keempat operasi CRUD secara lengkap: \`create()\`, \`findAll()\`/\`findById()\`, \`update()\`, dan \`delete()\` — pola yang bisa kamu terapkan untuk entitas data apa pun (pengguna, pesanan, artikel, dsb).

> [!TIP] Perhatikan bahwa **setiap** query memakai *prepared statement* dengan placeholder \`?\` — konsisten menerapkan pertahanan SQL Injection yang sudah dipelajari di Bab 48, di setiap titik interaksi dengan database.`
},
{
  id:69, part:"Bagian X — Database & SQL",
  title:"Transaction & Rollback",
  md:`**Transaction** (transaksi database) memastikan sekumpulan operasi database dijalankan **semua-atau-tidak-sama-sekali** — penting ketika beberapa perubahan data harus konsisten satu sama lain.

Contoh klasik: transfer saldo antar rekening bank. Jika saldo pengirim sudah dikurangi tapi saldo penerima gagal ditambahkan (misalnya listrik padam di tengah proses), data akan rusak tanpa transaction.

\`\`\`php title=transfer.php
<?php
function transfer(PDO $pdo, int $dariId, int $keId, float $jumlah): bool {
    try {
        $pdo->beginTransaction();

        $kurangi = $pdo->prepare("UPDATE rekening SET saldo = saldo - ? WHERE id = ?");
        $kurangi->execute([$jumlah, $dariId]);

        $tambah = $pdo->prepare("UPDATE rekening SET saldo = saldo + ? WHERE id = ?");
        $tambah->execute([$jumlah, $keId]);

        $pdo->commit();
        return true;

    } catch (Exception $e) {
        $pdo->rollBack(); // batalkan SEMUA perubahan jika ada yang gagal
        echo "Transfer gagal: " . $e->getMessage();
        return false;
    }
}
\`\`\`

\`\`\`output
Transfer dari rekening #1 ke #2 sebesar Rp500,000 berhasil.
\`\`\`

Tiga perintah kunci transaction di PDO:

| Perintah | Kegunaan |
|---|---|
| \`beginTransaction()\` | mulai "menahan" perubahan, belum permanen |
| \`commit()\` | simpan semua perubahan secara permanen |
| \`rollBack()\` | batalkan semua perubahan sejak \`beginTransaction()\` |

> [!WARN] Tanpa transaction, kegagalan di tengah rangkaian query bisa meninggalkan database dalam keadaan **tidak konsisten** — misalnya saldo hilang tanpa pernah sampai ke penerima. Selalu gunakan transaction untuk operasi yang melibatkan lebih dari satu perubahan data yang saling bergantung.`
},
{
  id:70, part:"Bagian X — Database & SQL",
  title:"Migrasi Skema Sederhana",
  md:`**Migrasi** adalah cara terstruktur untuk mengelola perubahan struktur database (skema) seiring waktu — setiap perubahan (tambah kolom, buat tabel baru, dsb) ditulis sebagai skrip kecil yang bisa dijalankan berurutan dan dilacak riwayatnya.

\`\`\`php title=migrate.php
<?php
class Migrator {
    public function __construct(private PDO $pdo) {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama VARCHAR(255) NOT NULL,
                dijalankan_pada DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }

    public function jalankan(string $nama, string $sql): void {
        $sudah = $this->pdo->prepare("SELECT COUNT(*) FROM migrations WHERE nama = ?");
        $sudah->execute([$nama]);

        if ($sudah->fetchColumn() > 0) {
            echo "Lewati (sudah dijalankan): $nama\\n";
            return;
        }

        $this->pdo->exec($sql);
        $catat = $this->pdo->prepare("INSERT INTO migrations (nama) VALUES (?)");
        $catat->execute([$nama]);
        echo "Berhasil: $nama\\n";
    }
}
\`\`\`

\`\`\`php title=jalankan-migrasi.php
<?php
$migrator = new Migrator($pdo);

$migrator->jalankan(
    '001_buat_tabel_produk',
    'CREATE TABLE produk (id INTEGER PRIMARY KEY, nama TEXT, harga INTEGER)'
);
$migrator->jalankan(
    '002_tambah_kolom_stok',
    'ALTER TABLE produk ADD COLUMN stok INTEGER DEFAULT 0'
);
\`\`\`

\`\`\`output
Berhasil: 001_buat_tabel_produk
Berhasil: 002_tambah_kolom_stok
\`\`\`

Menjalankan skrip di atas untuk kedua kalinya akan mencetak "Lewati (sudah dijalankan)" untuk masing-masing migrasi — sistem mengingat migrasi mana saja yang sudah diterapkan lewat tabel \`migrations\`.

> [!TIP] Proyek PHP skala besar biasanya memakai tool migrasi bawaan framework (Laravel Migrations, Doctrine Migrations) yang jauh lebih lengkap — konsep intinya persis seperti contoh sederhana ini: skrip perubahan skema yang terlacak dan bisa dijalankan ulang dengan aman.`
}
);
