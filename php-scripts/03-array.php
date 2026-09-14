<?php
/**
 * 03-array.php
 * Array terindeks, asosiatif, multidimensi, dan fungsi array populer.
 */
header('Content-Type: text/plain; charset=utf-8');

echo "=== Array Terindeks ===\n";
$buah = ["Apel", "Jeruk", "Mangga"];
$buah[] = "Nanas";
print_r($buah);

echo "\n=== Array Asosiatif ===\n";
$mhs = ["nama" => "Dewi", "nim" => "220112345", "ipk" => 3.75];
foreach ($mhs as $k => $v) {
    echo "$k: $v\n";
}

echo "\n=== Array Multidimensi ===\n";
$pegawai = [
    ["nama" => "Andi",  "gaji" => 5000000],
    ["nama" => "Bella", "gaji" => 6200000],
];
foreach ($pegawai as $i => $p) {
    printf("%d. %s - Rp%s\n", $i + 1, $p['nama'], number_format($p['gaji']));
}

echo "\n=== Fungsi Array (map/filter/reduce) ===\n";
$angka   = range(1, 10);
$kuadrat = array_map(fn($n) => $n * $n, $angka);
$genap   = array_values(array_filter($angka, fn($n) => $n % 2 === 0));
$total   = array_reduce($angka, fn($c, $n) => $c + $n, 0);

echo "Kuadrat : " . implode(", ", $kuadrat) . "\n";
echo "Genap   : " . implode(", ", $genap) . "\n";
echo "Total 1..10: $total\n";
