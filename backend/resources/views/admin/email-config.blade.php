@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 p-6">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Configuration Email</h1>
            <p class="text-slate-600">Gérez les paramètres d'envoi d'emails de votre application</p>
        </div>

        <!-- Carte principale -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-8">
                <!-- Email de contact rapide -->
                <div class="mb-8">
                    <label class="block text-sm font-semibold text-slate-700 mb-3">
                        Email de contact principal
                    </label>
                    <div class="flex gap-3">
                        <input 
                            class="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium" 
                            placeholder="Ex: contact@ztrh.com (Laisse vide pour utiliser l'email par défaut)" 
                            type="email" 
                            value="{{ config('app-settings.email.from_address', 'contact@zavona-rh.com') }}"
                            id="quick-email"
                        >
                        <button 
                            onclick="openEmailConfigModal()" 
                            class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Configurer
                        </button>
                    </div>
                    <p class="text-xs text-slate-500 mt-2">Cet email sera utilisé comme expéditeur pour toutes les communications</p>
                </div>

                <!-- Statut actuel -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-blue-600 font-medium">Transport actuel</p>
                                <p class="text-sm font-semibold text-blue-900">{{ config('mail.default', 'log') }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-green-600 font-medium">Email configuré</p>
                                <p class="text-sm font-semibold text-green-900">{{ config('mail.from.address', 'Non configuré') }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-purple-600 font-medium">Statut</p>
                                <p class="text-sm font-semibold text-purple-900">Actif</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div class="flex flex-wrap gap-3">
                    <button onclick="testEmailConnection()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Tester la connexion
                        </span>
                    </button>
                    <button onclick="sendTestEmail()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Envoyer un email test
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de configuration Email -->
<div id="emailConfigModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header de la modal -->
        <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-bold text-slate-900">Configuration Email Avancée</h2>
                    <p class="text-sm text-slate-600 mt-1">Configurez les paramètres SMTP et autres options d'envoi</p>
                </div>
                <button onclick="closeEmailConfigModal()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Contenu de la modal -->
        <div class="p-6 space-y-6">
            <!-- Transport -->
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-3">Méthode d'envoi</label>
                <select id="mail_transport" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    <option value="log">Log (pour les tests)</option>
                    <option value="smtp">SMTP</option>
                    <option value="sendmail">Sendmail</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="ses">Amazon SES</option>
                    <option value="postmark">Postmark</option>
                </select>
            </div>

            <!-- Configuration SMTP -->
            <div id="smtp_config" class="space-y-4">
                <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Configuration SMTP
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Hôte SMTP</label>
                        <input type="text" id="smtp_host" placeholder="smtp.gmail.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Port</label>
                        <input type="number" id="smtp_port" placeholder="587" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Chiffrement</label>
                    <select id="smtp_encryption" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                        <option value="">Aucun</option>
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Nom d'utilisateur</label>
                        <input type="text" id="smtp_username" placeholder="votre-email@gmail.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                        <input type="password" id="smtp_password" placeholder="••••••••" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                </div>
            </div>

            <!-- Informations d'expéditeur -->
            <div>
                <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Informations de l'expéditeur
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Email de l'expéditeur</label>
                        <input type="email" id="from_address" placeholder="contact@ztrh.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Nom de l'expéditeur</label>
                        <input type="text" id="from_name" placeholder="Zavona Talenta RH" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Email de réponse (optionnel)</label>
                        <input type="email" id="reply_to_address" placeholder="reponse@ztrh.com" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Nom de réponse (optionnel)</label>
                        <input type="text" id="reply_to_name" placeholder="Support ZTRH" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-200">
                <button onclick="resetToDefaults()" class="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm">
                    Réinitialiser par défaut
                </button>
                <div class="flex gap-3">
                    <button onclick="closeEmailConfigModal()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium">
                        Annuler
                    </button>
                    <button onclick="saveEmailConfig()" class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium">
                        Enregistrer la configuration
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Constants for email defaults
const EmailDefaults = {
    DEFAULT_FROM_ADDRESS: 'contact@zavona-rh.com',
    DEFAULT_FROM_NAME: 'Zavona Talenta RH',
    DEFAULT_SMTP_PORT: 587,
    DEFAULT_SMTP_ENCRYPTION: 'tls'
};

// Variables globales
let emailSettings = {};

// Fonctions pour la modal
function openEmailConfigModal() {
    document.getElementById('emailConfigModal').classList.remove('hidden');
    loadCurrentEmailSettings();
}

function closeEmailConfigModal() {
    document.getElementById('emailConfigModal').classList.add('hidden');
}

// Charger les paramètres actuels
async function loadCurrentEmailSettings() {
    try {
        const response = await fetch('/admin/email-config/current-config');
        const data = await response.json();
        
        document.getElementById('mail_transport').value = data.transport || 'log';
        document.getElementById('smtp_host').value = data.smtp?.host || '';
        document.getElementById('smtp_port').value = data.smtp?.port || EmailDefaults.DEFAULT_SMTP_PORT;
        document.getElementById('smtp_encryption').value = data.smtp?.encryption || EmailDefaults.DEFAULT_SMTP_ENCRYPTION;
        document.getElementById('smtp_username').value = data.smtp?.username || '';
        document.getElementById('smtp_password').value = '';
        document.getElementById('from_address').value = data.from?.address || EmailDefaults.DEFAULT_FROM_ADDRESS;
        document.getElementById('from_name').value = data.from?.name || EmailDefaults.DEFAULT_FROM_NAME;
        document.getElementById('reply_to_address').value = data.reply_to?.address || '';
        document.getElementById('reply_to_name').value = data.reply_to?.name || '';
        
        document.getElementById('quick-email').value = data.from?.address || EmailDefaults.DEFAULT_FROM_ADDRESS;
        
        toggleSmtpConfig();
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
    }
}

// Afficher/masquer la configuration SMTP
function toggleSmtpConfig() {
    const transport = document.getElementById('mail_transport').value;
    const smtpConfig = document.getElementById('smtp_config');
    
    if (transport === 'smtp') {
        smtpConfig.style.display = 'block';
    } else {
        smtpConfig.style.display = 'none';
    }
}

// Sauvegarder la configuration
async function saveEmailConfig() {
    const settings = {
        'email.default_transport': document.getElementById('mail_transport').value,
        'email.smtp_host': document.getElementById('smtp_host').value,
        'email.smtp_port': parseInt(document.getElementById('smtp_port').value),
        'email.smtp_encryption': document.getElementById('smtp_encryption').value,
        'email.smtp_username': document.getElementById('smtp_username').value,
        'email.smtp_password': document.getElementById('smtp_password').value,
        'email.from_address': document.getElementById('from_address').value,
        'email.from_name': document.getElementById('from_name').value,
        'email.reply_to_address': document.getElementById('reply_to_address').value || null,
        'email.reply_to_name': document.getElementById('reply_to_name').value || null,
    };
    
    try {
        const response = await fetch('/admin/settings/bulk-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                settings: Object.entries(settings).map(([key, value]) => ({
                    group: key.split('.')[0],
                    key: key.split('.')[1],
                    value: value,
                    type: typeof value,
                    is_public: key.includes('from_address') || key.includes('from_name')
                }))
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Configuration email enregistrée avec succès!', 'success');
            closeEmailConfigModal();
            // Recharger la page pour voir les changements
            setTimeout(() => location.reload(), 1500);
        } else {
            showNotification('Erreur lors de l\'enregistrement: ' + (result.message || 'Erreur inconnue'), 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'enregistrement de la configuration', 'error');
    }
}

// Réinitialiser aux valeurs par défaut
async function resetToDefaults() {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres email aux valeurs par défaut ?')) {
        return;
    }
    
    try {
        const response = await fetch('/admin/settings/reset-defaults', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });
        
        if (response.ok) {
            showNotification('Paramètres réinitialisés aux valeurs par défaut', 'success');
            loadCurrentEmailSettings();
        } else {
            showNotification('Erreur lors de la réinitialisation', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la réinitialisation', 'error');
    }
}

// Tester la connexion SMTP
async function testEmailConnection() {
    showNotification('Test de connexion en cours...', 'info');
    
    try {
        const response = await fetch('/admin/email-config/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message || 'Erreur lors du test de connexion', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du test de connexion', 'error');
    }
}

// Envoyer un email test
async function sendTestEmail() {
    const toEmail = prompt('Entrez l\'adresse email pour recevoir le test:');
    if (!toEmail) return;
    
    showNotification('Envoi d\'un email test en cours...', 'info');
    
    try {
        const response = await fetch('/admin/email-config/send-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ to_email: toEmail })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message || 'Erreur lors de l\'envoi de l\'email test', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'envoi de l\'email test', 'error');
    }
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-lg z-50 transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
                    type === 'success' ? 'M5 13l4 4L19 7' :
                    type === 'error' ? 'M6 18L18 6M6 6l12 12' :
                    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                }"></path>
            </svg>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Écouter les changements de transport
document.getElementById('mail_transport').addEventListener('change', toggleSmtpConfig);

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    toggleSmtpConfig();
});
</script>
@endsection
