<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class NewUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'admin@sedna.pe'
        ], [
            'name' => 'Admin',
            'lastname' => 'Sedna',
            'password' => 'sedna2025#'
        ])->assignRole('Admin');
    }
}
