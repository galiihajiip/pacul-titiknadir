<?php

namespace Database\Seeders;

use App\Models\Challenge;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
    public function run(): void
    {
        $challenges = [
            [
                'title'          => '7 Hari Tanpa Plastik Sekali Pakai',
                'description'    => 'Tantang dirimu untuk menghindari kantong plastik, sedotan, dan kemasan plastik sekali pakai selama 7 hari penuh. Bawa tas belanja sendiri, gunakan botol minum reusable!',
                'emoji'          => '🛍️',
                'category'       => 'waste',
                'difficulty'     => 'sedang',
                'xp_reward'      => 150,
                'duration_days'  => 7,
                'start_date'     => now()->toDateString(),
                'end_date'       => now()->addDays(30)->toDateString(),
                'requires_proof' => true,
                'proof_type'     => 'photo',
                'tips'           => ['Bawa tas belanja ke mana pun', 'Pilih produk dengan kemasan minimal', 'Gunakan sedotan bambu atau stainless'],
            ],
            [
                'title'          => 'Naik Transportasi Umum 5x',
                'description'    => 'Kurangi emisi karbon dengan menggunakan bus, kereta, atau angkutan umum minimal 5 kali dalam satu minggu. Setiap perjalanan = langkah nyata untuk udara bersih!',
                'emoji'          => '🚌',
                'category'       => 'transport',
                'difficulty'     => 'mudah',
                'xp_reward'      => 100,
                'target_value'   => 5,
                'target_unit'    => 'perjalanan',
                'duration_days'  => 7,
                'start_date'     => now()->toDateString(),
                'end_date'       => now()->addDays(30)->toDateString(),
                'requires_proof' => true,
                'proof_type'     => 'photo',
                'tips'           => ['Download aplikasi KRL/LRT', 'Coba rute baru setiap hari', 'Foto karcis/tiket sebagai bukti'],
            ],
            [
                'title'          => 'Hemat Listrik 20%',
                'description'    => 'Kurangi penggunaan listrik bulanan kamu sebesar 20% dibanding bulan lalu. Matikan AC saat tidak digunakan, pakai lampu LED, dan cabut charger yang tidak terpakai.',
                'emoji'          => '⚡',
                'category'       => 'energy',
                'difficulty'     => 'sulit',
                'xp_reward'      => 250,
                'target_value'   => 20,
                'target_unit'    => 'persen',
                'duration_days'  => 30,
                'start_date'     => now()->toDateString(),
                'end_date'       => now()->addDays(60)->toDateString(),
                'requires_proof' => true,
                'proof_type'     => 'photo',
                'tips'           => ['Pakai AC di suhu 25°C ke atas', 'Matikan lampu saat meninggalkan ruangan', 'Upload foto struk listrik bulan ini vs bulan lalu'],
            ],
            [
                'title'          => 'Tanam Pohon di Lingkunganmu',
                'description'    => 'Tanam minimal 1 pohon atau tanaman di halaman atau pot. Foto proses penanaman dan hasilnya. Setiap pohon menyerap 21 kg CO₂ per tahun!',
                'emoji'          => '🌳',
                'category'       => 'nature',
                'difficulty'     => 'mudah',
                'xp_reward'      => 200,
                'target_value'   => 1,
                'target_unit'    => 'pohon',
                'duration_days'  => 14,
                'start_date'     => now()->toDateString(),
                'end_date'       => now()->addDays(45)->toDateString(),
                'requires_proof' => true,
                'proof_type'     => 'photo',
                'tips'           => ['Pilih tanaman lokal yang mudah tumbuh', 'Bisa pakai pot jika lahan terbatas', 'Foto sebelum dan sesudah penanaman'],
            ],
            [
                'title'          => 'Diet Daging 3 Hari',
                'description'    => 'Produksi daging sapi menghasilkan 27 kg CO₂ per kg daging. Coba diet daging selama 3 hari — makan nabati, tempe, tahu, dan sayuran lokal!',
                'emoji'          => '🥗',
                'category'       => 'food',
                'difficulty'     => 'sedang',
                'xp_reward'      => 120,
                'target_value'   => 3,
                'target_unit'    => 'hari',
                'duration_days'  => 7,
                'start_date'     => now()->toDateString(),
                'end_date'       => now()->addDays(30)->toDateString(),
                'requires_proof' => true,
                'proof_type'     => 'photo',
                'tips'           => ['Coba resep masakan nabati baru', 'Tempe dan tahu kaya protein', 'Foto makananmu setiap hari'],
            ],
        ];

        foreach ($challenges as $c) {
            Challenge::create($c);
        }
    }
}
