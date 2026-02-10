<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;

class DefaultCategorizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = Category::firstOrCreate(['name' => 'À classifier']);
        
        SubCategory::firstOrCreate([
            'category_id' => $category->id,
            'name' => 'Général'
        ]);
    }
}
