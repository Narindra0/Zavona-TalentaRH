<?php

/**
 * Script pour créer la base de données si elle n'existe pas
 * Usage: php create_database.php
 */

// Charger le fichier .env
function loadEnv($file) {
    if (!file_exists($file)) {
        return;
    }
    
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Supprimer les guillemets si présents
            if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                $value = substr($value, 1, -1);
            }
            
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

// Charger les variables d'environnement
loadEnv(__DIR__ . '/.env');

function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }
    return $value;
}

// Configuration de la base de données
$host = env('DB_HOST', '127.0.0.1');
$port = env('DB_PORT', '5432');
$username = env('DB_USERNAME', 'postgres');
$password = env('DB_PASSWORD', '');
$dbName = env('DB_DATABASE', 'zavona_talenta_rh');

try {
    echo "Tentative de connexion à PostgreSQL...\n";
    echo "Hôte: {$host}\n";
    echo "Port: {$port}\n";
    echo "Utilisateur: {$username}\n";
    echo "Base de données: {$dbName}\n\n";
    
    // Connexion à PostgreSQL (sans spécifier la base de données)
    $dsn = "pgsql:host={$host};port={$port}";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connexion à PostgreSQL réussie!\n";
    
    // Vérifier si la base de données existe
    $stmt = $pdo->prepare("SELECT 1 FROM pg_database WHERE datname = ?");
    $stmt->execute([$dbName]);
    $result = $stmt->fetch();
    
    if (!$result) {
        echo "La base de données '{$dbName}' n'existe pas. Création en cours...\n";
        
        // Créer la base de données
        $pdo->exec("CREATE DATABASE \"{$dbName}\"");
        
        echo "✅ Base de données '{$dbName}' créée avec succès!\n";
    } else {
        echo "✅ La base de données '{$dbName}' existe déjà.\n";
    }
    
    echo "\nVous pouvez maintenant exécuter les migrations avec:\n";
    echo "php artisan migrate\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "\nVeuillez vérifier:\n";
    echo "1. Que PostgreSQL est en cours d'exécution\n";
    echo "2. Que les identifiants dans le fichier .env sont corrects\n";
    echo "3. Que l'utilisateur PostgreSQL a les droits nécessaires\n";
    echo "4. Que le mot de passe '{$password}' est correct\n";
}
