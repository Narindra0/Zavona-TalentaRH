<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillsTableSeeder extends Seeder
{
    public function run(): void
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
    }
}