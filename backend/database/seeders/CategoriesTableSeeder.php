<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Développement Informatique' => [
                'Développeur Frontend',
                'Développeur Backend',
                'Développeur Fullstack',
                'Développeur Mobile',
                'DevOps',
                'Data Scientist',
                'Administrateur Base de données',
            ],
            'Design & Création' => [
                'Designer UI/UX',
                'Graphiste',
                'Motion Designer',
                'Web Designer',
                'Illustrateur',
            ],
            'Marketing & Communication' => [
                'Responsable Marketing Digital',
                'Community Manager',
                'Content Manager',
                'Spécialiste SEO',
                'Chargé de Communication',
            ],
            'Commercial & Vente' => [
                'Commercial',
                'Business Developer',
                'Account Manager',
                'Responsable Vente',
                'Téléconseiller',
            ],
            'Ressources Humaines' => [
                'Recruteur',
                'Responsable RH',
                'Chargé de Formation',
                'Gestionnaire Paie',
                'Assistant RH',
            ],
            'Management & Direction' => [
                'Chef de Projet',
                'Directeur Technique',
                'Directeur Commercial',
                'Responsable d\'Équipe',
                'CEO',
            ],
            'Finance & Comptabilité' => [
                'Comptable',
                'Contrôleur de Gestion',
                'Analyste Financier',
                'Auditeur',
                'Trésorier',
            ],
        ];

        foreach ($categories as $categoryName => $subCategories) {
            $category = Category::create(['name' => $categoryName]);
            
            foreach ($subCategories as $subCategoryName) {
                SubCategory::create([
                    'category_id' => $category->id,
                    'name' => $subCategoryName
                ]);
            }
        }
    }
}