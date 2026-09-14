<?php
/**
 * 01-hello.php
 * Contoh syntax dasar PHP: komentar, echo, dan menyisipkan PHP di HTML.
 */
$nama = "Dunia";
?>
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>01 - Hello PHP</title></head>
<body>
  <h1>Halo, <?= htmlspecialchars($nama) ?>!</h1>
  <p>Sekarang jam server: <?php echo date("H:i:s"); ?></p>

  <ul>
  <?php for ($i = 1; $i <= 5; $i++): ?>
    <li>Baris ke-<?= $i ?></li>
  <?php endfor; ?>
  </ul>
</body>
</html>
