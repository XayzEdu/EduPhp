<?php
/**
 * 02-variabel-tipe-data.php
 * Demonstrasi variabel, delapan tipe data dasar PHP, dan konstanta.
 */
header('Content-Type: text/plain; charset=utf-8');

// ---- Variabel & tipe data dasar -------------------------------------
$nama     = "Xayz";      // string
$umur     = 20;          // int
$tinggi   = 172.5;       // float
$aktif    = true;        // bool
$hobi     = ["Kode", "Baca", "Game"]; // array
$alamat   = null;        // null

echo "=== Variabel & Tipe Data ===\n";
echo "Nama   : $nama (" . gettype($nama) . ")\n";
echo "Umur   : $umur (" . gettype($umur) . ")\n";
echo "Tinggi : $tinggi (" . gettype($tinggi) . ")\n";
echo "Aktif  : " . ($aktif ? 'true' : 'false') . " (" . gettype($aktif) . ")\n";
echo "Hobi   : " . implode(", ", $hobi) . " (" . gettype($hobi) . ")\n";
echo "Alamat : " . var_export($alamat, true) . " (" . gettype($alamat) . ")\n";

// ---- Type casting -----------------------------------------------------
$angkaTeks = "42.9";
echo "\n=== Type Casting ===\n";
echo "int   : " . (int)$angkaTeks . "\n";
echo "float : " . (float)$angkaTeks . "\n";
echo "bool  : " . var_export((bool)$angkaTeks, true) . "\n";

// ---- Konstanta ----------------------------------------------------------
define("APLIKASI", "XayzEduPhp");
const VERSI = "1.0.0";

echo "\n=== Konstanta ===\n";
echo APLIKASI . " v" . VERSI . "\n";
echo "PHP_VERSION bawaan: " . PHP_VERSION . "\n";
