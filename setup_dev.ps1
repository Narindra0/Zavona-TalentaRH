# Script de setup automatique pour ZANOVA Talenta RH (Windows PowerShell)
# Usage: .\setup_dev.ps1

Write-Host "🚀 Setup automatique du projet ZANOVA Talenta RH" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Vérifier si nous sommes dans le bon répertoire
if (-not (Test-Path "artisan")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le répertoire racine du projet." -ForegroundColor Red
    Write-Host "   Naviguez vers le répertoire racine de ZANOVA-TalentaRH et relancez ce script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Répertoire correct détecté" -ForegroundColor Green
Write-Host ""

# Fonction pour exécuter une commande
function Run-Command($command, $description, $workingDir = ".") {
    Write-Host "📋 $description..." -ForegroundColor Blue
    try {
        Set-Location $workingDir
        $result = Invoke-Expression $command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $description terminée" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors de $description" -ForegroundColor Red
            return $false
        }
        Write-Host ""
        return $true
    } catch {
        Write-Host "❌ Erreur lors de $description: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Fonction pour vérifier si une commande existe
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Vérifier les prérequis
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Blue

$prerequisites = @{
    "php" = "PHP 8.1+"
    "composer" = "Composer"
    "node" = "Node.js 16+"
    "npm" = "npm"
}

$missingPrereqs = @()
foreach ($cmd in $prerequisites.Keys) {
    if (-not (Test-Command $cmd)) {
        $missingPrereqs += $prerequisites[$cmd]
    }
}

if ($missingPrereqs.Count -gt 0) {
    Write-Host "❌ Prérequis manquants:" -ForegroundColor Red
    foreach ($missing in $missingPrereqs) {
        Write-Host "   • $missing" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "💡 Veuillez installer les prérequis manquants et relancer ce script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Tous les prérequis sont installés" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "📦 Configuration du Backend..." -ForegroundColor Blue
Set-Location "backend"

# Vérifier si composer est installé
if (-not (Test-Command "composer")) {
    Write-Host "❌ Composer n'est pas installé. Veuillez l'installer depuis https://getcomposer.org/" -ForegroundColor Red
    exit 1
}

# Installer les dépendances
if (-not (Run-Command "composer install" "Installation des dépendances Composer")) {
    exit 1
}

# Créer le fichier .env s'il n'existe pas
if (-not (Test-Path ".env")) {
    Write-Host "📝 Création du fichier .env..." -ForegroundColor Blue
    Copy-Item ".env.example" ".env"
    
    # Modifier les valeurs par défaut
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace 'DB_DATABASE=laravel', 'DB_DATABASE=zavona_talenta_rh'
    $envContent = $envContent -replace 'DB_USERNAME=root', 'DB_USERNAME=postgres'
    $envContent = $envContent -replace 'DB_PASSWORD=', 'DB_PASSWORD=password'
    $envContent | Set-Content ".env"
    
    Write-Host "✅ Fichier .env créé avec les valeurs par défaut" -ForegroundColor Green
    Write-Host "⚠️  Veuillez modifier le fichier backend\.env avec vos propres informations de base de données" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Configuration requise dans .env:" -ForegroundColor Yellow
    Write-Host "   • DB_HOST: localhost ou votre serveur PostgreSQL" -ForegroundColor Yellow
    Write-Host "   • DB_DATABASE: zavona_talenta_rh" -ForegroundColor Yellow
    Write-Host "   • DB_USERNAME: votre utilisateur PostgreSQL" -ForegroundColor Yellow
    Write-Host "   • DB_PASSWORD: votre mot de passe PostgreSQL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Une fois .env modifié, relancez ce script." -ForegroundColor Yellow
    exit 0
}

# Générer la clé d'application
Run-Command "php artisan key:generate" "Génération de la clé d'application"

# Exécuter les migrations
if (-not (Run-Command "php artisan migrate:fresh --seed" "Migration de la base de données")) {
    exit 1
}

# Nettoyer les caches
Run-Command "php artisan cache:clear" "Nettoyage du cache"
Run-Command "php artisan config:clear" "Nettoyage de la configuration"
Run-Command "php artisan route:clear" "Nettoyage des routes"
Run-Command "php artisan view:clear" "Nettoyage des vues"

# Créer les liens symboliques
Run-Command "php artisan storage:link" "Création des liens symboliques"

# Optimiser pour la production
Run-Command "php artisan optimize" "Optimisation de l'application"

Write-Host "✅ Backend configuré avec succès!" -ForegroundColor Green
Write-Host ""

# Setup Frontend
Write-Host "📦 Configuration du Frontend..." -ForegroundColor Blue
Set-Location "../frontend"

# Installer les dépendances npm
if (-not (Run-Command "npm install" "Installation des dépendances npm")) {
    exit 1
}

# Construire les assets pour la production
Run-Command "npm run build" "Construction des assets"

Write-Host "✅ Frontend configuré avec succès!" -ForegroundColor Green
Write-Host ""

# Retour au répertoire racine
Set-Location ".."

# Informations finales
Write-Host "🎉 Setup terminé avec succès !" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "📊 Informations importantes:" -ForegroundColor Blue
Write-Host "   • Base de données: zavona_talenta_rh" -ForegroundColor White
Write-Host "   • Admin par défaut: admin@zanova.mg / admin123" -ForegroundColor White
Write-Host "   • URL admin: http://localhost:8000/admin" -ForegroundColor White
Write-Host "   • URL frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   • URL API: http://localhost:8000/api" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Pour démarrer le projet:" -ForegroundColor Blue
Write-Host "   Terminal 1 (Backend): cd backend && php artisan serve" -ForegroundColor White
Write-Host "   Terminal 2 (Frontend): cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Commandes utiles:" -ForegroundColor Blue
Write-Host "   • Vider les caches: php artisan optimize:clear" -ForegroundColor White
Write-Host "   • Voir les routes: php artisan route:list" -ForegroundColor White
Write-Host "   • Lancer Tinker: php artisan tinker" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  N'oubliez pas de:" -ForegroundColor Yellow
Write-Host "   • Changer le mot de passe admin par défaut" -ForegroundColor Yellow
Write-Host "   • Configurer votre email dans .env" -ForegroundColor Yellow
Write-Host "   • Vérifier la configuration de la base de données" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation: backend/README_DEVELOPER.md" -ForegroundColor Blue
Write-Host ""
Write-Host "🎯 Le projet est prêt à être utilisé !" -ForegroundColor Green
