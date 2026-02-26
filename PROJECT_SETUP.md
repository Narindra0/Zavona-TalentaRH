# 🚀 ZANOVA Talenta RH - Guide d'Installation Complet

Ce guide explique comment mettre en place rapidement le projet ZANOVA Talenta RH sur votre machine de développement.

## 📋 Prérequis

### Requis système
- **PHP 8.1+** avec extensions: PDO, PostgreSQL, Mbstring, Tokenizer, XML, Ctype, JSON, Fileinfo, OpenSSL
- **Composer** 2.0+
- **Node.js** 16.0+
- **npm** 8.0+
- **PostgreSQL** 12+

### Plateformes supportées
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 18.04+)

## 🎯 Installation Rapide

### Option 1: Script Automatique (Recommandé)

#### Windows
```powershell
# Clonez le projet
git clone <repository-url>
cd Zavona-TalentaRH

# Exécutez le script PowerShell
.\setup_dev.ps1
```

#### Linux/macOS
```bash
# Clonez le projet
git clone <repository-url>
cd Zavona-TalentaRH

# Rendez le script exécutable puis exécutez-le
chmod +x setup_dev.sh
./setup_dev.sh
```

### Option 2: Installation Manuelle

#### 1. Backend
```bash
cd backend
composer install
cp .env.example .env
# Configurez votre base de données dans .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan optimize
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run build
```

## ⚙️ Configuration

### Base de données PostgreSQL

#### Créer la base de données
```sql
CREATE DATABASE zavona_talenta_rh;
CREATE USER zanova_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE zavona_talenta_rh TO zanova_user;
```

#### Configuration .env
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=zavona_talenta_rh
DB_USERNAME=zanova_user
DB_PASSWORD=votre_mot_de_passe
```

### Configuration Email
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=votre_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@zanova.mg
MAIL_FROM_NAME="ZANOVA Talenta RH"
```

## 🚀 Démarrage

### Développement Local
```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### URLs d'accès
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Dashboard**: http://localhost:8000/admin

### Compte Admin par défaut
- **Email**: admin@zanova.mg
- **Mot de passe**: admin123

⚠️ **Important**: Changez ce mot de passe en production !

## 📊 Structure du Projet

```
Zavona-TalentaRH/
├── backend/                    # Application Laravel
│   ├── app/
│   │   ├── Http/Controllers/   # Contrôleurs API
│   │   ├── Models/            # Modèles Eloquent
│   │   ├── Services/          # Logique métier
│   │   └── Resources/         # Resources API
│   ├── database/
│   │   ├── migrations/        # Migrations de base de données
│   │   └── seeders/           # Données initiales
│   ├── routes/
│   │   └── api.php            # Routes API
│   └── .env.example          # Configuration par défaut
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/            # Pages principales
│   │   ├── layouts/          # Layouts
│   │   └── api/              # Configuration API
│   ├── public/               # Fichiers statiques
│   └── package.json          # Dépendances npm
├── setup_dev.ps1              # Script Windows
├── setup_dev.sh               # Script Linux/macOS
└── README.md                  # Documentation
```

## 🗄️ Base de Données

### Tables principales
- `users` - Administrateurs
- `candidates` - Candidats avec tarifications
- `categories` - Catégories d'emplois
- `sub_categories` - Sous-catégories
- `skills` - Compétences techniques
- `candidate_skills` - Relations candidats-compétences
- `cv_files` - Fichiers CV
- `recruiter_interests` - Intérêts des recruteurs

### Champs Prestataires
Dans la table `candidates`:
- `contract_type` = 'Prestataire'
- `rate_type` = 'daily' | 'weekly'
- `daily_rate` - Tarif journalier (decimal)
- `weekly_rate` - Tarif hebdomadaire (decimal)

## 🔧 Développement

### Commandes Utiles

#### Backend (Laravel)
```bash
# Vider les caches
php artisan optimize:clear

# Voir les routes
php artisan route:list

# Créer une migration
php artisan make:migration create_table_name

# Créer un contrôleur
php artisan make:controller ControllerName

# Lancer Tinker (console PHP)
php artisan tinker

# Tests
php artisan test
```

#### Frontend (React)
```bash
# Installer une dépendance
npm install package-name

# Lancer en développement
npm run dev

# Construire pour production
npm run build

# Linter
npm run lint
```

### Conventions de Codage
- **PHP**: PSR-12
- **JavaScript**: ESLint + Prettier
- **CSS**: TailwindCSS
- **Git**: Conventional Commits

## 🧪 Tests

### Types de tests
- Tests unitaires (PHPUnit)
- Tests d'intégration API
- Tests E2E (Playwright)

### Lancer les tests
```bash
# Tous les tests
php artisan test

# Tests spécifiques
php artisan test --filter CandidateTest
```

## 📦 Déploiement

### Production
```bash
# Optimiser l'application
php artisan optimize

# Mettre en cache
php artisan route:cache
php artisan view:cache
php artisan config:cache

# Permissions fichiers
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### Variables d'environnement production
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com
```

## 🔍 Dépannage

### Problèmes Communs

#### Erreur 500 sur les stats
```bash
# Vérifier la route dans api.php
# Vérifier l'import DB dans CandidateController
php artisan route:list | grep stats
```

#### Tarifications non affichées
```bash
# Vérifier la migration prestataire
php artisan migrate:status

# Vérifier les champs dans CandidateResource
grep -r "rate_type\|daily_rate\|weekly_rate" app/Http/Resources/
```

#### Erreur de connexion base de données
```bash
# Tester la connexion
php artisan tinker --execute="DB::connection()->getPdo()"

# Vérifier la configuration
php artisan config:cache:clear
```

### Logs
- **Laravel**: `storage/logs/laravel.log`
- **PHP Error Log**: `/var/log/php_errors.log`
- **Web Server**: `/var/log/nginx/error.log`

## 📚 Documentation

### Documentation Interne
- `backend/README_DEVELOPER.md` - Guide développeur
- `backend/app/Http/Controllers/` - Documentation API inline
- Code comments et PHPDoc

### Documentation Externe
- [Laravel Documentation](https://laravel.com/docs/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contribution

1. Forker le projet
2. Créer une branche: `git checkout -b feature/nouvelle-fonctionnalite`
3. Faire les modifications
4. Tester: `php artisan test && npm test`
5. Commit: `git commit -m "feat: ajouter nouvelle fonctionnalité"`
6. Push: `git push origin feature/nouvelle-fonctionnalite`
7. Pull Request

## 📞 Support

### Canaux de communication
- **Issues GitHub**: Signaler des bugs
- **Email**: dev@zanova.mg
- **Slack**: Canal #dev-zanova

### Temps de réponse
- **Bugs critiques**: 24h
- **Questions générales**: 48h
- **Nouvelles fonctionnalités**: Selon roadmap

---

**ZANOVA Talenta RH** © 2026 - Connecter les talents aux meilleures opportunités 🇲🇬
