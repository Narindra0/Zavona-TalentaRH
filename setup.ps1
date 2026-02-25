# Script d'automatisation pour Zavona Talenta RH (Windows PowerShell)
# Ce script configure et démarre tout le projet automatiquement

# Configuration des couleurs
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

# Fonctions utilitaires
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $Colors.Blue
}

# Vérification des prérequis
Write-Host ""
Write-Host "📋 Vérification des prérequis..."

# Vérifier PHP
try {
    $phpVersion = php -r "echo PHP_VERSION;" 2>$null
    if ($phpVersion) {
        Write-Success "PHP $phpVersion trouvé"
    } else {
        throw "PHP non trouvé"
    }
} catch {
    Write-Error "PHP n'est pas installé ou n'est pas dans le PATH. Veuillez installer PHP 8.2+"
    exit 1
}

# Vérifier Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Success "Node.js $nodeVersion trouvé"
    } else {
        throw "Node.js non trouvé"
    }
} catch {
    Write-Error "Node.js n'est pas installé ou n'est pas dans le PATH. Veuillez installer Node.js 18+"
    exit 1
}

# Vérifier PostgreSQL
try {
    $postgresVersion = psql --version 2>$null
    if ($postgresVersion) {
        Write-Success "PostgreSQL trouvé"
    } else {
        throw "PostgreSQL non trouvé"
    }
} catch {
    Write-Warning "PostgreSQL n'est pas trouvé ou n'est pas dans le PATH"
    Write-Info "Assurez-vous que PostgreSQL est installé et en cours d'exécution"
}

# Vérifier Composer
try {
    $composerVersion = composer --version 2>$null
    if ($composerVersion) {
        Write-Success "Composer trouvé"
    } else {
        throw "Composer non trouvé"
    }
} catch {
    Write-Error "Composer n'est pas installé. Veuillez installer Composer"
    exit 1
}

# Installation des dépendances
Write-Host ""
Write-Host "📦 Installation des dépendances..."

# Installer les dépendances principales
Write-Info "Installation des dépendances principales (npm)..."
try {
    npm install
    Write-Success "Dépendances principales installées"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances principales"
    exit 1
}

# Installer les dépendances backend
Write-Info "Installation des dépendances backend..."
Set-Location backend
try {
    composer install --no-interaction
    Write-Success "Dépendances backend installées"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances backend"
    exit 1
}

try {
    npm install
    Write-Success "Dépendances npm backend installées"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances npm backend"
    exit 1
}

# Installer les dépendances frontend
Write-Info "Installation des dépendances frontend..."
Set-Location ../frontend
try {
    npm install
    Write-Success "Dépendances frontend installées"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances frontend"
    exit 1
}

# Retour à la racine
Set-Location ..

# Configuration de l'environnement
Write-Host ""
Write-Host "⚙️  Configuration de l'environnement..."

Set-Location backend

# Vérifier si .env existe
if (-not (Test-Path .env)) {
    Write-Info "Création du fichier .env..."
    Copy-Item .env.example .env
    Write-Success "Fichier .env créé"
} else {
    Write-Warning "Fichier .env déjà existant"
}

# Générer la clé Laravel
Write-Info "Génération de la clé Laravel..."
try {
    php artisan key:generate --force
    Write-Success "Clé Laravel générée"
} catch {
    Write-Error "Erreur lors de la génération de la clé Laravel"
    exit 1
}

# Configuration de la base de données
Write-Host ""
Write-Host "🗄️  Configuration de la base de données..."

# Demander les informations de la base de données
Write-Host ""
Write-Info "Veuillez configurer votre base de données PostgreSQL :"
Write-Host "Les informations suivantes sont requises pour configurer le fichier .env"

$dbName = Read-Host "Nom de la base de données (défaut: zavona_talenta_rh)"
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "zavona_talenta_rh" }

$dbUser = Read-Host "Utilisateur PostgreSQL (défaut: postgres)"
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "Mot de passe PostgreSQL" -AsSecureString
$dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

$dbHost = Read-Host "Hôte PostgreSQL (défaut: 127.0.0.1)"
if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "127.0.0.1" }

$dbPort = Read-Host "Port PostgreSQL (défaut: 5432)"
if ([string]::IsNullOrEmpty($dbPort)) { $dbPort = "5432" }

# Mettre à jour le fichier .env
Write-Info "Mise à jour du fichier .env..."
(Get-Content .env) | ForEach-Object {
    $_ -replace '^DB_DATABASE=.*', "DB_DATABASE=$dbName" `
       -replace '^DB_USERNAME=.*', "DB_USERNAME=$dbUser" `
       -replace '^DB_PASSWORD=.*', "DB_PASSWORD=$dbPasswordPlain" `
       -replace '^DB_HOST=.*', "DB_HOST=$dbHost" `
       -replace '^DB_PORT=.*', "DB_PORT=$dbPort"
} | Set-Content .env

Write-Success "Fichier .env mis à jour"

# Test de connexion à la base de données
Write-Info "Test de connexion à la base de données..."
try {
    $testResult = php artisan tinker --execute="try { \DB::connection()->getPdo(); echo 'SUCCESS'; } catch (\Exception \$e) { echo 'ERROR: ' . \$e->getMessage(); }" 2>$null
    if ($testResult -like "SUCCESS*") {
        Write-Success "Connexion à la base de données réussie"
    } else {
        Write-Error "Impossible de se connecter à la base de données"
        Write-Info "Veuillez vérifier vos informations et que PostgreSQL est en cours d'exécution"
        exit 1
    }
} catch {
    Write-Warning "Test de connexion échoué, mais l'installation peut continuer"
}

# Migration de la base de données
Write-Host ""
Write-Info "Migration de la base de données..."
try {
    php artisan migrate --force
    Write-Success "Migration de la base de données effectuée"
} catch {
    Write-Error "Erreur lors de la migration de la base de données"
    Write-Info "Veuillez vérifier manuellement avec: php artisan migrate"
    # Ne pas exit 1 pour permettre la continuation
}

# Retour à la racine
Set-Location ..

# Build des assets
Write-Host ""
Write-Host "🔨 Build des assets..."

Set-Location frontend
Write-Info "Build des assets frontend..."
try {
    npm run build
    Write-Success "Build frontend terminé"
} catch {
    Write-Warning "Le build frontend a échoué, mais ce n'est pas critique pour le développement"
}

Set-Location ../backend
Write-Info "Build des assets backend..."
try {
    npm run build
    Write-Success "Build backend terminé"
} catch {
    Write-Warning "Le build backend a échoué, mais ce n'est pas critique pour le développement"
}

Set-Location ..

# Création des scripts de démarrage
Write-Host ""
Write-Host "📜 Création des scripts de démarrage..."

# Script de démarrage rapide
$startScript = @'
@echo off
REM Script de démarrage rapide pour Zavona Talenta RH

echo 🚀 Démarrage de Zavona Talenta RH...

REM Démarrer le backend en arrière-plan
echo Démarrage du backend...
cd backend
start "Zavona Backend" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

REM Attendre que le backend démarre
timeout /t 3 /nobreak > nul

REM Démarrer le frontend en arrière-plan
echo Démarrage du frontend...
cd ../frontend
start "Zavona Frontend" cmd /k "npm run dev"

echo.
echo ✅ Services démarrés !
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:8000
echo 👤 Admin:    http://localhost:8000/login
echo.
echo Pour arrêter les services, fermez simplement les fenêtres de commande.
echo Pour voir les logs, utilisez: .\logs.ps1
pause
'@

Set-Content -Path "start.bat" -Value $startScript -Encoding UTF8

# Script PowerShell pour les logs
$logScript = @'
# Script pour voir les logs de Zavona Talenta RH

Write-Host "📋 Logs de Zavona Talenta RH" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue
Write-Host ""

# Logs Laravel
if (Test-Path backend/storage/logs/laravel.log) {
    Write-Host "🔧 Logs Laravel (dernières lignes):" -ForegroundColor Yellow
    Get-Content backend/storage/logs/laravel.log | Select-Object -Last 20
    Write-Host ""
} else {
    Write-Host "ℹ️  Aucun log Laravel trouvé" -ForegroundColor Gray
}

# Services en cours d'exécution
Write-Host "🔄 Services en cours d'exécution:" -ForegroundColor Yellow
$processes = Get-Process | Where-Object { $_.ProcessName -like "*php*" -or $_.ProcessName -like "*node*" }

$phpProcesses = $processes | Where-Object { $_.ProcessName -like "*php*" }
if ($phpProcesses) {
    Write-Host "✅ Backend PHP en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "❌ Backend arrêté" -ForegroundColor Red
}

$nodeProcesses = $processes | Where-Object { $_.ProcessName -like "*node*" }
if ($nodeProcesses) {
    Write-Host "✅ Frontend Node.js en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend arrêté" -ForegroundColor Red
}

Write-Host ""
Write-Host "URLs d'accès:" -ForegroundColor Blue
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "👤 Admin:    http://localhost:8000/login" -ForegroundColor White

Read-Host "Appuyez sur Entrée pour continuer"
'@

Set-Content -Path "logs.ps1" -Value $logScript -Encoding UTF8

# Script de configuration rapide
$configScript = @'
# Script de configuration rapide pour Zavona Talenta RH

Write-Host "⚙️  Configuration rapide de Zavona Talenta RH" -ForegroundColor Blue

# Créer un utilisateur administrateur
Write-Host ""
Write-Host "👤 Création d'un utilisateur administrateur:" -ForegroundColor Yellow

$name = Read-Host "Nom de l'administrateur"
$email = Read-Host "Email de l'administrateur"
$password = Read-Host "Mot de passe" -AsSecureString
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Set-Location backend

try {
    php artisan tinker --execute="
        \$user = \App\Models\User::create([
            'name' => '$name',
            'email' => '$email',
            'password' => \Hash::make('$passwordPlain')
        ]);
        echo '✅ Utilisateur administrateur créé avec succès';
    "
    Write-Host "✅ Utilisateur administrateur créé" -ForegroundColor Green
} catch {
    Write-Error "Erreur lors de la création de l'utilisateur"
    Write-Host "Vous pouvez créer manuellement un utilisateur avec:" -ForegroundColor Yellow
    Write-Host "php artisan tinker" -ForegroundColor Gray
    Write-Host "Puis: \App\Models\User::create(['name' => 'Nom', 'email' => 'email@example.com', 'password' => Hash::make('password')]);" -ForegroundColor Gray
}

Set-Location ..

Write-Host ""
Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host "Vous pouvez maintenant vous connecter à: http://localhost:8000/login" -ForegroundColor Blue

Read-Host "Appuyez sur Entrée pour continuer"
'@

Set-Content -Path "config-admin.ps1" -Value $configScript -Encoding UTF8

Write-Success "Scripts de démarrage créés"

# Finalisation
Write-Host ""
Write-Host "🎉 Configuration terminée avec succès !" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Success "Zavona Talenta RH est maintenant prêt à être utilisé !"
Write-Host ""
Write-Info "URLs d'accès:"
Write-Host "  📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  🔧 Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  👤 Admin:    http://localhost:8000/login" -ForegroundColor White
Write-Host ""
Write-Info "Commandes utiles:"
Write-Host "  🚀 Démarrer: .\start.bat" -ForegroundColor White
Write-Host "  📋 Logs:      .\logs.ps1" -ForegroundColor White
Write-Host "  👤 Config admin: .\config-admin.ps1" -ForegroundColor White
Write-Host ""
Write-Info "Documentation:"
Write-Host "  📖 Guide complet: README.md" -ForegroundColor White
Write-Host "  🚀 Prise en main: ONBOARDING.md" -ForegroundColor White
Write-Host "  🔧 Développement: DEVELOPMENT.md" -ForegroundColor White
Write-Host ""
Write-Warning "N'oubliez pas de:"
Write-Host "  - Exécuter .\config-admin.ps1 pour créer un utilisateur administrateur" -ForegroundColor Yellow
Write-Host "  - Vérifier la configuration des emails si nécessaire" -ForegroundColor Yellow
Write-Host "  - Consulter la documentation pour plus de détails" -ForegroundColor Yellow
Write-Host ""
Write-Success "Bon développement ! 🚀"

# Demander si l'utilisateur veut démarrer maintenant
Write-Host ""
$response = Read-Host "Voulez-vous démarrer l'application maintenant ? (O/N)"
if ($response -eq "O" -or $response -eq "o") {
    Write-Info "Démarrage de l'application..."
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "start.bat"
} else {
    Write-Info "Utilisez .\start.bat pour démarrer l'application quand vous êtes prêt"
}
