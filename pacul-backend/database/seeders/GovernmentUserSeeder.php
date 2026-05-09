<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class GovernmentUserSeeder extends Seeder
{
    public function run(): void
    {
        $govUsers = [
            [
                'name'            => 'Admin PACUL',
                'email'           => 'admin@pacul.gov.id',
                'password'        => Hash::make('pacul_admin_2024'),
                'role'            => 'admin',
                'government_unit' => 'PACUL Platform',
                'city'            => 'Surabaya',
                'level'           => 10,
                'total_xp'        => 5000,
                'current_xp'      => 5000,
            ],
            [
                'name'            => 'Budi Santoso',
                'email'           => 'budi@surabaya.go.id',
                'password'        => Hash::make('surabaya2024'),
                'role'            => 'government',
                'government_unit' => 'Dinas Kebersihan Kota Surabaya',
                'city'            => 'Surabaya',
                'district'        => 'Wonokromo',
                'level'           => 5,
                'total_xp'        => 1200,
                'current_xp'      => 1200,
            ],
            [
                'name'            => 'Siti Rahma',
                'email'           => 'siti@surabaya.go.id',
                'password'        => Hash::make('surabaya2024'),
                'role'            => 'government',
                'government_unit' => 'BPLHD Surabaya',
                'city'            => 'Surabaya',
                'district'        => 'Sukolilo',
                'level'           => 4,
                'total_xp'        => 900,
                'current_xp'      => 900,
            ],
            [
                'name'            => 'Hendra Wijaya',
                'email'           => 'hendra@surabaya.go.id',
                'password'        => Hash::make('surabaya2024'),
                'role'            => 'government',
                'government_unit' => 'Satuan Polisi Pamong Praja Surabaya',
                'city'            => 'Surabaya',
                'district'        => 'Gubeng',
                'level'           => 3,
                'total_xp'        => 600,
                'current_xp'      => 600,
            ],
        ];

        foreach ($govUsers as $u) {
            User::firstOrCreate(['email' => $u['email']], $u);
        }
    }
}
