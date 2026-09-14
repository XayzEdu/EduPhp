window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:31, part:"Bagian V — Fungsi",
  title:"Arrow Function",
  md:`Sejak PHP 7.4, **arrow function** (\`fn\`) menawarkan sintaks lebih ringkas untuk closure satu baris. Bedanya dengan closure biasa: variabel luar **otomatis** ditangkap (tak perlu \`use\`), tapi hanya boleh berisi satu ekspresi yang otomatis di-\`return\`.

\`\`\`php title=arrow-function.php
<?php
$pajak = 0.11;

// Closure biasa
$hitungPajakLama = function($harga) use ($pajak) {
    return $harga * $pajak;
};

// Arrow function — lebih ringkas
$hitungPajak = fn($harga) => $harga * $pajak;

echo $hitungPajakLama(100000), "\\n";
echo $hitungPajak(100000), "\\n";
\`\`\`

\`\`\`output
11000
11000
\`\`\`

Arrow function sangat cocok dipakai bersama \`array_map\`, \`array_filter\`, dan \`usort\` — kode jadi lebih padat dan mudah dibaca sebagai satu ekspresi:

\`\`\`php title=arrow-array.php
<?php
$harga = [100000, 250000, 75000];
$denganPajak = array_map(fn($h) => $h * 1.11, $harga);
print_r($denganPajak);
\`\`\`

\`\`\`output
Array
(
    [0] => 111000
    [1] => 277500
    [2] => 83250
)
\`\`\`

| | Closure (\`function\`) | Arrow function (\`fn\`) |
|---|---|---|
| Tangkap variabel luar | manual, pakai \`use\` | otomatis |
| Isi | banyak statement | satu ekspresi |
| \`return\` | wajib ditulis | implisit |`
},
{
  id:32, part:"Bagian V — Fungsi",
  title:"Include, Require & Modularisasi",
  md:`Seiring proyek membesar, kita perlu memecah kode ke banyak berkas. PHP menyediakan empat konstruksi untuk itu: \`include\`, \`include_once\`, \`require\`, dan \`require_once\`.

\`\`\`php title=lib/matematika.php
<?php
function tambah($a, $b) { return $a + $b; }
function kurang($a, $b) { return $a - $b; }
\`\`\`

\`\`\`php title=index.php
<?php
require_once 'lib/matematika.php';

echo tambah(5, 3), "\\n";
echo kurang(5, 3), "\\n";
\`\`\`

\`\`\`output
8
2
\`\`\`

Perbedaan utamanya:

| Konstruksi | Jika berkas tak ditemukan |
|---|---|
| \`include\` | *warning*, skrip tetap lanjut |
| \`require\` | *fatal error*, skrip berhenti |
| \`include_once\` / \`require_once\` | sama seperti di atas, tapi mencegah berkas dimuat dua kali |

> [!TIP] Untuk berkas penting seperti koneksi database atau fungsi inti aplikasi, selalu pakai \`require_once\` — lebih aman karena program langsung berhenti jika ada yang hilang, daripada berjalan dengan keadaan tak lengkap.

Modularisasi seperti ini adalah fondasi dari *autoloading* kelas OOP yang akan kita pelajari di Bagian VII.`
},
{
  id:33, part:"Bagian VI — Web & Form",
  title:"Superglobals",
  md:`**Superglobals** adalah variabel bawaan PHP yang otomatis tersedia di semua *scope* — kamu tidak perlu \`global\` untuk mengaksesnya.

| Superglobal | Isi |
|---|---|
| \`$_GET\` | data dari parameter URL / query string |
| \`$_POST\` | data dari form HTML method POST |
| \`$_REQUEST\` | gabungan \`$_GET\`, \`$_POST\`, \`$_COOKIE\` |
| \`$_SERVER\` | informasi server & request |
| \`$_SESSION\` | data sesi pengguna |
| \`$_COOKIE\` | data cookie browser |
| \`$_FILES\` | berkas yang diunggah |

\`\`\`php title=info-server.php
<?php
echo $_SERVER['REQUEST_METHOD'] . "\\n";
echo $_SERVER['PHP_SELF'] . "\\n";
echo $_SERVER['HTTP_USER_AGENT'] ?? 'Tidak diketahui';
\`\`\`

\`\`\`output
GET
/index.php
Mozilla/5.0 (Windows NT 10.0; Win64; x64)
\`\`\`

Contoh membaca query string dari URL seperti \`halaman.php?nama=Xayz&umur=20\`:

\`\`\`php title=baca-get.php
<?php
$nama = $_GET['nama'] ?? 'Tamu';
$umur = $_GET['umur'] ?? '-';
echo "Nama: $nama, Umur: $umur";
\`\`\`

\`\`\`output
Nama: Xayz, Umur: 20
\`\`\`

> [!WARN] Jangan pernah mempercayai data dari superglobal secara mentah — selalu validasi dan bersihkan (*sanitize*) sebelum dipakai, terutama sebelum ditampilkan kembali ke HTML atau dimasukkan ke query database (dibahas di Bab Keamanan).`
},
{
  id:34, part:"Bagian VI — Web & Form",
  title:"Menangani Form (GET & POST)",
  md:`Form HTML mengirim data ke server menggunakan method \`GET\` (tampil di URL) atau \`POST\` (tersembunyi di body request, cocok untuk data sensitif/besar).

\`\`\`html title=form.html
<form action="proses.php" method="POST">
  <input type="text" name="nama" placeholder="Nama kamu">
  <input type="email" name="email" placeholder="Email">
  <button type="submit">Kirim</button>
</form>
\`\`\`

\`\`\`php title=proses.php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama  = trim($_POST['nama'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if ($nama === '' || $email === '') {
        echo "Nama dan email wajib diisi!";
    } else {
        echo "Terima kasih, $nama! Kami akan menghubungi $email.";
    }
}
\`\`\`

\`\`\`output
Terima kasih, Xayz! Kami akan menghubungi xayz@contoh.com.
\`\`\`

Kapan memilih GET, kapan POST?

| Kriteria | GET | POST |
|---|---|---|
| Terlihat di URL | ya | tidak |
| Batas ukuran data | kecil (~2000 karakter) | besar |
| Cocok untuk | pencarian, filter, paginasi | login, form pendaftaran, unggah file |
| Bisa di-*bookmark* | ya | tidak |

> [!TIP] Selalu periksa \`$_SERVER['REQUEST_METHOD']\` sebelum memproses form — ini mencegah kode berjalan tak sengaja saat halaman pertama kali dibuka (sebelum form dikirim).`
},
{
  id:35, part:"Bagian VI — Web & Form",
  title:"Validasi Input",
  md:`Validasi memastikan data yang dikirim pengguna sesuai format yang diharapkan sebelum diproses lebih lanjut. PHP menyediakan ekstensi **filter** untuk ini.

\`\`\`php title=validasi.php
<?php
$email = "xayz[at]contoh.com";
$umurInput = "20";

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Email valid.\\n";
} else {
    echo "Format email tidak valid.\\n";
}

$umur = filter_var($umurInput, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 120]
]);

echo $umur !== false ? "Umur valid: $umur" : "Umur tidak valid";
\`\`\`

\`\`\`output
Format email tidak valid.
Umur valid: 20
\`\`\`

Validasi manual dengan *regular expression* juga umum dipakai, misalnya memeriksa format nomor telepon Indonesia:

\`\`\`php title=validasi-regex.php
<?php
function isNomorHpValid(string $nomor): bool {
    return (bool) preg_match('/^08[0-9]{8,11}$/', $nomor);
}

var_dump(isNomorHpValid("081234567890"));
var_dump(isNomorHpValid("12345"));
\`\`\`

\`\`\`output
bool(true)
bool(false)
\`\`\`

> [!TIP] Terapkan aturan **validate on server, always** — validasi JavaScript di sisi klien hanya untuk kenyamanan pengguna; validasi PHP di server adalah lapisan wajib karena permintaan HTTP bisa dikirim dari luar form (misalnya lewat cURL) dan melewati JavaScript sepenuhnya.`
},
{
  id:36, part:"Bagian VI — Web & Form",
  title:"Session",
  md:`**Session** menyimpan data pengguna di server selama mereka berinteraksi dengan situs (misalnya status login), diidentifikasi lewat sebuah cookie ID unik yang dikirim otomatis ke browser.

\`\`\`php title=login.php
<?php
session_start(); // wajib dipanggil di baris paling atas

$_SESSION['user'] = "Xayz";
$_SESSION['login_time'] = time();

echo "Sesi dimulai untuk: " . $_SESSION['user'];
\`\`\`

\`\`\`output
Sesi dimulai untuk: Xayz
\`\`\`

Di halaman lain (request terpisah), data sesi tersebut tetap tersedia selama \`session_start()\` dipanggil kembali:

\`\`\`php title=profil.php
<?php
session_start();

if (isset($_SESSION['user'])) {
    echo "Halo kembali, {$_SESSION['user']}!";
} else {
    echo "Silakan login terlebih dahulu.";
}
\`\`\`

\`\`\`output
Halo kembali, Xayz!
\`\`\`

Mengakhiri sesi (logout):

\`\`\`php title=logout.php
<?php
session_start();
session_unset();   // hapus semua data sesi
session_destroy(); // hancurkan sesi di server
echo "Kamu telah logout.";
\`\`\`

\`\`\`output
Kamu telah logout.
\`\`\`

> [!WARN] \`session_start()\` harus dipanggil **sebelum** ada output apa pun (termasuk spasi/baris kosong di luar tag PHP) — jika tidak, PHP akan melempar error "headers already sent".`
},
{
  id:37, part:"Bagian VI — Web & Form",
  title:"Cookie",
  md:`Berbeda dengan session (disimpan di server), **cookie** disimpan langsung di browser pengguna, dan bisa bertahan meski browser ditutup — cocok untuk preferensi jangka panjang seperti "ingat saya" atau tema tampilan.

\`\`\`php title=set-cookie.php
<?php
// setcookie(nama, nilai, waktu_kedaluwarsa)
setcookie("tema", "gelap", time() + (86400 * 30)); // 30 hari
echo "Cookie tema disimpan.";
\`\`\`

\`\`\`output
Cookie tema disimpan.
\`\`\`

Membaca cookie yang sudah tersimpan (pada request berikutnya, karena cookie baru aktif setelah reload):

\`\`\`php title=baca-cookie.php
<?php
$tema = $_COOKIE['tema'] ?? 'terang';
echo "Tema aktif: $tema";
\`\`\`

\`\`\`output
Tema aktif: gelap
\`\`\`

Menghapus cookie dilakukan dengan mengatur waktu kedaluwarsanya ke masa lalu:

\`\`\`php title=hapus-cookie.php
<?php
setcookie("tema", "", time() - 3600);
echo "Cookie tema dihapus.";
\`\`\`

\`\`\`output
Cookie tema dihapus.
\`\`\`

| Aspek | Session | Cookie |
|---|---|---|
| Lokasi penyimpanan | server | browser klien |
| Kapasitas | relatif besar | ~4KB per cookie |
| Keamanan data sensitif | lebih aman | rawan dimanipulasi klien |
| Bertahan setelah browser ditutup | tidak (default) | bisa, sesuai \`expires\` |`
},
{
  id:38, part:"Bagian VI — Web & Form",
  title:"File Handling",
  md:`PHP menyediakan fungsi bawaan untuk membaca dan menulis berkas di server — dasar dari fitur logging, ekspor data, dan cache sederhana.

\`\`\`php title=tulis-file.php
<?php
$data = "Baris pertama\\nBaris kedua\\n";

// Menulis (menimpa isi lama)
file_put_contents('catatan.txt', $data);

// Menambah baris baru tanpa menghapus isi lama
file_put_contents('catatan.txt', "Baris tambahan\\n", FILE_APPEND);

echo "Berkas berhasil ditulis.";
\`\`\`

\`\`\`output
Berkas berhasil ditulis.
\`\`\`

\`\`\`php title=baca-file.php
<?php
$isi = file_get_contents('catatan.txt');
echo $isi;

echo "--- per baris ---\\n";
$baris = file('catatan.txt', FILE_IGNORE_NEW_LINES);
foreach ($baris as $nomor => $teks) {
    echo ($nomor + 1) . ". $teks\\n";
}
\`\`\`

\`\`\`output
Baris pertama
Baris kedua
Baris tambahan
--- per baris ---
1. Baris pertama
2. Baris kedua
3. Baris tambahan
\`\`\`

Fungsi pendukung lain yang berguna: \`file_exists()\` untuk memeriksa keberadaan berkas, \`unlink()\` untuk menghapus, dan \`is_writable()\` untuk memeriksa izin tulis.

> [!WARN] Selalu validasi nama/path berkas yang berasal dari input pengguna sebelum dipakai di fungsi file — tanpa validasi, celah *path traversal* (mengakses berkas di luar folder yang dimaksud) bisa dieksploitasi.`
},
{
  id:39, part:"Bagian VI — Web & Form",
  title:"Upload File",
  md:`Mengunggah berkas memerlukan atribut \`enctype="multipart/form-data"\` pada form HTML, dan diproses lewat superglobal \`$_FILES\`.

\`\`\`html title=form-upload.html
<form action="upload.php" method="POST" enctype="multipart/form-data">
  <input type="file" name="foto">
  <button type="submit">Unggah</button>
</form>
\`\`\`

\`\`\`php title=upload.php
<?php
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $ekstensiValid = ['jpg', 'jpeg', 'png'];
    $namaAsli = $_FILES['foto']['name'];
    $ekstensi = strtolower(pathinfo($namaAsli, PATHINFO_EXTENSION));

    if (!in_array($ekstensi, $ekstensiValid)) {
        echo "Hanya file JPG/PNG yang diizinkan.";
    } elseif ($_FILES['foto']['size'] > 2 * 1024 * 1024) {
        echo "Ukuran file maksimal 2MB.";
    } else {
        $namaBaru = uniqid('foto_') . '.' . $ekstensi;
        move_uploaded_file($_FILES['foto']['tmp_name'], "uploads/$namaBaru");
        echo "File berhasil diunggah sebagai: $namaBaru";
    }
}
\`\`\`

\`\`\`output
File berhasil diunggah sebagai: foto_650f3a1b2c9de.png
\`\`\`

Struktur data \`$_FILES['foto']\` berisi beberapa informasi penting:

| Kunci | Isi |
|---|---|
| \`name\` | nama asli berkas |
| \`type\` | tipe MIME (bisa dipalsukan, jangan 100% dipercaya) |
| \`tmp_name\` | lokasi sementara di server |
| \`error\` | kode error (\`0\` = sukses) |
| \`size\` | ukuran dalam byte |

> [!WARN] Selalu validasi **ekstensi, ukuran, dan idealnya isi/MIME asli** berkas sebelum menyimpannya secara permanen — jangan pernah percaya nama atau tipe berkas dari klien begitu saja.`
},
{
  id:40, part:"Bagian VII — OOP",
  title:"Class & Object",
  md:`**Pemrograman Berorientasi Objek (OOP)** memodelkan kode sebagai kumpulan objek yang punya data (properti) dan perilaku (method). \`class\` adalah cetak biru; \`object\` adalah *instance* nyata dari cetak biru itu.

\`\`\`php title=class-dasar.php
<?php
class Mobil {
    public string $merek;
    public int $tahun;

    public function info(): string {
        return "{$this->merek} ({$this->tahun})";
    }
}

$mobil1 = new Mobil();
$mobil1->merek = "Toyota";
$mobil1->tahun = 2023;

echo $mobil1->info();
\`\`\`

\`\`\`output
Toyota (2023)
\`\`\`

\`$this\` di dalam method merujuk ke objek yang sedang dipakai — memungkinkan method mengakses properti objek itu sendiri.

Kamu bisa membuat banyak objek dari satu class, masing-masing dengan datanya sendiri (*independen*):

\`\`\`php title=multi-object.php
<?php
$mobil2 = new Mobil();
$mobil2->merek = "Honda";
$mobil2->tahun = 2021;

echo $mobil1->info() . "\\n";
echo $mobil2->info();
\`\`\`

\`\`\`output
Toyota (2023)
Honda (2021)
\`\`\`

> [!TIP] Analogi sederhana: \`class Mobil\` adalah **cetak biru desain mobil**, sedangkan \`$mobil1\` dan \`$mobil2\` adalah **mobil fisik** hasil produksi dari cetak biru yang sama — bentuknya sama, tapi warna/pemiliknya bisa berbeda.`
}
);
