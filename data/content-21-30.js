window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:21, part:"Bagian IV — Kontrol Alur",
  title:"Switch Case",
  md:`\`switch\` adalah alternatif \`if-elseif\` bertingkat ketika kita membandingkan satu variabel dengan banyak nilai yang mungkin.

\`\`\`php title=switch.php
<?php
$hari = 3;

switch ($hari) {
    case 1:
        echo "Senin";
        break;
    case 2:
        echo "Selasa";
        break;
    case 3:
        echo "Rabu";
        break;
    default:
        echo "Hari tidak dikenal";
}
\`\`\`

\`\`\`output
Rabu
\`\`\`

> [!WARN] Jangan lupa \`break;\` di setiap \`case\`! Tanpa \`break\`, eksekusi akan "jatuh" (*fall-through*) ke \`case\` berikutnya secara berurutan — terkadang ini sengaja dimanfaatkan, tapi sering jadi sumber bug tak disengaja.

Sejak PHP 8.0, tersedia \`match\` — versi \`switch\` yang lebih ringkas, memakai perbandingan **strict** (\`===\`) secara otomatis dan mengembalikan nilai langsung:

\`\`\`php title=match.php
<?php
$hari = 3;

$namaHari = match($hari) {
    1, 7 => "Akhir pekan berdekatan",
    2, 3, 4, 5, 6 => "Hari kerja",
    default => "Tidak diketahui",
};

echo $namaHari;
\`\`\`

\`\`\`output
Hari kerja
\`\`\`

\`match\` tidak memerlukan \`break\` dan akan melempar error jika tidak ada \`case\` yang cocok dan tidak ada \`default\` — membuatnya lebih aman dari bug *fall-through*.`
},
{
  id:22, part:"Bagian IV — Kontrol Alur",
  title:"Ternary & Null Coalescing",
  md:`Operator **ternary** (\`? :\`) menulis \`if-else\` sederhana dalam satu baris.

\`\`\`php title=ternary.php
<?php
$umur = 16;
$status = ($umur >= 18) ? "Dewasa" : "Anak-anak";
echo $status;
\`\`\`

\`\`\`output
Anak-anak
\`\`\`

Bentuk *shorthand* \`?:\` mengembalikan operand pertama jika ia "truthy":

\`\`\`php title=shorthand-ternary.php
<?php
$namaInput = "";
$nama = $namaInput ?: "Tanpa Nama";
echo $nama;
\`\`\`

\`\`\`output
Tanpa Nama
\`\`\`

Operator **null coalescing** (\`??\`) mengembalikan operand pertama jika ia **bukan** \`null\` (tidak memicu warning walau variabel belum didefinisikan) — sangat berguna untuk nilai default dari input pengguna.

\`\`\`php title=null-coalescing.php
<?php
$config = ["tema" => "gelap"];

$tema = $config['tema'] ?? "terang";
$bahasa = $config['bahasa'] ?? "id";

echo "$tema, $bahasa";
\`\`\`

\`\`\`output
gelap, id
\`\`\`

Ada juga \`??=\` yang memberi nilai hanya jika variabel masih \`null\`:

\`\`\`php title=null-coalescing-assign.php
<?php
$hitung = null;
$hitung ??= 0;
$hitung++;
echo $hitung;
\`\`\`

\`\`\`output
1
\`\`\``
},
{
  id:23, part:"Bagian IV — Kontrol Alur",
  title:"Loop For",
  md:`Perulangan \`for\` cocok ketika kita tahu **berapa kali** perulangan harus berjalan.

\`\`\`php title=loop-for.php
<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Perulangan ke-$i\\n";
}
\`\`\`

\`\`\`output
Perulangan ke-1
Perulangan ke-2
Perulangan ke-3
Perulangan ke-4
Perulangan ke-5
\`\`\`

Struktur \`for\` memiliki tiga bagian dipisah titik koma: **inisialisasi**, **kondisi**, dan **langkah** (increment/decrement).

\`\`\`output
for ( inisialisasi ; kondisi ; langkah ) {
       $i = 1        $i <= 5     $i++
}
\`\`\`

Loop \`for\` mundur atau dengan langkah kustom juga umum dipakai:

\`\`\`php title=for-mundur.php
<?php
for ($i = 10; $i > 0; $i -= 2) {
    echo $i . " ";
}
\`\`\`

\`\`\`output
10 8 6 4 2 
\`\`\`

Total iterasi loop \`for\` dari $1$ hingga $n$ dengan langkah $1$ dapat dihitung sebagai $n$ kali eksekusi, dan sering dipakai untuk membangun struktur seperti tabel perkalian atau pola bilangan.`
},
{
  id:24, part:"Bagian IV — Kontrol Alur",
  title:"Loop While & Do-While",
  md:`\`while\` mengulang selama kondisinya bernilai \`true\` — cocok saat jumlah iterasi **tidak diketahui** di awal.

\`\`\`php title=while.php
<?php
$saldo = 1000;
$bulan = 0;

while ($saldo < 2000) {
    $saldo += $saldo * 0.05; // bunga 5% per bulan
    $bulan++;
}

echo "Saldo mencapai 2x lipat setelah $bulan bulan (Rp" . round($saldo) . ")";
\`\`\`

\`\`\`output
Saldo mencapai 2x lipat setelah 15 bulan (Rp2078)
\`\`\`

\`do-while\` mirip \`while\`, tapi **kondisinya dicek di akhir** — sehingga blok kode dijamin berjalan minimal satu kali, walau kondisinya salah sejak awal.

\`\`\`php title=do-while.php
<?php
$percobaan = 0;
do {
    $percobaan++;
    echo "Percobaan ke-$percobaan\\n";
} while ($percobaan < 3);
\`\`\`

\`\`\`output
Percobaan ke-1
Percobaan ke-2
Percobaan ke-3
\`\`\`

> [!TIP] Gunakan \`while\` untuk validasi input berulang (misalnya menunggu input valid dari pengguna) dan \`do-while\` ketika sebuah aksi **harus** dijalankan setidaknya sekali sebelum kondisi diperiksa — contohnya menu interaktif di terminal.`
},
{
  id:25, part:"Bagian IV — Kontrol Alur",
  title:"Loop Foreach",
  md:`\`foreach\` dirancang khusus untuk menelusuri **array** tanpa perlu mengelola indeks secara manual — ini loop paling sering dipakai di kode PHP sehari-hari.

\`\`\`php title=foreach-dasar.php
<?php
$warna = ["Merah", "Hijau", "Biru"];

foreach ($warna as $item) {
    echo "- $item\\n";
}
\`\`\`

\`\`\`output
- Merah
- Hijau
- Biru
\`\`\`

Untuk array asosiatif, sertakan kunci sekaligus:

\`\`\`php title=foreach-asosiatif.php
<?php
$harga = ["Kopi" => 18000, "Teh" => 12000, "Susu" => 15000];

foreach ($harga as $menu => $rupiah) {
    echo "$menu: Rp" . number_format($rupiah) . "\\n";
}
\`\`\`

\`\`\`output
Kopi: Rp18,000
Teh: Rp12,000
Susu: Rp15,000
\`\`\`

Untuk mengubah nilai asli array selama iterasi, gunakan referensi \`&\`:

\`\`\`php title=foreach-referensi.php
<?php
$angka = [1, 2, 3];
foreach ($angka as &$n) {
    $n *= 10;
}
unset($n); // praktik baik: putus referensi setelah loop
print_r($angka);
\`\`\`

\`\`\`output
Array
(
    [0] => 10
    [1] => 20
    [2] => 30
)
\`\`\`

> [!WARN] Selalu \`unset()\` variabel referensi (\`&$n\`) setelah loop selesai — jika tidak, ia bisa "menempel" dan menimbulkan bug halus di loop \`foreach\` berikutnya yang memakai nama variabel sama.`
},
{
  id:26, part:"Bagian IV — Kontrol Alur",
  title:"Break, Continue & Studi Kasus",
  md:`\`break\` menghentikan loop sepenuhnya; \`continue\` melompati sisa iterasi saat ini dan lanjut ke iterasi berikutnya.

\`\`\`php title=break-continue.php
<?php
for ($i = 1; $i <= 10; $i++) {
    if ($i % 2 === 0) {
        continue; // lewati angka genap
    }
    if ($i > 7) {
        break; // berhenti total setelah lewat 7
    }
    echo $i . " ";
}
\`\`\`

\`\`\`output
1 3 5 7 
\`\`\`

**Studi kasus:** mencari bilangan prima pertama yang lebih besar dari 20, memakai kombinasi \`for\` bersarang, \`continue\`, dan \`break\`.

\`\`\`php title=cari-prima.php
<?php
for ($n = 21; $n <= 40; $n++) {
    $isPrima = true;
    for ($i = 2; $i <= sqrt($n); $i++) {
        if ($n % $i === 0) {
            $isPrima = false;
            continue 2; // lompat ke iterasi luar berikutnya
        }
    }
    if ($isPrima) {
        echo "Bilangan prima pertama > 20 adalah: $n";
        break;
    }
}
\`\`\`

\`\`\`output
Bilangan prima pertama > 20 adalah: 23
\`\`\`

\`continue 2\` dan \`break 2\` menerima angka level — berguna saat kita berada di dalam loop bersarang (*nested loop*) dan ingin mengontrol loop di luar, bukan hanya loop terdalam.`
},
{
  id:27, part:"Bagian V — Fungsi",
  title:"Fungsi Dasar",
  md:`Fungsi mengelompokkan sekumpulan kode menjadi satu unit yang bisa dipanggil ulang — prinsip **DRY** (*Don't Repeat Yourself*).

\`\`\`php title=fungsi-dasar.php
<?php
function sapa($nama) {
    return "Halo, $nama! Selamat belajar PHP.";
}

echo sapa("Rian");
echo "\\n";
echo sapa("Wulan");
\`\`\`

\`\`\`output
Halo, Rian! Selamat belajar PHP.
Halo, Wulan! Selamat belajar PHP.
\`\`\`

Anatomi fungsi PHP:

\`\`\`output
function   namaFungsi ( parameter ) {
  keyword     identifier   input       badan fungsi
    // logika
    return nilai;   <- opsional
}
\`\`\`

Fungsi bisa menerima banyak parameter dan mengembalikan nilai dari berbagai tipe, termasuk array:

\`\`\`php title=fungsi-array.php
<?php
function statistik(array $angka): array {
    return [
        'min' => min($angka),
        'max' => max($angka),
        'rata' => array_sum($angka) / count($angka),
    ];
}

$hasil = statistik([4, 8, 15, 16, 23, 42]);
print_r($hasil);
\`\`\`

\`\`\`output
Array
(
    [min] => 4
    [max] => 42
    [rata] => 18
)
\`\`\`

> [!TIP] Beri nama fungsi berupa kata kerja yang jelas (\`hitungTotal\`, \`validasiEmail\`) — nama yang baik membuat kode terbaca seperti kalimat.`
},
{
  id:28, part:"Bagian V — Fungsi",
  title:"Parameter, Default Value & Return Type",
  md:`Parameter bisa diberi **nilai default** sehingga opsional saat dipanggil, dan PHP mendukung **type hint** untuk parameter maupun nilai kembalian agar kode lebih aman dan mudah dipahami.

\`\`\`php title=parameter-default.php
<?php
function buatAkun(string $nama, string $peran = "member"): string {
    return "Akun '$nama' dibuat dengan peran: $peran";
}

echo buatAkun("Sinta"), "\\n";
echo buatAkun("Doni", "admin"), "\\n";
\`\`\`

\`\`\`output
Akun 'Sinta' dibuat dengan peran: member
Akun 'Doni' dibuat dengan peran: admin
\`\`\`

Sejak PHP 8, kamu bisa memakai **named arguments** — memanggil parameter berdasarkan namanya, tak harus berurutan:

\`\`\`php title=named-arguments.php
<?php
function buatProduk(string $nama, float $harga, int $stok = 0) {
    return "$nama - Rp$harga (stok: $stok)";
}

echo buatProduk(nama: "Mouse", stok: 25, harga: 75000);
\`\`\`

\`\`\`output
Mouse - Rp75000 (stok: 25)
\`\`\`

Untuk parameter jumlah tak terbatas, gunakan **variadic** (\`...\`):

\`\`\`php title=variadic.php
<?php
function jumlahkan(...$angka): int {
    return array_sum($angka);
}
echo jumlahkan(2, 4, 6, 8); // 20
\`\`\`

\`\`\`output
20
\`\`\``
},
{
  id:29, part:"Bagian V — Fungsi",
  title:"Variable Scope (Global vs Local)",
  md:`*Scope* menentukan area di mana suatu variabel bisa diakses. Secara default, variabel yang dideklarasikan di dalam fungsi bersifat **lokal** — tidak terlihat dari luar fungsi, dan sebaliknya.

\`\`\`php title=scope.php
<?php
$kota = "Jakarta"; // variabel global

function tampilkanKota() {
    // echo $kota; // Error/undefined — $kota tidak terlihat di sini
    echo "Kota tidak diketahui dari dalam fungsi.\\n";
}

tampilkanKota();
echo "Kota (global): $kota";
\`\`\`

\`\`\`output
Kota tidak diketahui dari dalam fungsi.
Kota (global): Jakarta
\`\`\`

Untuk mengakses variabel global di dalam fungsi, gunakan kata kunci \`global\`, atau — cara yang lebih dianjurkan — kirim sebagai parameter:

\`\`\`php title=scope-global.php
<?php
$counter = 0;

function tambahGlobal() {
    global $counter;
    $counter++;
}
tambahGlobal();
tambahGlobal();
echo $counter; // 2
\`\`\`

\`\`\`output
2
\`\`\`

> [!WARN] Bergantung pada \`global\` membuat fungsi sulit ditelusuri dan diuji. Pola yang lebih baik: kirim nilai sebagai parameter dan kembalikan hasilnya dengan \`return\` — fungsi menjadi lebih *predictable* dan mudah dipakai ulang di konteks lain.`
},
{
  id:30, part:"Bagian V — Fungsi",
  title:"Fungsi Anonim & Closure",
  md:`**Fungsi anonim** (*anonymous function*) adalah fungsi tanpa nama, biasa disimpan dalam variabel atau dikirim sebagai argumen ke fungsi lain.

\`\`\`php title=anonim.php
<?php
$kali = function($a, $b) {
    return $a * $b;
};

echo $kali(6, 7);
\`\`\`

\`\`\`output
42
\`\`\`

**Closure** adalah fungsi anonim yang "menangkap" variabel dari lingkup luar menggunakan kata kunci \`use\`:

\`\`\`php title=closure.php
<?php
function buatPengali(int $faktor): callable {
    return function(int $angka) use ($faktor) {
        return $angka * $faktor;
    };
}

$kaliTiga = buatPengali(3);
$kaliLima = buatPengali(5);

echo $kaliTiga(10), "\\n"; // 30
echo $kaliLima(10), "\\n"; // 50
\`\`\`

\`\`\`output
30
50
\`\`\`

Closure sangat berguna dipasangkan dengan fungsi array seperti \`array_map()\` dan \`usort()\` (lihat Bab 18), di mana kita perlu mengirim "logika kustom" sebagai nilai.

> [!TIP] Secara default, \`use ($faktor)\` menangkap **salinan** nilai. Untuk menangkap **referensi** (agar perubahan di luar closure ikut terlihat di dalam), tulis \`use (&$faktor)\`.`
}
);
