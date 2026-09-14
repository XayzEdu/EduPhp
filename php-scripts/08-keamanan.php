<?php
/**
 * 08-keamanan.php
 * Password hashing yang aman & escaping output untuk mencegah XSS.
 */
header('Content-Type: text/plain; charset=utf-8');

echo "=== Password Hashing ===\n";
$passwordAsli = "rahasia123";
$hash = password_hash($passwordAsli, PASSWORD_DEFAULT);
echo "Hash tersimpan : $hash\n";
echo "Verifikasi benar: " . var_export(password_verify("rahasia123", $hash), true) . "\n";
echo "Verifikasi salah: " . var_export(password_verify("salah", $hash), true) . "\n";

echo "\n=== Escaping XSS ===\n";
$inputBerbahaya = "<script>alert('hacked')</script>";
echo "Input mentah   : $inputBerbahaya\n";
echo "Setelah escape : " . htmlspecialchars($inputBerbahaya, ENT_QUOTES, 'UTF-8') . "\n";

echo "\n=== Validasi Email & Regex ===\n";
$email = "user@contoh.com";
echo "Email valid: " . var_export((bool)filter_var($email, FILTER_VALIDATE_EMAIL), true) . "\n";

$nomorHp = "081234567890";
$valid = (bool) preg_match('/^08[0-9]{8,11}$/', $nomorHp);
echo "Nomor HP valid: " . var_export($valid, true) . "\n";
