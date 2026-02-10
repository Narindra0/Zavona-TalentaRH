<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrateur ZRTH',
            'email' => 'admin@zrth.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        echo "Utilisateur admin créé : admin@zrth.com / password123\n";
    }
}