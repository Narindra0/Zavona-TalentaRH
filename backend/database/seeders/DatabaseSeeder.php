<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategoriesTableSeeder::class,
            SkillsTableSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}