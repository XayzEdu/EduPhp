<?php
/**
 * 07-pdo-koneksi.php
 * Contoh koneksi & query database MySQL memakai PDO + prepared statement.
 *
 * Sesuaikan kredensial di bawah, lalu buat tabel contoh:
 *
 *   CREATE TABLE produk (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     nama VARCHAR(100) NOT NULL,
 *     harga DECIMAL(12,2) NOT NULL
 *   );
 *   INSERT INTO produk (nama, harga) VALUES ('Laptop XZ', 7650000);
 */
header('Content-Type: text/plain; charset=utf-8');

$host = "localhost";
$db   = "toko_online";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "Koneksi ke database '$db' berhasil.\n\n";

    // SELECT dengan prepared statement (aman dari SQL Injection)
    $stmt = $pdo->prepare("SELECT nama, harga FROM produk WHERE harga > :min");
    $stmt->execute(['min' => 0]);

    echo "Daftar produk:\n";
    foreach ($stmt->fetchAll() as $p) {
        echo "- {$p['nama']}: Rp" . number_format($p['harga']) . "\n";
    }

    // INSERT dengan placeholder posisi (?)
    $insert = $pdo->prepare("INSERT INTO produk (nama, harga) VALUES (?, ?)");
    $insert->execute(["Produk Baru", 99000]);
    echo "\nProduk baru ditambahkan dengan ID: " . $pdo->lastInsertId() . "\n";

} catch (PDOException $e) {
    echo "Koneksi/Query gagal: " . $e->getMessage() . "\n";
    echo "(Pastikan MySQL aktif dan kredensial di atas sudah benar.)\n";
}
