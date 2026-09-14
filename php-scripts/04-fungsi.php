<?php
/**
 * 04-fungsi.php
 * Fungsi dasar, parameter default, closure, dan arrow function.
 */
header('Content-Type: text/plain; charset=utf-8');

function sapa(string $nama, string $peran = "member"): string {
    return "Halo, $nama! Peran kamu: $peran.";
}

echo sapa("Rian") . "\n";
echo sapa("Dina", "admin") . "\n";

// Closure menangkap variabel luar lewat `use`
function buatPengali(int $faktor): callable {
    return function (int $angka) use ($faktor) {
        return $angka * $faktor;
    };
}
$kaliTiga = buatPengali(3);
echo "Closure: 10 x 3 = " . $kaliTiga(10) . "\n";

// Arrow function - ringkas, otomatis menangkap variabel luar
$pajak = 0.11;
$hitungPajak = fn($harga) => $harga * $pajak;
echo "Arrow fn: pajak dari 200000 = " . $hitungPajak(200000) . "\n";

// Studi kasus: statistik nilai memakai array + fungsi
function statistik(array $angka): array {
    return [
        'min'  => min($angka),
        'max'  => max($angka),
        'rata' => array_sum($angka) / count($angka),
    ];
}
print_r(statistik([70, 85, 90, 60, 95]));
