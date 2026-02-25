@echo off
echo Configuration de la base de données Zavona Talenta RH...
echo.

REM Vérifier si le fichier .env existe
if not exist ".env" (
    echo Copie du fichier .env.example vers .env...
    copy .env.example .env
    echo.
    echo ⚠️  Veuillez éditer le fichier .env et configurer vos identifiants PostgreSQL
    echo    - DB_PASSWORD: votre mot de passe PostgreSQL
    echo    - DB_USERNAME: votre utilisateur PostgreSQL (généralement postgres)
    pause
    exit /b 1
)

REM Exécuter le script de création de base de données
echo Création de la base de données si nécessaire...
php create_database.php

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Exécution des migrations...
    php artisan migrate
    
    echo.
    echo Exécution des seeders...
    php artisan db:seed
    
    echo.
    echo ✅ Configuration terminée avec succès!
) else (
    echo.
    echo ❌ Erreur lors de la configuration de la base de données.
    echo Veuillez vérifier vos paramètres PostgreSQL dans le fichier .env
)

pause
