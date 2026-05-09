<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            ['code' => 'GOJEK-ECO', 'title' => 'Diskon GoRide 30%', 'description' => 'Kurangi emisi dengan naik motor listrik. Diskon 30% untuk GoRide pilihan sepeda motor listrik.', 'partner_name' => 'Gojek', 'category' => 'transport', 'xp_cost' => 200, 'discount_value' => '30', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 500, 'remaining_quota' => 500],
            ['code' => 'GRAB-GREEN', 'title' => 'Grab GreenRide -25%', 'description' => 'Naik GreenRide dan dapatkan 25% cashback. Ramah lingkungan, hemat juga!', 'partner_name' => 'Grab', 'category' => 'transport', 'xp_cost' => 150, 'discount_value' => '25', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 300, 'remaining_quota' => 300],
            ['code' => 'SAYUR-BOX', 'title' => 'SayurBox 50rb Off', 'description' => 'Belanja sayur organik lokal dan dapatkan potongan Rp50.000 untuk transaksi pertama.', 'partner_name' => 'SayurBox', 'category' => 'food', 'xp_cost' => 250, 'discount_value' => '50000', 'discount_type' => 'fixed', 'valid_until' => '2025-12-31', 'total_quota' => 200, 'remaining_quota' => 200],
            ['code' => 'TOKPED-ECO', 'title' => 'Tokopedia Green Shop 20%', 'description' => 'Diskon 20% untuk pembelian produk ramah lingkungan di Tokopedia Green Shop.', 'partner_name' => 'Tokopedia', 'category' => 'shop', 'xp_cost' => 300, 'discount_value' => '20', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 1000, 'remaining_quota' => 1000],
            ['code' => 'KOPI-KENANGAN', 'title' => 'Kopi Kenangan Gratis', 'description' => 'Bawa tumbler sendiri dan dapatkan 1 minuman gratis di Kopi Kenangan.', 'partner_name' => 'Kopi Kenangan', 'category' => 'food', 'xp_cost' => 100, 'discount_value' => '100', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 150, 'remaining_quota' => 150],
            ['code' => 'INDOMARET-ECO', 'title' => 'Indomaret Green 15%', 'description' => 'Belanja produk eco-friendly di Indomaret, hemat 15%.', 'partner_name' => 'Indomaret', 'category' => 'shop', 'xp_cost' => 180, 'discount_value' => '15', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 800, 'remaining_quota' => 800],
            ['code' => 'PLN-HEMAT', 'title' => 'PLN Token Listrik 10%', 'description' => 'Hemat 10% pembelian token listrik via PLN Mobile. Khusus pelanggan hemat energi.', 'partner_name' => 'PLN', 'category' => 'service', 'xp_cost' => 400, 'discount_value' => '10', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 100, 'remaining_quota' => 100],
            ['code' => 'PASAR-MINGGU', 'title' => 'Pasar Digital Minggu -20rb', 'description' => 'Belanja produk UMKM lokal di Pasar Digital Minggu, gratis ongkir + diskon 20rb.', 'partner_name' => 'Pasar Digital Surabaya', 'category' => 'food', 'xp_cost' => 120, 'discount_value' => '20000', 'discount_type' => 'fixed', 'valid_until' => '2025-12-31', 'total_quota' => 250, 'remaining_quota' => 250],
            ['code' => 'BANK-JATIM', 'title' => 'Bank Jatim Green Loan', 'description' => 'Bunga 0% untuk peminjaman panel surya dan produk hemat energi. Maks 12 bulan.', 'partner_name' => 'Bank Jatim', 'category' => 'service', 'xp_cost' => 1000, 'discount_value' => '100', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 50, 'remaining_quota' => 50],
            ['code' => 'WASTE4CHANGE', 'title' => 'Waste4Change Pickup Gratis', 'description' => 'Dapatkan 1x layanan pickup sampah pilah gratis dari Waste4Change (nilai Rp75.000).', 'partner_name' => 'Waste4Change', 'category' => 'service', 'xp_cost' => 350, 'discount_value' => '100', 'discount_type' => 'percent', 'valid_until' => '2025-12-31', 'total_quota' => 75, 'remaining_quota' => 75],
        ];

        foreach ($vouchers as $v) {
            Voucher::create($v);
        }
    }
}
