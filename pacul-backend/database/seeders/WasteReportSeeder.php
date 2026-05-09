<?php

namespace Database\Seeders;

use App\Models\{WasteReport, User};
use Illuminate\Database\Seeder;

class WasteReportSeeder extends Seeder
{
    public function run(): void
    {
        $citizen = User::where('role', 'user')->first()
            ?? User::create([
                'name'       => 'Warga Test',
                'email'      => 'warga@test.com',
                'password'   => bcrypt('password'),
                'city'       => 'Surabaya',
                'total_xp'   => 150,
                'current_xp' => 150,
            ]);

        $reports = [
            ['title' => 'Tumpukan Sampah di Jl. Raya Darmo', 'description' => 'Tumpukan sampah plastik dan sisa makanan yang sudah menumpuk lebih dari 3 hari. Menimbulkan bau tidak sedap dan mengganggu pejalan kaki.', 'category' => 'plastic', 'severity' => 'tinggi', 'status' => 'dilaporkan', 'lat' => -7.2829, 'lng' => 112.7363, 'address' => 'Jl. Raya Darmo No. 45, Surabaya', 'district' => 'Wonokromo'],
            ['title' => 'Sampah B3 di Pinggir Sungai Kalimas', 'description' => 'Ditemukan limbah oli bekas dan baterai rusak dibuang sembarangan di pinggir Sungai Kalimas. Sangat berbahaya bagi ekosistem sungai.', 'category' => 'b3', 'severity' => 'kritis', 'status' => 'diproses', 'lat' => -7.2490, 'lng' => 112.7505, 'address' => 'Pinggir Sungai Kalimas, Kel. Krembangan', 'district' => 'Krembangan', 'assigned_to' => 'BPLHD Surabaya'],
            ['title' => 'Kasur Bekas di Trotoar Gubeng', 'description' => 'Ada kasur dan sofa bekas yang ditinggalkan di trotoar Jl. Gubeng Pojok. Menghalangi akses pejalan kaki.', 'category' => 'bulk', 'severity' => 'sedang', 'status' => 'selesai', 'lat' => -7.2699, 'lng' => 112.7548, 'address' => 'Jl. Gubeng Pojok, Surabaya', 'district' => 'Gubeng', 'resolved_at' => now()->subDays(2)->toIso8601String(), 'resolution_notes' => 'Sampah telah diangkut oleh truk Dinas Kebersihan pada pagi hari.'],
            ['title' => 'Timbunan Sampah Organik di Pasar Wonokromo', 'description' => 'Sisa sayuran dan buah-buahan dari pedagang pasar menumpuk di belakang Pasar Wonokromo. Berpotensi menjadi sarang tikus dan nyamuk.', 'category' => 'organic', 'severity' => 'tinggi', 'status' => 'dilaporkan', 'lat' => -7.3012, 'lng' => 112.7305, 'address' => 'Belakang Pasar Wonokromo, Surabaya', 'district' => 'Wonokromo'],
            ['title' => 'HP Rusak Dibuang di TPS Kenjeran', 'description' => 'Banyak sampah elektronik (HP, charger, laptop rusak) dibuang bersama sampah biasa di TPS Kenjeran. Limbah elektronik berbahaya bagi lingkungan.', 'category' => 'electronic', 'severity' => 'sedang', 'status' => 'dilaporkan', 'lat' => -7.2350, 'lng' => 112.7802, 'address' => 'TPS Kenjeran, Jl. Kenjeran Raya', 'district' => 'Kenjeran'],
            ['title' => 'Sampah Plastik Mengapung di Pantai Kenjeran', 'description' => 'Banyak kantong plastik, botol plastik, dan sampah rumah tangga mengapung di sekitar pantai Kenjeran. Mengganggu keindahan dan ekosistem laut.', 'category' => 'plastic', 'severity' => 'kritis', 'status' => 'diproses', 'lat' => -7.2287, 'lng' => 112.8023, 'address' => 'Pantai Kenjeran, Jl. Pantai Kenjeran', 'district' => 'Kenjeran', 'assigned_to' => 'Dinas Kebersihan Kota Surabaya'],
            ['title' => 'Tong Sampah Penuh dan Meluber di Taman Bungkul', 'description' => 'Tong sampah di Taman Bungkul sudah penuh dan sampah meluber ke jalan. Perlu segera dikosongkan atau ditambah kapasitasnya.', 'category' => 'organic', 'severity' => 'rendah', 'status' => 'selesai', 'lat' => -7.2948, 'lng' => 112.7367, 'address' => 'Taman Bungkul, Jl. Raya Darmo', 'district' => 'Wonokromo', 'resolved_at' => now()->subDays(1)->toIso8601String(), 'resolution_notes' => 'Tong sampah telah dikosongkan dan tambahan tong dipasang.'],
            ['title' => 'Pembuangan Limbah Industri Kecil di Got', 'description' => 'Ada usaha kecil yang membuang sisa pewarna dan bahan kimia langsung ke got/saluran air di kawasan industri kecil Rungkut.', 'category' => 'b3', 'severity' => 'kritis', 'status' => 'dilaporkan', 'lat' => -7.3218, 'lng' => 112.7790, 'address' => 'Kawasan Industri Kecil Rungkut, Surabaya', 'district' => 'Rungkut'],
            ['title' => 'Sampah Berserakan di Area CFD Tunjungan', 'description' => 'Setelah kegiatan Car Free Day, banyak sampah plastik, botol, dan pembungkus makanan yang berserakan di kawasan Tunjungan. Butuh pembersihan segera.', 'category' => 'plastic', 'severity' => 'sedang', 'status' => 'selesai', 'lat' => -7.2565, 'lng' => 112.7375, 'address' => 'Jl. Tunjungan, Surabaya Pusat', 'district' => 'Genteng', 'resolved_at' => now()->subDays(3)->toIso8601String(), 'resolution_notes' => 'Area dibersihkan oleh tim kebersihan dalam 2 jam setelah CFD berakhir.'],
            ['title' => 'Konstruksi Bangunan Buang Puing di Jalan', 'description' => 'Material sisa konstruksi bangunan (batu bata, pasir, semen) dibuang di badan jalan di kawasan Mulyorejo. Berbahaya bagi pengendara.', 'category' => 'bulk', 'severity' => 'tinggi', 'status' => 'dilaporkan', 'lat' => -7.2682, 'lng' => 112.7906, 'address' => 'Jl. Mulyorejo Tengah, Surabaya Timur', 'district' => 'Mulyorejo'],
            ['title' => 'Styrofoam Bekas Pameran di Parkir JMP', 'description' => 'Puluhan kotak styrofoam sisa pameran ditinggalkan di parkiran JMP (Jembatan Merah Plaza). Styrofoam sulit terurai dan merusak lingkungan.', 'category' => 'plastic', 'severity' => 'sedang', 'status' => 'dilaporkan', 'lat' => -7.2438, 'lng' => 112.7380, 'address' => 'Parkir JMP, Jl. Kramat Gantung', 'district' => 'Bubutan'],
            ['title' => 'Got Tersumbat Sampah di Petemon', 'description' => 'Saluran air/got di kawasan Petemon tersumbat oleh sampah plastik dan organik. Berpotensi menjadi penyebab banjir saat hujan deras.', 'category' => 'plastic', 'severity' => 'tinggi', 'status' => 'diproses', 'lat' => -7.2758, 'lng' => 112.7276, 'address' => 'Jl. Petemon Barat, Surabaya', 'district' => 'Sawahan', 'assigned_to' => 'Komunitas Peduli Lingkungan'],
            ['title' => 'Sisa Acara Pernikahan di Pinggir Jalan', 'description' => 'Sisa dekorasi pernikahan (balon, plastik, kain) ditinggalkan di pinggir jalan Manyar. Perlu penanganan segera sebelum ditiup angin ke mana-mana.', 'category' => 'bulk', 'severity' => 'rendah', 'status' => 'dilaporkan', 'lat' => -7.2760, 'lng' => 112.7700, 'address' => 'Jl. Manyar Kertoarjo, Surabaya', 'district' => 'Mulyorejo'],
            ['title' => 'Pembuangan Sampah Ilegal di Lahan Kosong Semolowaru', 'description' => 'Lahan kosong di Semolowaru dijadikan tempat pembuangan sampah ilegal oleh warga sekitar. Perlu dipasang papan larangan dan dilakukan pembersihan rutin.', 'category' => 'organic', 'severity' => 'sedang', 'status' => 'dilaporkan', 'lat' => -7.3098, 'lng' => 112.7869, 'address' => 'Lahan Kosong Jl. Semolowaru Selatan', 'district' => 'Sukolilo'],
            ['title' => 'Sampah Medis di Tempat Sampah Umum Sukomanunggal', 'description' => 'Ditemukan jarum suntik, sarung tangan medis, dan masker medis bekas yang dibuang bersama sampah umum. Sangat berbahaya!', 'category' => 'b3', 'severity' => 'kritis', 'status' => 'diproses', 'lat' => -7.2624, 'lng' => 112.7084, 'address' => 'Jl. Sukomanunggal Jaya, Surabaya Barat', 'district' => 'Sukomanunggal', 'assigned_to' => 'BPLHD Surabaya'],
            ['title' => 'Botol Kaca Pecah di Area Bermain Anak Lakarsantri', 'description' => 'Ada botol kaca pecah yang berserakan di area bermain anak di taman Lakarsantri. Sangat berbahaya bagi anak-anak yang bermain.', 'category' => 'bulk', 'severity' => 'tinggi', 'status' => 'dilaporkan', 'lat' => -7.3192, 'lng' => 112.6698, 'address' => 'Taman Bermain Lakarsantri, Surabaya Barat', 'district' => 'Lakarsantri'],
            ['title' => 'Tumpukan Ban Bekas di Jl. Ahmad Yani', 'description' => 'Puluhan ban bekas kendaraan dibuang di pinggir jalan Ahmad Yani dekat underpass. Menjadi sarang nyamuk Aedes Aegypti dan memperburuk estetika kota.', 'category' => 'bulk', 'severity' => 'sedang', 'status' => 'selesai', 'lat' => -7.3156, 'lng' => 112.7248, 'address' => 'Jl. Ahmad Yani dekat Underpass, Surabaya', 'district' => 'Gayungan', 'resolved_at' => now()->subDays(5)->toIso8601String(), 'resolution_notes' => 'Ban bekas telah diangkut untuk didaur ulang oleh mitra Dinas Lingkungan Hidup.'],
            ['title' => 'Sampah Makanan dari Warung Malam di Benowo', 'description' => 'Sisa makanan dari warung lesehan malam di kawasan Benowo dibuang sembarangan di pinggir jalan. Mengundang tikus dan kecoa.', 'category' => 'organic', 'severity' => 'rendah', 'status' => 'dilaporkan', 'lat' => -7.2818, 'lng' => 112.6512, 'address' => 'Jl. Benowo, Surabaya Barat', 'district' => 'Pakal'],
            ['title' => 'Kemasan Obat dan Jarum di Saluran Air Tegalsari', 'description' => 'Kemasan obat-obatan dan jarum suntik ditemukan mengapung di saluran air kawasan Tegalsari. Kemungkinan dari klinik tidak resmi di sekitar area.', 'category' => 'b3', 'severity' => 'kritis', 'status' => 'dilaporkan', 'lat' => -7.2673, 'lng' => 112.7341, 'address' => 'Saluran Air Jl. Tegalsari Tengah, Surabaya', 'district' => 'Tegalsari'],
            ['title' => 'Plastik Kemasan Industri di Sungai Rolak', 'description' => 'Plastik kemasan industri besar (karung plastik, palet plastik) ditemukan di pinggir dan dalam Sungai Rolak. Perlu koordinasi dengan industri sekitar.', 'category' => 'plastic', 'severity' => 'tinggi', 'status' => 'diproses', 'lat' => -7.3145, 'lng' => 112.7192, 'address' => 'Sungai Rolak, Kawasan Industri Rungkut', 'district' => 'Rungkut', 'assigned_to' => 'Dinas Lingkungan Hidup'],
        ];

        foreach ($reports as $r) {
            WasteReport::create(array_merge($r, [
                'user_id'    => $citizen->id,
                'upvotes_count' => rand(0, 35),
                'xp_awarded' => 50,
            ]));
        }
    }
}
