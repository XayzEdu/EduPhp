window.BOOK_PAGES = window.BOOK_PAGES || [];
window.BOOK_PAGES.push(
{
  id:51, part:"Bagian IX — Pemantapan Dasar",
  title:"Latihan: Variabel & Tipe Data",
  md:`Saatnya praktik langsung! Di bawah ini ada kode PHP yang **acak urutannya** dan **satu barisnya hilang**. Susun potongan kode dari kotak "bank kode" ke posisi yang benar, lengkapi baris yang kosong, lalu tekan **Jalankan** — kodenya akan benar-benar dieksekusi di browser kamu (bukan simulasi!) memakai mesin PHP sungguhan (php-wasm).

**Tujuan:** buat tiga variabel (nama, umur, tinggi badan) lalu tampilkan dalam satu kalimat memakai interpolasi string.

Gunakan tombol **Hasil yang Diharapkan** jika ingin melihat target output sebelum mencoba, dan tombol **Solusi** jika benar-benar buntu. Jika hasil programmu sudah cocok dengan target, sebuah kotak pop-up "Benar!" akan muncul.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang potongan kode berikut agar tiga variabel (nama, umur, tinggi) tercetak dalam satu kalimat. Satu baris (deklarasi \\$tinggi) sengaja dikosongkan — ketik sendiri baris itu.",
    lines:[
      '$nama = "Rangga";',
      '$umur = 21;',
      '$tinggi = 165.5;',
      'echo "Nama: $nama, Umur: $umur, Tinggi: $tinggi cm";'
    ],
    blankIndex:2,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Nama: Rangga, Umur: 21, Tinggi: 165.5 cm"
  }
},
{
  id:52, part:"Bagian IX — Pemantapan Dasar",
  title:"Latihan: Operator & Percabangan",
  md:`Latihan kedua menggabungkan **operator perbandingan** dengan **if-elseif-else** untuk menentukan predikat nilai ujian. Susun baris-baris \`if\`, \`elseif\`, dan \`else\` ke urutan yang benar, lalu lengkapi satu baris \`echo\` yang hilang.

Ingat: PHP mengevaluasi \`if\`/\`elseif\` dari atas ke bawah dan berhenti di kondisi pertama yang bernilai \`true\` — urutan blok sangat menentukan hasil akhirnya.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun blok if/elseif/else agar nilai 78 menghasilkan predikat yang benar. Baris \\\"echo B\\\" di dalam blok elseif sengaja dikosongkan.",
    lines:[
      '$nilai = 78;',
      'if ($nilai >= 90) {',
      '    echo "A";',
      '} elseif ($nilai >= 75) {',
      '    echo "B";',
      '} else {',
      '    echo "C";',
      '}'
    ],
    blankIndex:4,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"B"
  }
},
{
  id:53, part:"Bagian IX — Pemantapan Dasar",
  title:"Latihan: Perulangan",
  md:`Sekarang giliran perulangan \`for\`. Tugasmu: susun ulang baris-baris agar program menjumlahkan angka 1 sampai 5, lalu lengkapi baris badan loop yang hilang (yang melakukan akumulasi ke variabel \`$total\`).

Tips: perhatikan letak kurung kurawal \`{\` dan \`}\` — badan loop harus berada **di antara** keduanya agar sintaksnya valid.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode perulangan for berikut agar menjumlahkan angka 1 sampai 5. Baris akumulasi di dalam loop sengaja dikosongkan.",
    lines:[
      '$total = 0;',
      'for ($i = 1; $i <= 5; $i++) {',
      '    $total += $i;',
      '}',
      'echo "Total: $total";'
    ],
    blankIndex:2,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Total: 15"
  }
},
{
  id:54, part:"Bagian IX — Pemantapan Dasar",
  title:"Latihan: String & Array",
  md:`Latihan ini menggabungkan **array** dan **fungsi string** \`implode()\`. Susun ulang baris-baris kode agar sebuah array buah digabung menjadi satu kalimat yang dipisah koma.

Fungsi \`implode(pemisah, array)\` adalah kebalikan dari \`explode()\` yang sudah kamu pelajari di Bab 14 — ia menggabungkan elemen array menjadi satu string.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode berikut agar array buah digabung menjadi kalimat memakai implode(). Baris pemanggilan implode() sengaja dikosongkan.",
    lines:[
      '$buah = ["Apel", "Jeruk", "Mangga"];',
      '$hasil = implode(", ", $buah);',
      'echo "Buah: $hasil";'
    ],
    blankIndex:1,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Buah: Apel, Jeruk, Mangga"
  }
},
{
  id:55, part:"Bagian IX — Pemantapan Dasar",
  title:"Latihan: Fungsi",
  md:`Latihan fungsi: susun ulang definisi fungsi \`rata()\` yang menghitung rata-rata dari sebuah array angka, lalu panggil fungsi tersebut. Baris \`return\` di dalam fungsi sengaja dikosongkan — kamu perlu menggabungkan \`array_sum()\` dan \`count()\` sendiri.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode fungsi rata() berikut. Baris return di dalam fungsi (yang membagi jumlah total dengan banyak elemen) sengaja dikosongkan.",
    lines:[
      'function rata($angka) {',
      '    return array_sum($angka) / count($angka);',
      '}',
      '$nilai = [80, 90, 70];',
      'echo "Rata-rata: " . rata($nilai);'
    ],
    blankIndex:1,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Rata-rata: 80"
  }
},
{
  id:56, part:"Bagian IX — Pemantapan Dasar",
  title:"Latihan: OOP Dasar",
  md:`Latihan OOP: susun ulang class \`Siswa\` yang memiliki method \`status()\` untuk menentukan kelulusan berdasarkan nilai. Baris \`return\` di dalam method \`status()\` (yang berisi ekspresi ternary) sengaja dikosongkan.

Class ini memakai **constructor property promotion** (Bab 41) — perhatikan bagaimana \`public string $nama, public int $nilai\` langsung dideklarasikan di parameter constructor.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang class Siswa berikut. Baris return di dalam method status() (ekspresi ternary lulus/tidak lulus) sengaja dikosongkan.",
    lines:[
      'class Siswa {',
      '    public function __construct(public string $nama, public int $nilai) {}',
      '    public function status() {',
      '        return $this->nilai >= 75 ? "Lulus" : "Tidak Lulus";',
      '    }',
      '}',
      '$s = new Siswa("Budi", 80);',
      'echo "$s->nama: " . $s->status();'
    ],
    blankIndex:3,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Budi: Lulus"
  }
},
{
  id:57, part:"Bagian IX — Pemantapan Dasar",
  title:"Studi Kasus: Kalkulator Nilai Rapor",
  md:`Studi kasus gabungan: menghitung nilai akhir dari tiga komponen (tugas 30%, UTS 30%, UAS 40%), lalu menentukan grade dengan ekspresi ternary bertingkat. Susun ulang kode berikut dan lengkapi baris rumus nilai akhir yang hilang.

$$\\text{Nilai Akhir} = (0.3 \\times \\text{Tugas}) + (0.3 \\times \\text{UTS}) + (0.4 \\times \\text{UAS})$$`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode kalkulator nilai rapor berikut. Baris rumus perhitungan nilai akhir (bobot 30% tugas, 30% UTS, 40% UAS) sengaja dikosongkan.",
    lines:[
      '$tugas = 85; $uts = 78; $uas = 90;',
      '$akhir = ($tugas * 0.3) + ($uts * 0.3) + ($uas * 0.4);',
      '$grade = $akhir >= 85 ? "A" : ($akhir >= 75 ? "B" : "C");',
      'echo "Nilai Akhir: " . round($akhir, 1) . " (Grade $grade)";'
    ],
    blankIndex:1,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Nilai Akhir: 84.9 (Grade B)"
  }
},
{
  id:58, part:"Bagian IX — Pemantapan Dasar",
  title:"Studi Kasus: Sistem Keranjang Belanja",
  md:`Studi kasus terakhir di bagian ini: menghitung total belanja dari array multidimensi (setiap item punya harga & jumlah), memakai \`foreach\`. Susun ulang kode berikut dan lengkapi baris akumulasi total yang hilang di dalam loop.`,
  exercise:{
    runtime:"php",
    instruksi:"Susun ulang kode keranjang belanja berikut. Baris akumulasi total (harga dikali qty, ditambahkan ke $total) di dalam foreach sengaja dikosongkan.",
    lines:[
      '$keranjang = [["nama"=>"Buku","harga"=>25000,"qty"=>2], ["nama"=>"Pensil","harga"=>5000,"qty"=>3]];',
      '$total = 0;',
      'foreach ($keranjang as $item) {',
      '    $total += $item["harga"] * $item["qty"];',
      '}',
      'echo "Total belanja: Rp" . number_format($total);'
    ],
    blankIndex:3,
    wrapperBefore:"<?php\n",
    wrapperAfter:"",
    expectedOutput:"Total belanja: Rp65,000"
  }
},
{
  id:59, part:"Bagian X — Database & SQL",
  title:"Pengenalan Database Relasional",
  md:`Hampir semua aplikasi web nyata butuh **menyimpan data secara permanen** — produk toko, akun pengguna, transaksi, dan seterusnya. Di sinilah **database** berperan. Bagian ini akan membawamu dari konsep dasar SQL hingga CRUD lengkap dengan PHP.

**Database relasional** menyimpan data dalam bentuk **tabel** (mirip spreadsheet): setiap tabel punya baris (*row*) dan kolom (*column*). Hubungan antar tabel (*relasi*) dibangun lewat kolom kunci, memungkinkan data yang saling terkait tetap terorganisir tanpa duplikasi.

\`\`\`output
Tabel: produk
+----+------------+----------+
| id | nama       | harga    |
+----+------------+----------+
| 1  | Laptop XZ  | 7650000  |
| 2  | Mouse      | 150000   |
+----+------------+----------+
\`\`\`

Sistem manajemen basis data (*Database Management System* / DBMS) yang populer dipakai bersama PHP:

| DBMS | Karakteristik |
|---|---|
| **MySQL / MariaDB** | paling umum untuk aplikasi web, gratis, banyak dukungan hosting |
| **PostgreSQL** | fitur lebih kaya, kuat untuk data kompleks |
| **SQLite** | database ringan berbasis satu berkas, cocok untuk aplikasi kecil/lokal |

Sepanjang bagian ini, contoh **latihan interaktif** memakai SQLite yang berjalan **langsung di browser kamu** (lewat WebAssembly) — sehingga kamu bisa mencoba query SQL sungguhan tanpa perlu instalasi apa pun.

> [!TIP] Bahasa yang dipakai untuk "berbicara" dengan hampir semua database relasional disebut **SQL** (*Structured Query Language*) — satu bahasa yang sama, dipakai di MySQL, PostgreSQL, maupun SQLite dengan sedikit variasi dialek.`
},
{
  id:60, part:"Bagian X — Database & SQL",
  title:"Tabel, Baris, Kolom & Tipe Data SQL",
  md:`Sebelum menulis query, kita perlu memahami cara **mendefinisikan struktur tabel** memakai perintah \`CREATE TABLE\` — bagian dari SQL yang disebut **DDL** (*Data Definition Language*).

\`\`\`sql title=buat-tabel.sql
CREATE TABLE produk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama VARCHAR(100) NOT NULL,
    harga DECIMAL(12,2) NOT NULL,
    stok INTEGER DEFAULT 0
);
\`\`\`

Penjelasan tiap bagian:

| Elemen | Kegunaan |
|---|---|
| \`INTEGER PRIMARY KEY\` | kolom identitas unik tiap baris, biasanya auto-increment |
| \`VARCHAR(100)\` | teks dengan panjang maksimal 100 karakter |
| \`NOT NULL\` | kolom wajib diisi, tidak boleh kosong |
| \`DECIMAL(12,2)\` | angka desimal presisi (cocok untuk uang) |
| \`DEFAULT 0\` | nilai bawaan jika tidak diisi saat insert |

Tipe data SQL yang umum dipakai:

| Tipe SQL | Kegunaan |
|---|---|
| \`INTEGER\` / \`INT\` | bilangan bulat |
| \`VARCHAR(n)\` / \`TEXT\` | teks |
| \`DECIMAL(p,s)\` / \`FLOAT\` | bilangan desimal |
| \`DATE\` / \`DATETIME\` | tanggal & waktu |
| \`BOOLEAN\` | benar/salah (di beberapa DBMS disimpan sebagai 0/1) |

> [!TIP] Setiap tabel idealnya punya satu kolom **primary key** — identitas unik yang tidak pernah berubah untuk tiap baris, dipakai sebagai "alamat" saat tabel lain ingin merujuk baris tersebut (dibahas lebih lanjut di Bab JOIN).

Di halaman-halaman berikutnya kamu akan langsung mempraktikkan \`SELECT\`, \`INSERT\`, \`UPDATE\`, dan \`DELETE\` lewat latihan interaktif dengan database SQLite sungguhan di browser.`
}
);
