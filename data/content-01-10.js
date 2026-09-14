window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:1, part:"Bagian I — Pengantar",
  title:"Sejarah Singkat PHP",
  md:`PHP (**Hypertext Preprocessor**, awalnya *Personal Home Page*) diciptakan oleh **Rasmus Lerdorf** pada tahun 1994 sebagai kumpulan skrip CGI sederhana untuk memantau siapa yang mengunjungi resume daringnya. Dari alat kecil itu, PHP tumbuh menjadi bahasa pemrograman sisi-server (*server-side*) paling populer di web.

Beberapa tonggak penting:

- **PHP/FI (1995)** — versi awal yang bisa memproses form HTML.
- **PHP 3 (1998)** — ditulis ulang total, menjadi bahasa yang sesungguhnya.
- **PHP 5 (2004)** — memperkenalkan OOP modern (kelas, interface, exception).
- **PHP 7 (2015)** — lompatan performa besar (2x lebih cepat dari PHP 5).
- **PHP 8.x (2020–sekarang)** — JIT compiler, *union types*, *attributes*, *enum*, dan *named arguments*.

> [!TIP] PHP menjalankan sebagian besar web dunia — termasuk WordPress, Wikipedia, dan Facebook (versi awal) dibangun di atas PHP.

Buku ini akan membawamu dari nol: mulai dari sintaks paling dasar, struktur data, fungsi, pemrograman berorientasi objek (OOP), hingga koneksi database dan keamanan aplikasi web.`
},
{
  id:2, part:"Bagian I — Pengantar",
  title:"Apa itu PHP & Cara Kerjanya",
  md:`PHP adalah bahasa skrip **sisi server**. Artinya, kode PHP dijalankan di server sebelum hasilnya (biasanya HTML) dikirim ke *browser* pengguna. Browser tidak pernah melihat kode PHP itu sendiri — ia hanya menerima output-nya.

Alur kerjanya sederhana:

1. Pengguna membuka URL seperti \`toko.com/index.php\`.
2. Server web (Apache/Nginx) meneruskan berkas \`.php\` ke *PHP interpreter*.
3. Interpreter menjalankan kode, mungkin mengambil data dari database.
4. Hasilnya berupa teks/HTML dikirim kembali ke browser.

\`\`\`php title=index.php
<!DOCTYPE html>
<html>
<body>
  <h1>Selamat datang!</h1>
  <p>Sekarang jam server menunjukkan: <?php echo date("H:i:s"); ?></p>
</body>
</html>
\`\`\`

\`\`\`output
Selamat datang!
Sekarang jam server menunjukkan: 14:32:07
\`\`\`

Perhatikan: yang sampai ke browser hanyalah HTML biasa — tag \`<?php ... ?>\` sudah lenyap, digantikan hasil eksekusinya. Inilah sebabnya PHP disebut *server-side scripting language*, berbeda dengan JavaScript yang (secara default) berjalan di browser pengguna.`
},
{
  id:3, part:"Bagian I — Pengantar",
  title:"Instalasi & Menjalankan PHP",
  md:`Untuk mencoba semua contoh di buku ini, kamu memerlukan PHP terpasang di komputer. Ada beberapa cara populer:

- **XAMPP / Laragon (Windows)** — paket siap pakai berisi PHP, Apache, dan MySQL.
- **Homebrew (macOS)** — \`brew install php\`
- **APT (Ubuntu/Debian)** — \`sudo apt install php\`

Setelah terpasang, PHP menyediakan *built-in web server* sehingga kamu tidak perlu Apache untuk belajar:

\`\`\`bash title=terminal
php -S localhost:8000
\`\`\`

\`\`\`output
[Mon Sep 14 10:00:00 2026] PHP 8.3.0 Development Server (http://localhost:8000) started
\`\`\`

Buka \`http://localhost:8000\` di browser, dan folder aktifmu akan disajikan sebagai website. Untuk menguji versi PHP yang terpasang, jalankan:

\`\`\`bash title=terminal
php -v
\`\`\`

\`\`\`output
PHP 8.3.0 (cli) (built: Nov 23 2025 09:12:41) (NTS)
\`\`\`

> [!TIP] Semua contoh di buku ini kompatibel dengan PHP 8.0 ke atas. Beberapa fitur (seperti *enum* dan *readonly property*) memerlukan PHP 8.1+.`
},
{
  id:4, part:"Bagian I — Pengantar",
  title:"Syntax Dasar & Tag PHP",
  md:`Setiap blok kode PHP diapit oleh tag pembuka \`<?php\` dan penutup \`?>\`. Di dalam tag inilah interpreter tahu bahwa teks tersebut harus dieksekusi, bukan ditampilkan apa adanya.

\`\`\`php title=dasar.php
<?php
  // Ini adalah pernyataan (statement) PHP
  echo "Halo, dunia!";
?>
\`\`\`

\`\`\`output
Halo, dunia!
\`\`\`

Aturan dasar yang wajib diingat:

- Setiap **statement** diakhiri dengan titik koma \`;\`.
- PHP **case-sensitive** untuk nama variabel, tapi **tidak** untuk nama fungsi/keyword bawaan.
- Jika berkas hanya berisi kode PHP murni, tag penutup \`?>\` boleh dihilangkan — praktik ini justru dianjurkan untuk menghindari *whitespace* tak sengaja setelahnya.
- PHP bisa disisipkan di mana saja di dalam HTML, keluar-masuk tag sesuka hati:

\`\`\`php title=campuran.php
<ul>
<?php for ($i = 1; $i <= 3; $i++): ?>
  <li>Item ke-<?= $i ?></li>
<?php endfor; ?>
</ul>
\`\`\`

\`\`\`output
<ul>
  <li>Item ke-1</li>
  <li>Item ke-2</li>
  <li>Item ke-3</li>
</ul>
\`\`\`

Notasi \`<?= $i ?>\` adalah singkatan dari \`<?php echo $i; ?>\` — sangat berguna saat menyisipkan nilai di tengah HTML (disebut *template syntax*).`
},
{
  id:5, part:"Bagian I — Pengantar",
  title:"Komentar, echo, dan print",
  md:`Komentar tidak dieksekusi oleh interpreter; gunanya murni untuk dokumentasi bagi manusia.

\`\`\`php title=komentar.php
<?php
// Komentar satu baris (gaya C++)
# Komentar satu baris (gaya shell)

/*
  Komentar
  banyak baris
*/

echo "Kode tetap jalan setelah komentar";
\`\`\`

Untuk menampilkan output, PHP menyediakan dua konstruksi bahasa (bukan fungsi sungguhan): \`echo\` dan \`print\`.

| Aspek | \`echo\` | \`print\` |
|---|---|---|
| Nilai kembali | tidak ada | selalu \`1\` |
| Argumen jamak | bisa, dipisah koma | hanya satu |
| Kecepatan | sedikit lebih cepat | sedikit lebih lambat |

\`\`\`php title=echo-print.php
<?php
echo "Halo", " ", "Dunia", "!\\n";
print "Ini juga tampil.\\n";

$hasil = print "Print mengembalikan nilai.\\n";
echo "Nilai kembali print: $hasil";
\`\`\`

\`\`\`output
Halo Dunia!
Ini juga tampil.
Print mengembalikan nilai.
Nilai kembali print: 1
\`\`\`

> [!TIP] Untuk debugging cepat, gunakan \`var_dump()\` atau \`print_r()\` — keduanya menampilkan struktur dan tipe data suatu variabel secara rinci, sangat berguna saat memeriksa array atau objek.`
},
{
  id:6, part:"Bagian II — Data & Variabel",
  title:"Variabel di PHP",
  md:`Variabel adalah "wadah" untuk menyimpan nilai. Di PHP, nama variabel selalu diawali tanda dolar (\`$\`), diikuti huruf atau garis bawah, lalu boleh kombinasi huruf/angka/garis bawah.

\`\`\`php title=variabel.php
<?php
$nama = "Xayz";
$umur = 20;
$tinggiCm = 170.5;
$_status = true;

echo "Nama: $nama, Umur: $umur tahun";
\`\`\`

\`\`\`output
Nama: Xayz, Umur: 20 tahun
\`\`\`

Aturan penamaan variabel:

- **Wajib** diawali \`$\` lalu huruf atau \`_\` (tidak boleh diawali angka).
- **Case-sensitive**: \`$umur\` dan \`$Umur\` adalah dua variabel berbeda.
- PHP bersifat **dynamically typed** — kamu tidak perlu mendeklarasikan tipe data secara eksplisit; tipe ditentukan otomatis dari nilai yang diberikan, dan bisa berubah kapan saja.

\`\`\`php title=dinamis.php
<?php
$data = 100;        // integer
echo gettype($data) . "\\n";

$data = "seratus";  // sekarang jadi string
echo gettype($data) . "\\n";
\`\`\`

\`\`\`output
integer
string
\`\`\`

> [!WARN] Variabel yang belum diberi nilai dan dipakai langsung akan memicu *warning* "Undefined variable" di PHP 8. Selalu inisialisasi variabel sebelum digunakan.`
},
{
  id:7, part:"Bagian II — Data & Variabel",
  title:"Tipe Data di PHP",
  md:`PHP memiliki delapan tipe data dasar, terbagi dalam tiga kelompok:

**Tipe skalar** — \`int\`, \`float\`, \`string\`, \`bool\`
**Tipe majemuk** — \`array\`, \`object\`
**Tipe khusus** — \`null\`, \`resource\`

\`\`\`php title=tipe-data.php
<?php
$umur      = 25;            // int
$berat     = 62.5;          // float (double)
$nama      = "Budi";        // string
$aktif     = true;          // bool
$hobi      = ["baca","kode"]; // array
$kosong    = null;          // null

var_dump($umur, $berat, $nama, $aktif);
\`\`\`

\`\`\`output
int(25)
float(62.5)
string(4) "Budi"
bool(true)
\`\`\`

Gunakan \`gettype()\` untuk mengecek tipe, atau fungsi \`is_*\` untuk memvalidasi tipe tertentu:

\`\`\`php title=cek-tipe.php
<?php
$x = 42;
if (is_int($x)) {
    echo "\\$x adalah bilangan bulat";
}
\`\`\`

\`\`\`output
$x adalah bilangan bulat
\`\`\`

Sejak PHP 7, kamu juga bisa menambahkan **type hint** pada parameter fungsi dan properti kelas agar tipe data lebih ketat dan mudah dilacak — dibahas lebih lanjut di bab Fungsi.`
},
{
  id:8, part:"Bagian II — Data & Variabel",
  title:"Konstanta",
  md:`Konstanta menyimpan nilai yang **tidak boleh berubah** setelah didefinisikan. Ada dua cara mendefinisikannya: fungsi \`define()\` atau kata kunci \`const\`.

\`\`\`php title=konstanta.php
<?php
define("PI", 3.14159);
const NAMA_APLIKASI = "XayzEduPhp";

echo PI . "\\n";
echo NAMA_APLIKASI . "\\n";

// PI = 3.14; // Error: tidak bisa diubah!
\`\`\`

\`\`\`output
3.14159
XayzEduPhp
\`\`\`

Perbedaan \`define()\` dan \`const\`:

| Aspek | \`define()\` | \`const\` |
|---|---|---|
| Dievaluasi saat | runtime | compile-time |
| Bisa dipakai bersyarat (dalam \`if\`) | ✅ | ❌ |
| Bisa jadi konstanta kelas | ❌ | ✅ |
| Penamaan | fungsi biasa | huruf besar konvensi |

Konvensi penulisan nama konstanta menggunakan **UPPER_SNAKE_CASE** agar mudah dibedakan dari variabel biasa saat membaca kode.

> [!TIP] PHP juga menyediakan konstanta bawaan seperti \`PHP_VERSION\`, \`PHP_EOL\`, dan \`__DIR__\` yang sangat berguna untuk keperluan sistem.`
},
{
  id:9, part:"Bagian II — Data & Variabel",
  title:"Operator Aritmatika",
  md:`Operator aritmatika digunakan untuk melakukan perhitungan matematis dasar.

\`\`\`php title=aritmatika.php
<?php
$a = 10;
$b = 3;

echo $a + $b, "\\n";  // penjumlahan
echo $a - $b, "\\n";  // pengurangan
echo $a * $b, "\\n";  // perkalian
echo $a / $b, "\\n";  // pembagian
echo $a % $b, "\\n";  // modulus (sisa bagi)
echo $a ** $b, "\\n"; // pangkat
\`\`\`

\`\`\`output
13
7
30
3.3333333333333
1
1000
\`\`\`

Secara matematis, operator modulus mencari sisa dari pembagian bulat: jika $a = qb + r$ dengan $0 \\le r < b$, maka \`$a % $b\` menghasilkan $r$. Untuk contoh di atas: $10 = 3 \\times 3 + 1$, sehingga hasilnya $1$.

Operator pangkat \`**\` menghitung $a^b$, ditulis sebagai:

$$a^{b} = \\underbrace{a \\times a \\times \\cdots \\times a}_{b \\text{ kali}}$$

PHP juga menyediakan operator increment/decrement pintas:

\`\`\`php title=increment.php
<?php
$n = 5;
echo $n++, "\\n"; // post-increment: cetak 5, lalu $n jadi 6
echo $n, "\\n";   // 6
echo ++$n, "\\n"; // pre-increment: $n jadi 7, lalu cetak 7
\`\`\`

\`\`\`output
5
6
7
\`\`\``
},
{
  id:10, part:"Bagian II — Data & Variabel",
  title:"Operator Perbandingan & Logika",
  md:`Operator perbandingan menghasilkan nilai boolean (\`true\`/\`false\`).

\`\`\`php title=perbandingan.php
<?php
var_dump(5 == "5");   // sama nilai (loose)
var_dump(5 === "5");  // sama nilai & tipe (strict)
var_dump(5 != 4);
var_dump(5 <=> 8);    // spaceship: -1, 0, atau 1
\`\`\`

\`\`\`output
bool(true)
bool(false)
bool(true)
int(-1)
\`\`\`

> [!WARN] \`==\` (loose comparison) melakukan konversi tipe otomatis sebelum membandingkan, yang kadang memberi hasil tak terduga (misalnya \`"0" == false\` bernilai \`true\`). Untuk kode yang aman, **biasakan memakai \`===\` dan \`!==\`**.

Operator logika menggabungkan beberapa kondisi boolean:

\`\`\`php title=logika.php
<?php
$umur = 20;
$punyaKTP = true;

if ($umur >= 17 && $punyaKTP) {
    echo "Boleh memilih.\\n";
}

if ($umur < 13 || $umur > 60) {
    echo "Kategori khusus.\\n";
} else {
    echo "Kategori umum.\\n";
}
\`\`\`

\`\`\`output
Boleh memilih.
Kategori umum.
\`\`\`

Tabel kebenaran singkat untuk \`&&\` (AND) dan \`||\` (OR):

| A | B | A && B | A \\|\\| B |
|---|---|---|---|
| true | true | true | true |
| true | false | false | true |
| false | false | false | false |`
}
);
