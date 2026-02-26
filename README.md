# Zavona Talenta RH - Documentation Complète

## 📋 Vue d'ensemble

**Zavona Talenta RH** est une plateforme de gestion des talents et des ressources humaines développée avec une architecture moderne séparée en deux parties :
- **Backend** : API Laravel 12 avec PostgreSQL
- **Frontend** : Application React 19 avec Vite et TailwindCSS

## 🏗️ Architecture Technique

### Backend (Laravel 12)
- **Framework** : Laravel 12
- **Base de données** : PostgreSQL
- **PHP** : Version 8.2+
- **Authentification** : Laravel Sanctum
- **Queue** : Database Queue System
- **Fonctionnalités principales** :
  - Gestion des candidats
  - Parsing de CV (PDF)
  - Catégorisation automatique des talents
  - Configuration d'emails
  - Export Excel (Maatwebsite/Excel)

### Frontend (React 19)
- **Framework** : React 19 avec Vite
- **Routing** : React Router DOM v7
- **Styling** : TailwindCSS v4
- **Icons** : Lucide React
- **HTTP Client** : Axios
- **Fonctionnalités principales** :
  - Interface publique pour les candidats
  - Panneau d'administration protégé
  - Gestion des offres d'emploi
  - Système de cookies consentement

## 📁 Structure du Projet

```
Zavona-TalentaRH/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # Contrôleurs API
│   │   │   │   ├── Admin/      # Administration
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CandidateController.php
│   │   │   │   └── ...
│   │   ├── Models/             # Modèles Eloquent
│   │   └── Mail/               # Emails
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── resources/
│   │   └── views/              # Vues Blade (admin)
│   ├── routes/
│   │   ├── api.php             # Routes API
│   │   └── web.php             # Routes web
│   └── .env.example            # Configuration environnement
├── frontend/                   # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/         # Composants React
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── CookieConsent.jsx
│   │   │   └── ...
│   │   ├── pages/              # Pages
│   │   │   ├── admin/          # Administration
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   │   ├── api/                # Appels API
│   │   ├── assets/             # Assets statiques
│   │   ├── App.jsx             # Router principal
│   │   └── main.jsx            # Point d'entrée
│   └── package.json
├── package.json                # Scripts racine
└── README.md                   # Cette documentation
```

## 🔧 Configuration

### Variables d'environnement importantes (.env)
```env
# Application
APP_NAME="Zavona Talenta RH"
APP_DEBUG=true
APP_URL=http://localhost

# Base de données
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=zavona_talenta_rh
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# Mail (pour les notifications)
MAIL_MAILER=smtp
MAIL_HOST=votre_serveur_smtp
MAIL_PORT=587
MAIL_USERNAME=votre_email
MAIL_PASSWORD=votre_mot_de_passe
MAIL_FROM_ADDRESS="noreply@zavona-talenta-rh.com"
```

## 🌐 Routes et URLs

### Backend (API)
- **Serveur** : `http://localhost:8000`
- **API Base** : `http://localhost:8000/api`
- **Admin** : `http://localhost:8000/admin`

### Frontend
- **Développement** : `http://localhost:5173`
- **Production** : `http://localhost:8000` (via Vite build)

### Routes principales
| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page d'accueil publique | Public |
| `/talents` | Liste des candidats | Public |
| `/login` | Connexion administration | Public |
| `/postuler` | Formulaire de candidature | Public |
| `/admin` | Tableau de bord admin | Protégé |
| `/admin/candidates/:id` | Détail candidat | Protégé |
| `/admin/categorizations` | Gestion catégories | Protégé |
| `/admin/email-config` | Configuration emails | Protégé |

## 👥 Utilisateurs et Rôles

### Système d'authentification
- **Utilisateurs publics** : Peuvent consulter les talents et postuler
- **Administrateurs** : Accès complet à la gestion des candidats et configurations

### Accès administration
- URL : `/login`
- Identifiants à configurer selon votre environnement
- Protection via `ProtectedRoute` dans React

## 🗄️ Base de Données

### Structure principale
- **candidates** : Informations des candidats
- **categories** : Catégories de talents
- **sub_categories** : Sous-catégories
- **skills** : Compétences
- **email_templates** : Templates d'emails
- **users** : Utilisateurs administrateurs

### Migration consolidée
Le projet utilise une migration unique : `2026_02_25_000001_consolidated_database_migration.php`

## 📧 Fonctionnalités Email

### Configuration
- Templates configurables via l'interface admin
- Support SMTP
- Emails de notification pour les nouvelles candidatures

### Templates disponibles
- Email de confirmation de candidature
- Email de notification administrateur
- Emails personnalisables via le panneau d'administration

## 🔍 Parsing de CV

### Technologies
- **smalot/pdfparser** : Extraction de texte depuis PDF
- Traitement automatique des informations
- Catégorisation intelligente des compétences

### Processus
1. Upload du CV (PDF)
2. Extraction automatique des données
3. Catégorisation selon les compétences
4. Stockage en base de données

## 📊 Export de Données

### Excel Export
- **Maatwebsite/Excel** intégré
- Export des listes de candidats
- Formatage personnalisable
- Filtrage par catégories

## 🛠️ Développement

# Backend
composer setup              # Installation complète
npm run dev                # Développement complet
php artisan test           # Tests unitaires
php artisan migrate:fresh  # Reset BDD

# Frontend
npm run dev               # Serveur développement
npm run build             # Build production
npm run lint              # ESLint
```

### Conventions de code
- **PHP** : PSR-12, Laravel standards
- **JavaScript** : ESLint configuration, React hooks
- **CSS** : TailwindCSS utility-first

## 🔒 Sécurité

### Mesures implémentées
- Laravel Sanctum pour l'authentification API
- Protection CSRF
- Validation des entrées
- Routes protégées
- Gestion des sessions sécurisée

### Recommandations
- Utiliser HTTPS en production
- Configurer les CORS correctement
- Mettre à jour régulièrement les dépendances
- Sauvegarder la base de données régulièrement

## 🚀 Déploiement

### Environnement de production
1. Configurer les variables d'environnement
2. `APP_ENV=production`
3. `APP_DEBUG=false`
4. Build des assets : `npm run build`
5. Optimiser Laravel : `php artisan optimize`
6. Configurer le serveur web (Apache/Nginx)

### Docker (optionnel)
Le projet peut être containerisé avec Docker pour un déploiement simplifié.

## 🐛 Débogage

### Outils disponibles
- **Laravel Pail** : Logs en temps réel
- **Laravel Telescope** : (optionnel) Debug toolbar
- **React DevTools** : Débogage frontend
- **Postman/Insomnia** : Test API

### Logs
- Backend : `storage/logs/laravel.log`
- Frontend : Console navigateur

## 📚 Ressources Utiles

### Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)

### Support
- Issues GitHub pour les bugs
- Documentation technique dans `/backend/docs/`

## 🔄 Maintenance

### Tâches régulières
- Mettre à jour les dépendances
- Nettoyer les logs
- Sauvegarder la base de données
- Monitorer les performances

### Monitoring
- Utiliser Laravel Telescope pour le monitoring
- Configurer des alertes sur les erreurs critiques
- Surveiller les performances de la base de données

---

## 👤 Auteur

Développé par NARINDRA RANJALAHY