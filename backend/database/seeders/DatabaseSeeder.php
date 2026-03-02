<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Skill;
use App\Models\EmailTemplate;
use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Début du peuplement de la base de données...');
        
        // 1. Créer les catégories et sous-catégories
        $this->createCategoriesAndSubCategories();
        
        // 2. Créer la catégorie par défaut pour classification
        $this->createDefaultCategorization();
        
        // 3. Créer les compétences
        $this->createSkills();
        
        // 4. Créer les modèles d'email
        $this->createEmailTemplates();
        
        // 5. Migrer les mots-clés si le fichier existe
        $this->migrateKeywords();
        
        // 6. Initialiser les paramètres par défaut de l'application
        $this->initializeAppSettings();
        
        $this->command->info('Peuplement de la base de données terminé !');
    }
    
    /**
     * Créer les catégories et sous-catégories
     */
    private function createCategoriesAndSubCategories(): void
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
            $category = Category::firstOrCreate(['name' => $categoryName]);
            
            foreach ($subCategories as $subCategoryName) {
                SubCategory::firstOrCreate([
                    'category_id' => $category->id,
                    'name' => $subCategoryName
                ]);
            }
        }
        
        $this->command->info('✓ Catégories et sous-catégories créées');
    }
    
    /**
     * Créer la catégorie par défaut pour classification
     */
    private function createDefaultCategorization(): void
    {
        $category = Category::firstOrCreate(['name' => 'À classifier']);
        
        SubCategory::firstOrCreate([
            'category_id' => $category->id,
            'name' => 'Général'
        ]);
        
        $this->command->info('✓ Catégorie par défaut créée');
    }
    
    /**
     * Créer les compétences
     */
    private function createSkills(): void
    {
        $skills = [
            // Développement & Tech
            'PHP', 'Laravel', 'Symfony', 'JavaScript', 'TypeScript',
            'Vue.js', 'React', 'Angular', 'Node.js', 'Express.js',
            'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
            'C#', '.NET', 'ASP.NET', 'Ruby', 'Ruby on Rails',
            'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter',
            'React Native', 'Ionic', 'HTML5', 'CSS3', 'SASS/SCSS',
            'Bootstrap', 'Tailwind CSS', 'jQuery', 'Wordpress', 'Prestashop',
            
            // Bases de données
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'SQL Server', 'Oracle', 'SQLite', 'Firebase', 'MariaDB',
            
            // DevOps & Cloud
            'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
            'Linux', 'Apache', 'Nginx', 'Git', 'CI/CD',
            'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible',
            
            // Data Science & IA
            'Data Analysis', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
            'R', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch',
            'Tableau', 'Power BI', 'SQL',
            
            // Design & Produit
            'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch',
            'Adobe XD', 'InVision', 'Zeplin', 'UI Design', 'UX Design',
            'Prototypage', 'Wireframing', 'Product Management', 'Design Thinking',
            'Motion Design', 'After Effects', 'Premiere Pro',
            
            // Marketing & Ventes
            'SEO', 'SEM', 'Google Analytics', 'Google Ads', 'Facebook Ads',
            'Marketing Digital', 'Email Marketing', 'Content Marketing',
            'Réseaux Sociaux', 'Growth Hacking', 'Copywriting', 'CRM',
            'Salesforce', 'HubSpot', 'Prospection',
            
            // Management & Business
            'Gestion de projet', 'Agile/Scrum', 'Leadership', 'Management d\'équipe',
            'Business Development', 'Stratégie Commerciale', 'Négociation',
            'Finance', 'Comptabilité', 'Ressources Humaines', 'Recrutement',
            
            // Soft Skills
            'Communication', 'Travail d\'équipe', 'Résolution de problèmes',
            'Créativité', 'Adaptabilité', 'Organisation', 'Esprit d\'analyse',
            'Sens du détail', 'Autonomie', 'Gestion du temps',
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill]);
        }
        
        $this->command->info('✓ Compétences créées');
    }
    
    /**
     * Créer les modèles d'email
     */
    private function createEmailTemplates(): void
    {
        EmailTemplate::updateOrCreate(
            ['name' => 'recruiter_contacted'],
            [
                'subject' => 'Mise en relation avec {talent_name}',
                'body' => "Bonjour {recruiter_name},\n\nNous avons bien reçu votre intérêt pour {talent_name} de la part de {company}.\n\nUn consultant de ZANOVA va vous contacter prochainement pour organiser un entretien.\n\nCordialement,\nL'équipe ZANOVA",
                'variables_available' => json_encode(['recruiter_name', 'talent_name', 'company']),
                'sender_email' => 'contact@zanova.com'
            ]
        );
        
        $this->command->info('✓ Modèles d\'email créés');
    }
    
    /**
     * Migrer les mots-clés si le fichier de mapping existe
     */
    private function migrateKeywords(): void
    {
        $path = database_path('data/job_title_mapping.json');
        
        if (!file_exists($path)) {
            $this->command->warn("Fichier de mapping non trouvé : {$path}");
            return;
        }

        $data = json_decode(file_get_contents($path), true);
        
        if (!isset($data['mappings'])) {
            $this->command->warn("Format de mapping invalide.");
            return;
        }

        $updatedCount = 0;
        foreach ($data['mappings'] as $mapping) {
            $subCategory = SubCategory::where('name', $mapping['sub_category'])->first();
            
            if ($subCategory && isset($mapping['keywords'])) {
                $subCategory->update([
                    'keywords' => $mapping['keywords']
                ]);
                $updatedCount++;
            }
        }
        
        $this->command->info("✓ Mots-clés migrés pour {$updatedCount} sous-catégories");
    }
    
    /**
     * Initialiser les paramètres par défaut de l'application
     */
    private function initializeAppSettings(): void
    {
        AppSetting::initializeDefaults();
        
        $this->command->info('✓ Paramètres par défaut de l\'application initialisés');
    }
}