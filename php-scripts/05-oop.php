<?php
/**
 * 05-oop.php
 * Class, constructor property promotion, inheritance, dan interface.
 */
header('Content-Type: text/plain; charset=utf-8');

interface BisaDibayar {
    public function bayar(float $jumlah): string;
}

abstract class Hewan {
    public function __construct(protected string $nama) {}
    abstract public function bersuara(): string;
}

class Kucing extends Hewan {
    public function bersuara(): string {
        return "$this->nama berkata: Meong!";
    }
}

class DompetDigital implements BisaDibayar {
    public function bayar(float $jumlah): string {
        return "Membayar Rp" . number_format($jumlah) . " via Dompet Digital.";
    }
}

class RekeningBank {
    private float $saldo;

    public function __construct(float $saldoAwal) {
        $this->saldo = $saldoAwal;
    }

    public function setor(float $jumlah): void { $this->saldo += $jumlah; }

    public function tarik(float $jumlah): bool {
        if ($jumlah > $this->saldo) return false;
        $this->saldo -= $jumlah;
        return true;
    }

    public function getSaldo(): float { return $this->saldo; }
}

echo "=== Inheritance & Abstract ===\n";
echo (new Kucing("Milo"))->bersuara() . "\n";

echo "\n=== Interface ===\n";
$metode = new DompetDigital();
echo $metode->bayar(150000) . "\n";

echo "\n=== Encapsulation ===\n";
$rekening = new RekeningBank(500000);
$rekening->setor(200000);
$rekening->tarik(100000);
echo "Saldo akhir: Rp" . number_format($rekening->getSaldo()) . "\n";
