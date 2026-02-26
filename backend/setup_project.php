<?php

/**
 * Script de setup automatique pour le projet ZANOVA Talenta RH
 * Usage: php setup_project.php
 * Description: Configure automatiquement le projet pour un nouveau développeur
 */

echo "🚀 Setup automatique du projet ZANOVA Talenta RH\n";
echo "================================================\n\n";

// Vérifier si nous sommes dans le bon répertoire
if (!file_exists('artisan')) {
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire racine du backend Laravel.\n";
    exit(1);
}

echo "✅ Répertoire correct détecté\n\n";

// Charger l'environnement Laravel
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Fonction pour exécuter une commande Artisan
function runArtisanCommand($command, $description) {
    echo "📋 $description...\n";
    try {
        Artisan::call($command);
        echo "✅ $description terminée\n\n";
        return true;
    } catch (Exception $e) {
        echo "❌ Erreur lors de $description: " . $e->getMessage() . "\n\n";
        return false;
    }
}

// Fonction pour vérifier la connexion à la base de données
function checkDatabaseConnection() {
    echo "🔍 Vérification de la connexion à la base de données...\n";
    try {
        DB::connection()->getPdo();
        echo "✅ Connexion à la base de données établie\n\n";
        return true;
    } catch (Exception $e) {
        echo "❌ Erreur de connexion à la base de données: " . $e->getMessage() . "\n";
        echo "💡 Veuillez vérifier votre fichier .env et vous assurer que la base de données est configurée.\n\n";
        return false;
    }
}

// Fonction pour créer le fichier .env s'il n'existe pas
function createEnvFile() {
    if (!file_exists('.env')) {
        echo "📝 Création du fichier .env...\n";
        $envContent = file_get_contents('.env.example');
        
        // Remplacer les valeurs par défaut
        $envContent = str_replace('DB_DATABASE=laravel', 'DB_DATABASE=zavona_talenta_rh', $envContent);
        $envContent = str_replace('DB_USERNAME=root', 'DB_USERNAME=postgres', $envContent);
        $envContent = str_replace('DB_PASSWORD=', 'DB_PASSWORD=password', $envContent);
        
        file_put_contents('.env', $envContent);
        echo "✅ Fichier .env créé avec les valeurs par défaut\n";
        echo "⚠️  Veuillez modifier le fichier .env avec vos propres informations de base de données\n\n";
        return true;
    } else {
        echo "✅ Fichier .env déjà existant\n\n";
        return false;
    }
}

// Étapes du setup
$steps = [
    'check_env' => ['Vérification du fichier .env', 'createEnvFile'],
    'check_db' => ['Vérification de la base de données', 'checkDatabaseConnection'],
    'migrate' => ['Migration de la base de données', function() {
        return runArtisanCommand('migrate:fresh --seed', 'Migration et seed');
    }],
    'cache_clear' => ['Nettoyage du cache', function() {
        return runArtisanCommand('cache:clear', 'Nettoyage du cache');
    }],
    'config_clear' => ['Nettoyage de la configuration', function() {
        return runArtisanCommand('config:clear', 'Nettoyage de la configuration');
    }],
    'route_cache' => ['Mise en cache des routes', function() {
        return runArtisanCommand('route:cache', 'Mise en cache des routes');
    }],
    'view_cache' => ['Mise en cache des vues', function() {
        return runArtisanCommand('view:cache', 'Mise en cache des vues');
    }],
    'storage_link' => ['Création des liens symboliques', function() {
        return runArtisanCommand('storage:link', 'Création des liens symboliques');
    }],
];

// Exécuter les étapes
$failedSteps = [];
foreach ($steps as $stepKey => $step) {
    [$description, $function] = $step;
    
    if ($stepKey === 'check_env') {
        $result = $function();
        if ($result) {
            echo "⚠️  Le fichier .env a été créé. Veuillez le modifier et relancer ce script.\n";
            exit(0);
        }
    } else {
        if (!$function()) {
            $failedSteps[] = $description;
        }
    }
}

// Vérification finale
if (empty($failedSteps)) {
    echo "🎉 Setup terminé avec succès !\n";
    echo "================================================\n";
    echo "📊 Informations importantes:\n";
    echo "   • Base de données: zavona_talenta_rh\n";
    echo "   • Admin par défaut: admin@zanova.mg / admin123\n";
    echo "   • URL admin: http://localhost:8000/admin\n";
    echo "   • URL API: http://localhost:8000/api\n\n";
    echo "🔧 Commandes utiles:\n";
    echo "   • Démarrer le serveur: php artisan serve\n";
    echo "   • Vider les caches: php artisan optimize:clear\n";
    echo "   • Créer un admin: php artisan tinker --execute=\"User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make('password'), 'role' => 'admin']);\"\n\n";
    echo "📚 Documentation:\n";
    echo "   • API: /api/documentation (si disponible)\n";
    echo "   • Routes: php artisan route:list\n";
    echo "   • Tests: php artisan test\n\n";
    echo "🚀 Le projet est prêt à être utilisé !\n";
} else {
    echo "❌ Setup terminé avec des erreurs:\n";
    foreach ($failedSteps as $failedStep) {
        echo "   • $failedStep\n";
    }
    echo "\n💡 Veuillez corriger les erreurs ci-dessus et relancer le script.\n";
}
