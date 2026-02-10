<?php

namespace Database\Seeders;

use App\Models\SubCategory;
use Illuminate\Database\Seeder;

class MigrateKeywordsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('data/job_title_mapping.json');
        
        if (!file_exists($path)) {
            $this->command->error("Mapping file not found at: {$path}");
            return;
        }

        $data = json_decode(file_get_contents($path), true);
        
        if (!isset($data['mappings'])) {
            $this->command->error("Invalid mapping format.");
            return;
        }

        foreach ($data['mappings'] as $mapping) {
            $subCategory = SubCategory::where('name', $mapping['sub_category'])->first();
            
            if ($subCategory) {
                $subCategory->update([
                    'keywords' => $mapping['keywords']
                ]);
                $this->command->info("Updated keywords for: {$mapping['sub_category']}");
            } else {
                $this->command->warn("SubCategory not found: {$mapping['sub_category']}");
            }
        }
    }
}
