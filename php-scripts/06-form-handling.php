<?php
/**
 * 06-form-handling.php
 * Menangani data form POST, dengan validasi dasar dan escaping output.
 */
header('Content-Type: text/html; charset=utf-8');

$nama  = trim($_POST['nama'] ?? '');
$email = trim($_POST['email'] ?? '');
$error = [];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $error[] = 'Silakan isi formulir di 06-form.html terlebih dahulu.';
} else {
    if ($nama === '') {
        $error[] = 'Nama wajib diisi.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error[] = 'Format email tidak valid.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Hasil Pendaftaran</title></head>
<body>
<?php if (!empty($error)): ?>
  <h1>Gagal mendaftar</h1>
  <ul>
    <?php foreach ($error as $e): ?>
      <li><?= htmlspecialchars($e) ?></li>
    <?php endforeach; ?>
  </ul>
<?php else: ?>
  <h1>Pendaftaran berhasil!</h1>
  <p>Terima kasih, <strong><?= htmlspecialchars($nama) ?></strong>.</p>
  <p>Kami akan mengirim konfirmasi ke: <?= htmlspecialchars($email) ?></p>
<?php endif; ?>
</body>
</html>
