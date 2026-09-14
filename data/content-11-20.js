window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:11, part:"Bagian II — Data & Variabel",
  title:"Operator Assignment & Precedence",
  md:`Operator *assignment* (\`=\`) memberi nilai ke variabel. PHP menyediakan bentuk pintas yang menggabungkan operasi dan assignment sekaligus.

\`\`\`php title=assignment.php
<?php
$total = 10;
$total += 5;   // sama dengan: $total = $total + 5
$total -= 2;
$total *= 3;
$total .= " poin"; // penggabungan string

echo $total;
\`\`\`

\`\`\`output
39 poin
\`\`\`

**Precedence** (urutan pengerjaan operator) menentukan operator mana dieksekusi lebih dulu ketika beberapa operator muncul dalam satu ekspresi — mirip aturan "kali/bagi dulu, baru tambah/kurang" di matematika: $2 + 3 \\times 4 = 14$, bukan $20$.

\`\`\`php title=precedence.php
<?php
echo 2 + 3 * 4, "\\n";   // 14, bukan 20
echo (2 + 3) * 4, "\\n"; // 20, tanda kurung mengubah urutan
\`\`\`

\`\`\`output
14
20
\`\`\`

> [!TIP] Saat ekspresi terasa ambigu, gunakan tanda kurung eksplisit — kode yang jelas lebih penting daripada menghafal seluruh tabel precedence.`
},
{
  id:12, part:"Bagian II — Data & Variabel",
  title:"Type Casting & Type Juggling",
  md:`**Type juggling** adalah konversi tipe data otomatis yang dilakukan PHP saat diperlukan konteks tertentu. **Type casting** adalah versi manual, ketika kita eksplisit meminta konversi tipe.

\`\`\`php title=juggling.php
<?php
$hasil = "5" + 3;      // string dikonversi ke int otomatis
var_dump($hasil);

$teks = "Umur: " . 25;  // int dikonversi ke string otomatis
echo $teks;
\`\`\`

\`\`\`output
int(8)
Umur: 25
\`\`\`

Casting manual menggunakan tanda kurung berisi nama tipe:

\`\`\`php title=casting.php
<?php
$angkaTeks = "42.9";

$i = (int) $angkaTeks;
$f = (float) $angkaTeks;
$b = (bool) $angkaTeks;
$s = (string) 100;

var_dump($i, $f, $b, $s);
\`\`\`

\`\`\`output
int(42)
float(42.9)
bool(true)
string(3) "100"
\`\`\`

> [!WARN] Nilai yang dianggap "falsy" (setara \`false\` saat di-cast ke bool) adalah: \`0\`, \`0.0\`, \`""\`, \`"0"\`, \`[]\`, dan \`null\`. Selain itu semua dianggap "truthy". Ini sering jadi sumber bug bila tidak diperhatikan, terutama string \`"0"\`.`
},
{
  id:13, part:"Bagian III — String & Array",
  title:"String Dasar",
  md:`String adalah rangkaian karakter. PHP mendukung dua gaya penulisan utama: petik tunggal dan petik ganda.

\`\`\`php title=string.php
<?php
$nama = "Xayz";

$tunggal = 'Halo, $nama!';   // literal, variabel TIDAK diproses
$ganda   = "Halo, $nama!";   // variabel diproses (interpolasi)

echo $tunggal, "\\n";
echo $ganda, "\\n";

// Penggabungan dengan operator titik
echo "Panjang string: " . strlen($nama) . " karakter";
\`\`\`

\`\`\`output
Halo, $nama!
Halo, Xayz!
Panjang string: 4 karakter
\`\`\`

Untuk ekspresi lebih kompleks di dalam string ganda, bungkus dengan kurung kurawal:

\`\`\`php title=heredoc.php
<?php
$user = ["nama" => "Rani"];
echo "Halo, {$user['nama']}!\\n";

// Heredoc — cocok untuk teks panjang bercampur variabel
$pesan = <<<TEKS
Yth. {$user['nama']},
Terima kasih telah mendaftar di XayzEduPhp.
TEKS;
echo $pesan;
\`\`\`

\`\`\`output
Halo, Rani!
Yth. Rani,
Terima kasih telah mendaftar di XayzEduPhp.
\`\`\`

> [!TIP] Gunakan petik tunggal jika string tidak memuat variabel — sedikit lebih cepat karena PHP tidak perlu memeriksa interpolasi.`
},
{
  id:14, part:"Bagian III — String & Array",
  title:"Fungsi String Populer",
  md:`PHP menyediakan ratusan fungsi bawaan untuk memanipulasi string. Berikut yang paling sering dipakai sehari-hari.

\`\`\`php title=fungsi-string.php
<?php
$kalimat = "  Belajar PHP itu Menyenangkan  ";

echo strlen($kalimat), "\\n";                 // panjang string
echo trim($kalimat), "\\n";                   // hapus spasi tepi
echo strtolower($kalimat), "\\n";              // huruf kecil semua
echo strtoupper($kalimat), "\\n";              // huruf besar semua
echo str_replace("Menyenangkan", "Seru", $kalimat), "\\n";
echo substr(trim($kalimat), 0, 7), "\\n";      // ambil sebagian
echo str_contains($kalimat, "PHP") ? "ada" : "tidak", "\\n";
print_r(explode(" ", trim($kalimat)));
\`\`\`

\`\`\`output
33
Belajar PHP itu Menyenangkan
  belajar php itu menyenangkan  
  BELAJAR PHP ITU MENYENANGKAN  
  Belajar PHP itu Seru  
Belajar
ada
Array
(
    [0] => Belajar
    [1] => PHP
    [2] => itu
    [3] => Menyenangkan
)
\`\`\`

Ringkasan fungsi penting:

| Fungsi | Kegunaan |
|---|---|
| \`strlen()\` | menghitung panjang karakter |
| \`trim() / ltrim() / rtrim()\` | menghapus spasi/karakter tepi |
| \`str_replace()\` | mengganti substring |
| \`explode() / implode()\` | pecah string ↔ gabung array |
| \`sprintf()\` | format string terstruktur |
| \`str_pad()\` | menambah padding karakter |`
},
{
  id:15, part:"Bagian III — String & Array",
  title:"Array Terindeks",
  md:`Array adalah struktur data yang menyimpan banyak nilai dalam satu variabel. **Array terindeks** menggunakan kunci berupa angka, dimulai dari \`0\`.

\`\`\`php title=array-indeks.php
<?php
$buah = ["Apel", "Jeruk", "Mangga"];

echo $buah[0], "\\n";
echo $buah[2], "\\n";
echo count($buah), "\\n"; // jumlah elemen

$buah[] = "Nanas"; // menambah elemen di akhir
print_r($buah);
\`\`\`

\`\`\`output
Apel
Mangga
3
Array
(
    [0] => Apel
    [1] => Jeruk
    [2] => Mangga
    [3] => Nanas
)
\`\`\`

Secara visual, indeks array bekerja seperti ini:

\`\`\`output
Indeks:  0        1        2        3
Isi   :  "Apel"   "Jeruk"  "Mangga" "Nanas"
\`\`\`

Mengakses indeks yang tidak ada akan memicu *warning* "Undefined array key". Gunakan \`isset()\` atau \`array_key_exists()\` untuk memeriksa keberadaan indeks sebelum mengaksesnya secara aman.

\`\`\`php title=cek-indeks.php
<?php
$angka = [10, 20, 30];
echo isset($angka[5]) ? "ada" : "tidak ada elemen ke-5";
\`\`\`

\`\`\`output
tidak ada elemen ke-5
\`\`\``
},
{
  id:16, part:"Bagian III — String & Array",
  title:"Array Asosiatif",
  md:`**Array asosiatif** menggunakan kunci (key) berupa string yang kita tentukan sendiri, bukan angka otomatis — mirip struktur *key-value* seperti kamus.

\`\`\`php title=array-asosiatif.php
<?php
$mahasiswa = [
    "nama"   => "Dewi",
    "nim"    => "220112345",
    "jurusan"=> "Informatika",
    "ipk"    => 3.75,
];

echo "{$mahasiswa['nama']} (NIM {$mahasiswa['nim']})\\n";
echo "IPK: {$mahasiswa['ipk']}\\n";

foreach ($mahasiswa as $kunci => $nilai) {
    echo "$kunci: $nilai\\n";
}
\`\`\`

\`\`\`output
Dewi (NIM 220112345)
IPK: 3.75
nama: Dewi
nim: 220112345
jurusan: Informatika
ipk: 3.75
\`\`\`

Kamu bisa menambah atau mengubah elemen langsung dengan kuncinya:

\`\`\`php title=ubah-asosiatif.php
<?php
$mahasiswa["semester"] = 5;   // tambah kunci baru
$mahasiswa["ipk"] = 3.8;      // ubah nilai yang ada
unset($mahasiswa["jurusan"]); // hapus kunci
print_r($mahasiswa);
\`\`\`

\`\`\`output
Array
(
    [nama] => Dewi
    [nim] => 220112345
    [ipk] => 3.8
    [semester] => 5
)
\`\`\`

> [!TIP] Array asosiatif sangat umum dipakai untuk merepresentasikan satu "baris data", mirip objek JSON — memudahkan pertukaran data dengan API atau database.`
},
{
  id:17, part:"Bagian III — String & Array",
  title:"Array Multidimensi",
  md:`Array multidimensi adalah array yang elemennya berupa array lain — cocok untuk merepresentasikan tabel data atau daftar objek.

\`\`\`php title=array-multi.php
<?php
$pegawai = [
    ["nama" => "Andi",  "gaji" => 5000000],
    ["nama" => "Bella", "gaji" => 6200000],
    ["nama" => "Citra", "gaji" => 4800000],
];

foreach ($pegawai as $index => $p) {
    echo ($index + 1) . ". {$p['nama']} — Rp" . number_format($p['gaji']) . "\\n";
}
\`\`\`

\`\`\`output
1. Andi — Rp5,000,000
2. Bella — Rp6,200,000
3. Citra — Rp4,800,000
\`\`\`

Mengakses elemen array bersarang dilakukan dengan merangkai kurung siku:

\`\`\`php title=akses-bersarang.php
<?php
$sekolah = [
    "kelas10" => ["Ani", "Budi"],
    "kelas11" => ["Coki", "Dini", "Eko"],
];

echo $sekolah["kelas11"][2]; // "Eko"
\`\`\`

\`\`\`output
Eko
\`\`\`

Array multidimensi sering muncul sebagai hasil query database (setiap baris tabel menjadi satu array asosiatif di dalam array besar) — pola inilah yang akan sering kamu temui di bab PHP + MySQL nanti.`
},
{
  id:18, part:"Bagian III — String & Array",
  title:"Fungsi Array (map, filter, sort)",
  md:`PHP menyediakan fungsi *higher-order* untuk mengolah array tanpa menulis loop manual — gaya pemrograman fungsional yang ringkas dan mudah dibaca.

\`\`\`php title=array-functional.php
<?php
$angka = [1, 2, 3, 4, 5, 6, 7, 8];

// map: ubah setiap elemen
$kuadrat = array_map(fn($n) => $n * $n, $angka);

// filter: saring elemen sesuai kondisi
$genap = array_filter($angka, fn($n) => $n % 2 === 0);

// reduce: gabungkan semua elemen jadi satu nilai
$total = array_reduce($angka, fn($carry, $n) => $carry + $n, 0);

print_r($kuadrat);
print_r(array_values($genap));
echo "Total: $total\\n";
\`\`\`

\`\`\`output
Array
(
    [0] => 1
    [1] => 4
    [2] => 9
    [3] => 16
    [4] => 25
    [5] => 36
    [6] => 49
    [7] => 64
)
Array
(
    [0] => 2
    [1] => 4
    [2] => 6
    [3] => 8
)
Total: 36
\`\`\`

Fungsi pengurutan yang umum dipakai:

| Fungsi | Kegunaan |
|---|---|
| \`sort()\` | urutkan naik, indeks direset |
| \`rsort()\` | urutkan turun, indeks direset |
| \`asort()\` | urutkan naik, kunci dipertahankan |
| \`ksort()\` | urutkan berdasar kunci |
| \`usort()\` | urutkan dengan fungsi kustom |

\`\`\`php title=usort.php
<?php
$siswa = [["nama"=>"Budi","nilai"=>80], ["nama"=>"Ani","nilai"=>95]];
usort($siswa, fn($a, $b) => $b['nilai'] <=> $a['nilai']);
echo $siswa[0]['nama']; // Ani, nilai tertinggi
\`\`\`

\`\`\`output
Ani
\`\`\``
},
{
  id:19, part:"Bagian III — String & Array",
  title:"Studi Kasus: Mengolah Data Array",
  md:`Mari gabungkan semua konsep array menjadi satu studi kasus praktis: menghitung ringkasan nilai ujian sekelompok siswa.

\`\`\`php title=studi-kasus-array.php
<?php
$nilai = [
    ["nama" => "Fajar", "skor" => 78],
    ["nama" => "Gita",  "skor" => 92],
    ["nama" => "Hana",  "skor" => 65],
    ["nama" => "Ivan",  "skor" => 88],
];

$skorSaja = array_column($nilai, 'skor');
$rataRata = array_sum($skorSaja) / count($skorSaja);
$tertinggi = max($skorSaja);
$lulus = array_filter($nilai, fn($s) => $s['skor'] >= 75);

echo "Rata-rata kelas: " . round($rataRata, 2) . "\\n";
echo "Skor tertinggi : $tertinggi\\n";
echo "Jumlah lulus   : " . count($lulus) . " siswa\\n";
echo "Daftar lulus:\\n";
foreach ($lulus as $s) {
    echo "- {$s['nama']} ({$s['skor']})\\n";
}
\`\`\`

\`\`\`output
Rata-rata kelas: 80.75
Skor tertinggi : 92
Jumlah lulus   : 3 siswa
Daftar lulus:
- Fajar (78)
- Gita (92)
- Ivan (88)
\`\`\`

Perhatikan bagaimana \`array_column()\`, \`array_sum()\`, \`max()\`, dan \`array_filter()\` saling melengkapi — inilah kekuatan array di PHP: mengubah puluhan baris logika manual menjadi beberapa baris deklaratif yang mudah dibaca.`
},
{
  id:20, part:"Bagian IV — Kontrol Alur",
  title:"If, Else, dan Elseif",
  md:`Struktur kontrol \`if\` memungkinkan program mengambil keputusan berdasarkan kondisi boolean.

\`\`\`php title=if-else.php
<?php
$nilai = 82;

if ($nilai >= 90) {
    echo "Grade A";
} elseif ($nilai >= 80) {
    echo "Grade B";
} elseif ($nilai >= 70) {
    echo "Grade C";
} else {
    echo "Grade D";
}
\`\`\`

\`\`\`output
Grade B
\`\`\`

PHP mengevaluasi kondisi **dari atas ke bawah**, dan berhenti di kondisi pertama yang bernilai \`true\`. Jika tidak ada satupun yang cocok, blok \`else\` (opsional) dijalankan.

Untuk template HTML, tersedia sintaks alternatif tanpa kurung kurawal yang lebih rapi saat dicampur markup:

\`\`\`php title=alt-syntax.php
<?php $status = "aktif"; ?>
<p>
<?php if ($status === "aktif"): ?>
  Akun kamu aktif.
<?php else: ?>
  Akun kamu nonaktif.
<?php endif; ?>
</p>
\`\`\`

\`\`\`output
<p>
  Akun kamu aktif.
</p>
\`\`\`

> [!TIP] Hindari menumpuk (*nesting*) terlalu banyak \`if\` bersarang — biasanya bisa disederhanakan dengan \`elseif\`, \`switch\`, atau *early return* di dalam fungsi.`
}
);
