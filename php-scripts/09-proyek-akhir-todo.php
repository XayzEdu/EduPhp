<?php
/**
 * 09-proyek-akhir-todo.php
 * Proyek Akhir — Mini REST API Todo-List lengkap (Create, Read, Update, Delete)
 * memakai SQLite (tanpa perlu instalasi MySQL terpisah).
 *
 * Jalankan dengan: php -S localhost:8000
 * Lalu coba dengan curl, contoh:
 *
 *   curl http://localhost:8000/09-proyek-akhir-todo.php
 *   curl -X POST http://localhost:8000/09-proyek-akhir-todo.php \
 *        -H "Content-Type: application/json" \
 *        -d '{"judul":"Belajar PHP"}'
 *   curl -X PATCH "http://localhost:8000/09-proyek-akhir-todo.php?id=1"
 *   curl -X DELETE "http://localhost:8000/09-proyek-akhir-todo.php?id=1"
 */

header('Content-Type: application/json; charset=utf-8');

$pdo = new PDO('sqlite:' . __DIR__ . '/todos.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec("
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        judul TEXT NOT NULL,
        selesai INTEGER DEFAULT 0,
        dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$body = json_decode(file_get_contents('php://input'), true) ?? [];

function kirim(int $kode, array $payload): void {
    http_response_code($kode);
    echo json_encode($payload, JSON_PRETTY_PRINT);
    exit;
}

match (true) {
    $method === 'GET' => kirim(200, [
        'status' => 'sukses',
        'data'   => $pdo->query("SELECT * FROM todos ORDER BY id DESC")->fetchAll(),
    ]),

    $method === 'POST' => (function () use ($pdo, $body) {
        if (empty($body['judul'])) {
            kirim(400, ['status' => 'gagal', 'pesan' => 'Judul wajib diisi']);
        }
        $stmt = $pdo->prepare("INSERT INTO todos (judul) VALUES (?)");
        $stmt->execute([$body['judul']]);
        kirim(201, ['status' => 'sukses', 'id' => $pdo->lastInsertId()]);
    })(),

    $method === 'PATCH' && $id !== null => (function () use ($pdo, $id) {
        $stmt = $pdo->prepare("UPDATE todos SET selesai = 1 WHERE id = ?");
        $stmt->execute([$id]);
        kirim(200, ['status' => 'sukses', 'pesan' => "Todo #$id ditandai selesai"]);
    })(),

    $method === 'DELETE' && $id !== null => (function () use ($pdo, $id) {
        $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
        $stmt->execute([$id]);
        kirim(200, ['status' => 'sukses', 'pesan' => "Todo #$id dihapus"]);
    })(),

    default => kirim(405, ['status' => 'gagal', 'pesan' => 'Method atau parameter tidak didukung']),
};
