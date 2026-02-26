<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration complète pour la mise en place du projet ZANOVA Talenta RH
 * Cette migration crée toutes les tables nécessaires avec la structure complète
 * Date: 2026-02-26
 * Description: Setup complet de la base de données pour faciliter le déploiement
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tables système Laravel
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['admin'])->default('admin');
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration')->index();
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration')->index();
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });

        // Tables de l'application
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150)->unique();
            $table->timestamps();
        });

        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name', 150)->unique();
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Table candidates avec tous les champs y compris les prestataires
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('position_searched');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('sub_category_id')->constrained('sub_categories')->onDelete('cascade');
            $table->enum('experience_level', ['débutant', 'junior', 'intermédiaire', 'senior', 'expert'])->default('junior');
            $table->text('description')->nullable();
            $table->enum('status', ['PENDING', 'ACTIVE', 'HIRED', 'ARCHIVED'])->default('PENDING');
            $table->enum('contract_type', ['CDI', 'CDD', 'STAGE', 'Prestataire', 'TOUS'])->nullable();
            
            // Champs pour les prestataires
            $table->enum('rate_type', ['daily', 'weekly'])->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->decimal('weekly_rate', 10, 2)->nullable();
            
            $table->timestamps();
        });

        Schema::create('candidate_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->foreignId('skill_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('cv_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->string('original_filename')->nullable();
            $table->enum('source', ['MANUAL', 'FACEBOOK', 'IMPORT'])->default('MANUAL');
            $table->boolean('parsed')->default(false);
            $table->string('signed_url')->nullable(); // Pour les URLs signées
            $table->timestamps();
        });

        Schema::create('recruiter_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('recruiter_name')->nullable();
            $table->enum('status', ['PENDING', 'CONTACTED', 'REJECTED'])->default('PENDING');
            $table->text('message')->nullable();
            $table->timestamps();
        });

        Schema::create('pending_categories', function (Blueprint $table) {
            $table->id();
            $table->string('original_title');
            $table->string('suggested_category')->nullable();
            $table->string('suggested_subcategory')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('subject');
            $table->text('body');
            $table->string('sender_email')->nullable();
            $table->json('variables_available')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('group'); // email, company, application, etc.
            $table->string('key');
            $table->json('value');
            $table->string('type')->default('string'); // string, integer, boolean, json, etc.
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false); // visible par tous ou admin seulement
            $table->timestamps();
            
            $table->unique(['group', 'key']);
            $table->index(['group', 'is_public']);
        });

        // Insertion des données de base
        $this->seedBasicData();
    }

    /**
     * Insertion des données de base
     */
    private function seedBasicData(): void
    {
        // Créer un utilisateur admin par défaut
        DB::table('users')->insert([
            'name' => 'Administrateur ZANOVA',
            'email' => 'admin@zanova.mg',
            'password' => Hash::make('admin123'), // À changer en production
            'role' => 'admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Catégories de base
        $categories = [
            ['name' => 'Informatique et Technologies'],
            ['name' => 'Marketing et Communication'],
            ['name' => 'Finance et Comptabilité'],
            ['name' => 'Ressources Humaines'],
            ['name' => 'Ventes et Commerce'],
            ['name' => 'Logistique et Supply Chain'],
            ['name' => 'Juridique et Conformité'],
            ['name' => 'Production et Opérations'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'name' => $category['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Sous-catégories informatiques
        $itCategoryId = DB::table('categories')->where('name', 'Informatique et Technologies')->first()->id;
        $itSubCategories = [
            ['category_id' => $itCategoryId, 'name' => 'Développement Web'],
            ['category_id' => $itCategoryId, 'name' => 'Développement Mobile'],
            ['category_id' => $itCategoryId, 'name' => 'Base de Données'],
            ['category_id' => $itCategoryId, 'name' => 'Réseaux et Sécurité'],
            ['category_id' => $itCategoryId, 'name' => 'DevOps et Cloud'],
            ['category_id' => $itCategoryId, 'name' => 'UI/UX Design'],
            ['category_id' => $itCategoryId, 'name' => 'Data Science'],
            ['category_id' => $itCategoryId, 'name' => 'Support Technique'],
        ];

        foreach ($itSubCategories as $subCategory) {
            DB::table('sub_categories')->insert([
                'category_id' => $subCategory['category_id'],
                'name' => $subCategory['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Compétences techniques de base
        $skills = [
            'PHP', 'JavaScript', 'React', 'Vue.js', 'Laravel', 'Node.js',
            'Python', 'Java', 'C#', 'SQL', 'MongoDB', 'PostgreSQL',
            'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git',
            'HTML', 'CSS', 'TypeScript', 'Angular', 'Symfony',
            'WordPress', 'Magento', 'Shopify', 'Figma', 'Adobe XD'
        ];

        foreach ($skills as $skill) {
            DB::table('skills')->insert([
                'name' => $skill,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Templates d'email de base
        $emailTemplates = [
            [
                'name' => 'candidate_interest_confirmation',
                'subject' => 'Confirmation de votre intérêt pour le candidat {{candidate_name}}',
                'body' => 'Bonjour {{recruiter_name}},\n\nNous avons bien reçu votre intérêt pour le candidat {{candidate_name}}. Notre équipe vous contactera prochainement.\n\nCordialement,\nL\'équipe ZANOVA',
                'variables_available' => json_encode(['candidate_name', 'recruiter_name', 'company_name']),
            ],
            [
                'name' => 'candidate_status_update',
                'subject' => 'Mise à jour de votre candidature chez ZANOVA',
                'body' => 'Bonjour {{candidate_name}},\n\nVotre candidature a été mise à jour.\n\nStatut actuel : {{status}}\n\nCordialement,\nL\'équipe ZANOVA',
                'variables_available' => json_encode(['candidate_name', 'status', 'position']),
            ],
        ];

        foreach ($emailTemplates as $template) {
            DB::table('email_templates')->insert([
                'name' => $template['name'],
                'subject' => $template['subject'],
                'body' => $template['body'],
                'variables_available' => $template['variables_available'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Paramètres de l'application
        $appSettings = [
            [
                'group' => 'company',
                'key' => 'name',
                'value' => json_encode('ZANOVA Talenta RH'),
                'type' => 'string',
                'description' => 'Nom de l\'entreprise',
                'is_public' => true,
            ],
            [
                'group' => 'company',
                'key' => 'email',
                'value' => json_encode('contact@zanova.mg'),
                'type' => 'string',
                'description' => 'Email de contact principal',
                'is_public' => true,
            ],
            [
                'group' => 'company',
                'key' => 'phone',
                'value' => json_encode('+261 34 00 000 00'),
                'type' => 'string',
                'description' => 'Téléphone de contact',
                'is_public' => true,
            ],
            [
                'group' => 'application',
                'key' => 'max_cv_size',
                'value' => json_encode(2048),
                'type' => 'integer',
                'description' => 'Taille maximale des CV en KB',
                'is_public' => false,
            ],
            [
                'group' => 'application',
                'key' => 'auto_approve_candidates',
                'value' => json_encode(false),
                'type' => 'boolean',
                'description' => 'Approuver automatiquement les nouveaux candidats',
                'is_public' => false,
            ],
        ];

        foreach ($appSettings as $setting) {
            DB::table('app_settings')->insert([
                'group' => $setting['group'],
                'key' => $setting['key'],
                'value' => $setting['value'],
                'type' => $setting['type'],
                'description' => $setting['description'],
                'is_public' => $setting['is_public'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('recruiter_interests');
        Schema::dropIfExists('pending_categories');
        Schema::dropIfExists('cv_files');
        Schema::dropIfExists('candidate_skills');
        Schema::dropIfExists('candidates');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('sub_categories');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('users');
    }
};
