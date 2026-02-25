# Script de création d'utilisateur administrateur pour Zavona Talenta RH

Write-Host "👤 Création d'un utilisateur administrateur" -ForegroundColor Blue
Write-Host "======================================" -ForegroundColor Blue
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "backend\artisan")) {
    Write-Error "Ce script doit être exécuté depuis la racine du projet Zavona Talenta RH"
    Write-Host "Assurez-vous que le fichier backend\artisan existe" -ForegroundColor Yellow
    exit 1
}

# Collecter les informations de l'administrateur
Write-Info "Veuillez entrer les informations de l'administrateur :"

$name = Read-Host "Nom complet"
$email = Read-Host "Adresse email"

# Validation de l'email
if ($email -notmatch "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$") {
    Write-Error "Format d'email invalide"
    exit 1
}

$password = Read-Host "Mot de passe (minimum 8 caractères)" -AsSecureString
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Validation du mot de passe
if ($passwordPlain.Length -lt 8) {
    Write-Error "Le mot de passe doit contenir au moins 8 caractères"
    exit 1
}

# Confirmation
Write-Host ""
Write-Host "Récapitulatif :" -ForegroundColor Yellow
Write-Host "Nom: $name" -ForegroundColor White
Write-Host "Email: $email" -ForegroundColor White
Write-Host "Mot de passe: [masqué]" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Confirmer la création de cet utilisateur ? (O/N)"
if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Info "Opération annulée"
    exit 0
}

# Création de l'utilisateur
Write-Host ""
Write-Info "Création de l'utilisateur administrateur..."

Set-Location backend

try {
    $result = php artisan tinker --execute="
        try {
            \$user = \App\Models\User::create([
                'name' => '$name',
                'email' => '$email',
                'password' => \Hash::make('$passwordPlain'),
                'email_verified_at' => now()
            ]);
            echo 'SUCCESS: Utilisateur créé avec ID ' . \$user->id;
        } catch (\Exception \$e) {
            echo 'ERROR: ' . \$e->getMessage();
        }
    " 2>$null

    if ($result -like "SUCCESS*") {
        Write-Success "Utilisateur administrateur créé avec succès !"
        Write-Host ""
        Write-Info "Vous pouvez maintenant vous connecter avec :"
        Write-Host "URL: http://localhost:8000/login" -ForegroundColor White
        Write-Host "Email: $email" -ForegroundColor White
        Write-Host "Mot de passe: celui que vous avez saisi" -ForegroundColor White
    } else {
        Write-Error "Erreur lors de la création de l'utilisateur: $result"
        Write-Host ""
        Write-Info "Alternative manuelle :" -ForegroundColor Yellow
        Write-Host "1. Lancez: cd backend && php artisan tinker" -ForegroundColor Gray
        Write-Host "2. Puis exécutez:" -ForegroundColor Gray
        Write-Host "   \App\Models\User::create([" -ForegroundColor Gray
        Write-Host "       'name' => '$name'," -ForegroundColor Gray
        Write-Host "       'email' => '$email'," -ForegroundColor Gray
        Write-Host "       'password' => Hash::make('votre_mot_de_passe')" -ForegroundColor Gray
        Write-Host "   ]);" -ForegroundColor Gray
    }
} catch {
    Write-Error "Erreur lors de l'exécution de la commande"
    Write-Info "Vérifiez que Laravel est correctement configuré" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Info "N'oubliez pas de démarrer l'application avec .\start.bat" -ForegroundColor Blue
