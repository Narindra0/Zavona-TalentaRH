#!/bin/bash

# Script d'automatisation pour Zavona Talenta RH
# Ce script configure et démarre tout le projet automatiquement

set -e  # Arrête le script en cas d'erreur

echo "🚀 Démarrage de l'automatisation de Zavona Talenta RH..."
echo "=================================================="

# Couleurs pour une meilleure lisibilité
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Vérification des prérequis
echo ""
echo "📋 Vérification des prérequis..."

# Vérifier PHP
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -r "echo PHP_VERSION;")
    print_success "PHP $PHP_VERSION trouvé"
else
    print_error "PHP n'est pas installé. Veuillez installer PHP 8.2+"
    exit 1
fi

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION trouvé"
else
    print_error "Node.js n'est pas installé. Veuillez installer Node.js 18+"
    exit 1
fi

# Vérifier PostgreSQL
if command -v psql &> /dev/null; then
    POSTGRES_VERSION=$(psql --version | head -n1 | cut -d' ' -f3)
    print_success "PostgreSQL $POSTGRES_VERSION trouvé"
else
    print_warning "PostgreSQL n'est pas trouvé ou n'est pas dans le PATH"
    print_info "Assurez-vous que PostgreSQL est installé et en cours d'exécution"
fi

# Vérifier Composer
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | head -n1 | cut -d' ' -f3)
    print_success "Composer $COMPOSER_VERSION trouvé"
else
    print_error "Composer n'est pas installé. Veuillez installer Composer"
    exit 1
fi

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."

# Installer les dépendances principales
print_info "Installation des dépendances principales (npm)..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dépendances principales installées"
else
    print_error "Erreur lors de l'installation des dépendances principales"
    exit 1
fi

# Installer les dépendances backend
print_info "Installation des dépendances backend..."
cd backend
composer install --no-interaction
if [ $? -eq 0 ]; then
    print_success "Dépendances backend installées"
else
    print_error "Erreur lors de l'installation des dépendances backend"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    print_success "Dépendances npm backend installées"
else
    print_error "Erreur lors de l'installation des dépendances npm backend"
    exit 1
fi

# Installer les dépendances frontend
print_info "Installation des dépendances frontend..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Dépendances frontend installées"
else
    print_error "Erreur lors de l'installation des dépendances frontend"
    exit 1
fi

# Retour à la racine
cd ..

# Configuration de l'environnement
echo ""
echo "⚙️  Configuration de l'environnement..."

cd backend

# Vérifier si .env existe
if [ ! -f .env ]; then
    print_info "Création du fichier .env..."
    cp .env.example .env
    print_success "Fichier .env créé"
else
    print_warning "Fichier .env déjà existant"
fi

# Générer la clé Laravel
print_info "Génération de la clé Laravel..."
php artisan key:generate --force
if [ $? -eq 0 ]; then
    print_success "Clé Laravel générée"
else
    print_error "Erreur lors de la génération de la clé Laravel"
    exit 1
fi

# Configuration de la base de données
echo ""
echo "🗄️  Configuration de la base de données..."

# Demander les informations de la base de données
echo ""
print_info "Veuillez configurer votre base de données PostgreSQL :"
echo "Les informations suivantes sont requises pour configurer le fichier .env"

read -p "Nom de la base de données (défaut: zavona_talenta_rh): " DB_NAME
DB_NAME=${DB_NAME:-zavona_talenta_rh}

read -p "Utilisateur PostgreSQL (défaut: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Mot de passe PostgreSQL: " -s DB_PASSWORD
echo ""

read -p "Hôte PostgreSQL (défaut: 127.0.0.1): " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "Port PostgreSQL (défaut: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Mettre à jour le fichier .env
print_info "Mise à jour du fichier .env..."
sed -i "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sed -i "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
sed -i "s/DB_PORT=.*/DB_PORT=$DB_PORT/" .env

print_success "Fichier .env mis à jour"

# Test de connexion à la base de données
print_info "Test de connexion à la base de données..."
php artisan tinker --execute="
try {
    \DB::connection()->getPdo();
    echo '✅ Connexion à la base de données réussie';
} catch (\Exception \$e) {
    echo '❌ Erreur de connexion: ' . \$e->getMessage();
    exit(1);
}
" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Connexion à la base de données réussie"
else
    print_error "Impossible de se connecter à la base de données"
    print_info "Veuillez vérifier vos informations et que PostgreSQL est en cours d'exécution"
    exit 1
fi

# Migration de la base de données
echo ""
print_info "Migration de la base de données..."
php artisan migrate --force
if [ $? -eq 0 ]; then
    print_success "Migration de la base de données effectuée"
else
    print_error "Erreur lors de la migration de la base de données"
    exit 1
fi

# Retour à la racine
cd ..

# Build des assets
echo ""
echo "🔨 Build des assets..."

cd frontend
print_info "Build des assets frontend..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build frontend terminé"
else
    print_warning "Le build frontend a échoué, mais ce n'est pas critique pour le développement"
fi

cd ../backend
print_info "Build des assets backend..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build backend terminé"
else
    print_warning "Le build backend a échoué, mais ce n'est pas critique pour le développement"
fi

cd ..

# Création des scripts de démarrage
echo ""
echo "📜 Création des scripts de démarrage..."

# Script de démarrage rapide
cat > start.sh << 'EOF'
#!/bin/bash

# Script de démarrage rapide pour Zavona Talenta RH

echo "🚀 Démarrage de Zavona Talenta RH..."

# Démarrer le backend en arrière-plan
echo "Démarrage du backend..."
cd backend
php artisan serve --host=0.0.0.0 --port=8000 &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend en arrière-plan
echo "Démarrage du frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services démarrés !"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "👤 Admin:    http://localhost:8000/login"
echo ""
echo "Pour arrêter les services, utilisez: ./stop.sh"
echo "Pour voir les logs, utilisez: ./logs.sh"

# Sauvegarder les PID pour pouvoir arrêter les services
echo $BACKEND_PID > .backend_pid
echo $FRONTEND_PID > .frontend_pid

# Attendre que les processus se terminent
wait
EOF

chmod +x start.sh

# Script d'arrêt
cat > stop.sh << 'EOF'
#!/bin/bash

# Script d'arrêt pour Zavona Talenta RH

echo "🛑 Arrêt de Zavona Talenta RH..."

# Arrêter le backend
if [ -f .backend_pid ]; then
    BACKEND_PID=$(cat .backend_pid)
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo "Backend arrêté"
    fi
    rm .backend_pid
fi

# Arrêter le frontend
if [ -f .frontend_pid ]; then
    FRONTEND_PID=$(cat .frontend_pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        kill $FRONTEND_PID
        echo "Frontend arrêté"
    fi
    rm .frontend_pid
fi

echo "✅ Tous les services sont arrêtés"
EOF

chmod +x stop.sh

# Script de logs
cat > logs.sh << 'EOF'
#!/bin/bash

# Script pour voir les logs de Zavona Talenta RH

echo "📋 Logs de Zavona Talenta RH"
echo "========================="
echo ""

# Logs Laravel
if [ -f backend/storage/logs/laravel.log ]; then
    echo "🔧 Logs Laravel (dernières lignes):"
    tail -n 20 backend/storage/logs/laravel.log
    echo ""
else
    echo "ℹ️  Aucun log Laravel trouvé"
fi

# Logs de la base de données
echo "🗄️  Informations sur la base de données:"
cd backend
php artisan tinker --execute="
echo 'Connexion: ' . \DB::connection()->getDatabaseName();
echo 'Tables: ' . count(\DB::select('SELECT tablename FROM pg_tables WHERE schemaname = \'public\''));
" 2>/dev/null
cd ..
echo ""

# Services en cours d'exécution
echo "🔄 Services en cours d'exécution:"
if [ -f .backend_pid ]; then
    BACKEND_PID=$(cat .backend_pid)
    if ps -p $BACKEND_PID > /dev/null; then
        echo "✅ Backend en cours d'exécution (PID: $BACKEND_PID)"
    else
        echo "❌ Backend arrêté"
    fi
else
    echo "❌ Backend arrêté"
fi

if [ -f .frontend_pid ]; then
    FRONTEND_PID=$(cat .frontend_pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        echo "✅ Frontend en cours d'exécution (PID: $FRONTEND_PID)"
    else
        echo "❌ Frontend arrêté"
    fi
else
    echo "❌ Frontend arrêté"
fi
EOF

chmod +x logs.sh

print_success "Scripts de démarrage créés"

# Finalisation
echo ""
echo "🎉 Configuration terminée avec succès !"
echo "=================================================="
echo ""
print_success "Zavona Talenta RH est maintenant prêt à être utilisé !"
echo ""
print_info "URLs d'accès:"
echo "  📱 Frontend: http://localhost:5173"
echo "  🔧 Backend:  http://localhost:8000"
echo "  👤 Admin:    http://localhost:8000/login"
echo ""
print_info "Commandes utiles:"
echo "  🚀 Démarrer: ./start.sh"
echo "  🛑 Arrêter:   ./stop.sh"
echo "  📋 Logs:      ./logs.sh"
echo ""
print_info "Documentation:"
echo "  📖 Guide complet: README.md"
echo "  🚀 Prise en main: ONBOARDING.md"
echo "  🔧 Développement: DEVELOPMENT.md"
echo ""
print_warning "N'oubliez pas de:"
echo "  - Configurer votre utilisateur administrateur"
echo "  - Vérifier la configuration des emails si nécessaire"
echo "  - Consulter la documentation pour plus de détails"
echo ""
print_success "Bon développement ! 🚀"
