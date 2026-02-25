import { useState, useEffect } from 'react';
import {
    Mail,
    Save,
    Send,
    Variable,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Info,
    Settings,
    X,
    Server,
    Shield,
    Lock,
    RefreshCw,
    TestTube,
    Globe,
    Zap,
    Cloud,
    SendHorizontal
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';

const EmailConfiguration = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [sendingTest, setSendingTest] = useState(false);
    const [notification, setNotification] = useState(null);
    
    // États pour la modal de configuration email
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [emailConfig, setEmailConfig] = useState({
        transport: 'log',
        smtp_host: '',
        smtp_port: '587',
        smtp_encryption: 'tls',
        smtp_username: '',
        smtp_password: '',
        from_address: 'contact@zavona-rh.com',
        from_name: 'Zavona Talenta RH',
        reply_to_address: '',
        reply_to_name: ''
    });
    const [configSaving, setConfigSaving] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/admin/email-templates');
                setTemplates(response.data);
                if (response.data.length > 0) {
                    setSelectedTemplate(response.data[0]);
                }
            } catch (err) {
                console.error("Error fetching templates:", err);
                showNotification('error', 'Erreur lors du chargement des templates.');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSave = async () => {
        if (!selectedTemplate) return;
        setSaving(true);
        try {
            await api.put(`/admin/email-templates/${selectedTemplate.id}`, {
                sender_email: selectedTemplate.sender_email,
                subject: selectedTemplate.subject,
                body: selectedTemplate.body
            });
            setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
            showNotification('success', 'Template enregistré avec succès.');
        } catch (err) {
            console.error("Error saving template:", err);
            showNotification('error', 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    const handleSendTest = async () => {
        if (!testEmail || !selectedTemplate) return;
        setSendingTest(true);
        try {
            await api.post(`/admin/email-templates/${selectedTemplate.id}/test`, {
                email: testEmail
            });
            showNotification('success', 'Email de test envoyé ! (Vérifiez les logs en local)');
        } catch (err) {
            console.error("Error sending test:", err);
            showNotification('error', 'Erreur lors de l\'envoi du test.');
        } finally {
            setSendingTest(false);
        }
    };

    const insertVariable = (variable) => {
        const textarea = document.getElementById('template-body');
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = selectedTemplate.body;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const newBody = before + `{${variable}}` + after;

        setSelectedTemplate({ ...selectedTemplate, body: newBody });

        // Focus back after state update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
        }, 0);
    };

    // Fonctions pour la configuration email
    const openConfigModal = async () => {
        try {
            // Essayer de charger les paramètres depuis l'API
            const response = await api.get('/admin/settings');
            const allSettings = response.data;
            
            // Extraire les paramètres email
            const emailSettings = allSettings.email || {};
            
            setEmailConfig({
                transport: emailSettings.default_transport || 'log',
                smtp_host: emailSettings.smtp_host || '',
                smtp_port: emailSettings.smtp_port || '587',
                smtp_encryption: emailSettings.smtp_encryption || 'tls',
                smtp_username: emailSettings.smtp_username || '',
                smtp_password: emailSettings.smtp_password || '',
                from_address: emailSettings.from_address || 'contact@zavona-rh.com',
                from_name: emailSettings.from_name || 'Zavona Talenta RH',
                reply_to_address: emailSettings.reply_to_address || '',
                reply_to_name: emailSettings.reply_to_name || ''
            });
            
            setShowConfigModal(true);
        } catch (err) {
            console.error("Error loading email config:", err);
            
            // En cas d'erreur, utiliser les valeurs par défaut et ouvrir la modal
            setEmailConfig({
                transport: 'log',
                smtp_host: '',
                smtp_port: '587',
                smtp_encryption: 'tls',
                smtp_username: '',
                smtp_password: '',
                from_address: 'contact@zavona-rh.com',
                from_name: 'Zavona Talenta RH',
                reply_to_address: '',
                reply_to_name: ''
            });
            
            setShowConfigModal(true);
            showNotification('info', 'Utilisation des valeurs par défaut. Configurez les paramètres email ci-dessous.');
        }
    };

    const closeConfigModal = () => {
        setShowConfigModal(false);
    };

    const saveEmailConfig = async () => {
        setConfigSaving(true);
        try {
            const settings = [
                { group: 'email', key: 'default_transport', value: emailConfig.transport, type: 'string', is_public: false },
                { group: 'email', key: 'smtp_host', value: emailConfig.smtp_host, type: 'string', is_public: false },
                { group: 'email', key: 'smtp_port', value: parseInt(emailConfig.smtp_port), type: 'integer', is_public: false },
                { group: 'email', key: 'smtp_encryption', value: emailConfig.smtp_encryption, type: 'string', is_public: false },
                { group: 'email', key: 'smtp_username', value: emailConfig.smtp_username, type: 'string', is_public: false },
                { group: 'email', key: 'smtp_password', value: emailConfig.smtp_password, type: 'string', is_public: false },
                { group: 'email', key: 'from_address', value: emailConfig.from_address, type: 'email', is_public: true },
                { group: 'email', key: 'from_name', value: emailConfig.from_name, type: 'string', is_public: true },
                { group: 'email', key: 'reply_to_address', value: emailConfig.reply_to_address || null, type: 'email', is_public: false },
                { group: 'email', key: 'reply_to_name', value: emailConfig.reply_to_name || null, type: 'string', is_public: false }
            ];

            const response = await api.post('/admin/settings/bulk-update', { settings });
            
            if (response.data && response.data.total_updated > 0) {
                showNotification('success', `Configuration email enregistrée avec succès! (${response.data.total_updated} paramètres mis à jour)`);
            } else {
                showNotification('success', 'Configuration email enregistrée avec succès!');
            }
            
            closeConfigModal();
            
            // Recharger la page pour voir les changements
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (err) {
            console.error("Error saving email config:", err);
            
            // Gérer les erreurs spécifiques
            if (err.response?.status === 422) {
                const errors = err.response.data?.errors || [];
                if (errors.length > 0) {
                    showNotification('error', `Erreur de validation: ${errors.join(', ')}`);
                } else {
                    showNotification('error', 'Erreur de validation des données.');
                }
            } else if (err.response?.status === 403) {
                showNotification('error', 'Vous n\'avez pas les permissions pour modifier ces paramètres.');
            } else if (err.response?.status === 404) {
                showNotification('error', 'Endpoint non trouvé. Vérifiez que l\'API est bien configurée.');
            } else {
                showNotification('error', err.response?.data?.message || 'Erreur lors de l\'enregistrement de la configuration.');
            }
        } finally {
            setConfigSaving(false);
        }
    };

    const testEmailConnection = async () => {
        try {
            showNotification('info', 'Test de connexion en cours...');
            const response = await api.post('/admin/email-config/test-connection');
            showNotification('success', response.data.message || 'Connexion testée avec succès!');
        } catch (err) {
            console.error("Error testing connection:", err);
            
            if (err.response?.status === 404) {
                showNotification('error', 'Endpoint de test non disponible. Vérifiez la configuration backend.');
            } else {
                showNotification('error', err.response?.data?.message || 'Erreur lors du test de connexion.');
            }
        }
    };

    const resetToDefaults = async () => {
        if (!confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres email aux valeurs par défaut ?')) {
            return;
        }
        
        try {
            await api.post('/admin/settings/reset-defaults');
            showNotification('success', 'Paramètres réinitialisés aux valeurs par défaut');
            await openConfigModal(); // Recharger les valeurs
        } catch (err) {
            console.error("Error resetting defaults:", err);
            showNotification('error', 'Erreur lors de la réinitialisation.');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-5xl">
                {/* Header & Notifications */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Mail className="text-orange-500" size={24} />
                        Configuration des Emails
                    </h2>
                    {notification && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {notification.message}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Template List */}
                    <div className="lg:col-span-1 space-y-3">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Templates</p>
                        {templates.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTemplate?.id === t.id
                                    ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm'
                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                                    }`}
                            >
                                <span className="text-sm font-bold block">{t.name}</span>
                                <span className="text-[10px] opacity-70 truncate block">{t.subject}</span>
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        {selectedTemplate ? (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-800">Éditer le template</h3>
                                        <p className="text-xs text-slate-400">Identifiant : <code className="bg-slate-50 px-1 rounded">{selectedTemplate.name}</code></p>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Enregistrer
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Sender Email */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Expéditeur</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="email"
                                                value={selectedTemplate.sender_email || ''}
                                                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, sender_email: e.target.value })}
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                                placeholder="Ex: contact@ztrh.com (Laisse vide pour utiliser l'email par défaut)"
                                            />
                                            <button
                                                onClick={openConfigModal}
                                                className="px-4 py-3 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors font-medium text-sm"
                                            >
                                                <Settings size={16} />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 ml-1 italic">
                                            Si vide, l'email par défaut configuré sur le serveur sera utilisé.
                                        </p>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sujet de l'email</label>
                                        <input
                                            type="text"
                                            value={selectedTemplate.subject}
                                            onChange={(e) => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                            placeholder="Ex: Mise en relation avec {talent_name}"
                                        />
                                    </div>

                                    {/* Body & Variables */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="md:col-span-3 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contenu (Markdown)</label>
                                            </div>
                                            <textarea
                                                id="template-body"
                                                rows="12"
                                                value={selectedTemplate.body}
                                                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium resize-none leading-relaxed"
                                                placeholder="Contenu de l'email..."
                                            />
                                        </div>

                                        <div className="md:col-span-1 space-y-4">
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Variable size={12} /> Variables
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTemplate.variables_available?.map(v => (
                                                        <button
                                                            key={v}
                                                            onClick={() => insertVariable(v)}
                                                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-orange-200 hover:text-orange-600 transition-all"
                                                            title={`Insérer {${v}}`}
                                                        >
                                                            {`{${v}}`}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                                    <p className="text-[10px] text-blue-600 leading-tight">
                                                        <Info size={10} className="inline mr-1" />
                                                        Cliquez sur une variable pour l'insérer dans le corps du texte.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Section */}
                                    <div className="pt-6 border-t border-slate-50">
                                        <div className="bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-bold text-slate-800">Envoyer un test</h4>
                                                <p className="text-xs text-slate-400">Testez le rendu avec des données factices.</p>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <input
                                                    type="email"
                                                    value={testEmail}
                                                    onChange={(e) => setTestEmail(e.target.value)}
                                                    placeholder="votre@email.com"
                                                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 w-full"
                                                />
                                                <button
                                                    onClick={handleSendTest}
                                                    disabled={sendingTest || !testEmail}
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all disabled:opacity-50"
                                                >
                                                    {sendingTest ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                                    Tester
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-dotted border-slate-200 h-64 flex flex-col items-center justify-center text-slate-400">
                                <Mail size={48} className="opacity-20 mb-4" />
                                <p className="font-medium">Sélectionnez un template pour commencer l'édition</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de configuration Email */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header de la modal */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Configuration Email</h2>
                                        <p className="text-sm text-slate-600">Paramètres SMTP et informations d'envoi</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={closeConfigModal} 
                                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        {/* Contenu de la modal avec scroll */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-8">
                                {/* Section Transport */}
                                <div className="bg-slate-50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                            <Settings className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">Méthode d'envoi</h3>
                                    </div>
                                    <select 
                                        value={emailConfig.transport}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, transport: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    >
                                        <option value="log">Log (pour les tests)</option>
                                        <option value="smtp">SMTP (recommandé)</option>
                                        <option value="sendmail">Sendmail</option>
                                        <option value="mailgun">Mailgun</option>
                                        <option value="ses">Amazon SES</option>
                                        <option value="postmark">Postmark</option>
                                    </select>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {emailConfig.transport === 'log' && 'Les emails seront enregistrés dans les logs (idéal pour le développement)'}
                                        {emailConfig.transport === 'smtp' && 'Configuration SMTP personnalisée pour votre propre serveur mail'}
                                        {emailConfig.transport === 'sendmail' && 'Utilise le service sendmail du serveur'}
                                        {emailConfig.transport === 'mailgun' && 'Service d\'emailing Mailgun'}
                                        {emailConfig.transport === 'ses' && 'Amazon Simple Email Service'}
                                        {emailConfig.transport === 'postmark' && 'Service d\'emailing Postmark'}
                                    </p>
                                </div>

                                {/* Configuration SMTP */}
                                {emailConfig.transport === 'smtp' && (
                                    <div className="bg-blue-50 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                                <Mail className="w-3 h-3 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-slate-900">Configuration SMTP</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Hôte SMTP</label>
                                                <input 
                                                    type="text" 
                                                    value={emailConfig.smtp_host}
                                                    onChange={(e) => setEmailConfig({ ...emailConfig, smtp_host: e.target.value })}
                                                    placeholder="smtp.gmail.com" 
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Ex: smtp.gmail.com, smtp.outlook.com</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Port</label>
                                                <input 
                                                    type="number" 
                                                    value={emailConfig.smtp_port}
                                                    onChange={(e) => setEmailConfig({ ...emailConfig, smtp_port: e.target.value })}
                                                    placeholder="587" 
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">587 (TLS) ou 465 (SSL)</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Chiffrement</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { value: '', label: 'Aucun', desc: 'Non sécurisé' },
                                                    { value: 'tls', label: 'TLS', desc: 'Recommandé' },
                                                    { value: 'ssl', label: 'SSL', desc: 'Legacy' }
                                                ].map((option) => (
                                                    <label key={option.value} className="relative">
                                                        <input
                                                            type="radio"
                                                            name="encryption"
                                                            value={option.value}
                                                            checked={emailConfig.smtp_encryption === option.value}
                                                            onChange={(e) => setEmailConfig({ ...emailConfig, smtp_encryption: e.target.value })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="px-3 py-2 bg-white border rounded-lg cursor-pointer text-center transition-all peer-checked:bg-orange-50 peer-checked:border-orange-300 peer-checked:text-orange-700 hover:bg-slate-50">
                                                            <div className="text-sm font-medium">{option.label}</div>
                                                            <div className="text-xs text-slate-500">{option.desc}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom d'utilisateur</label>
                                                <input 
                                                    type="text" 
                                                    value={emailConfig.smtp_username}
                                                    onChange={(e) => setEmailConfig({ ...emailConfig, smtp_username: e.target.value })}
                                                    placeholder="votre-email@gmail.com" 
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
                                                <input 
                                                    type="password" 
                                                    value={emailConfig.smtp_password}
                                                    onChange={(e) => setEmailConfig({ ...emailConfig, smtp_password: e.target.value })}
                                                    placeholder="••••••••" 
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Utilisez un mot de passe d'application pour Gmail</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-blue-100/50 rounded-lg border border-blue-200/50">
                                            <p className="text-xs text-blue-700 flex items-start gap-2">
                                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span><strong>Astuce Gmail:</strong> Activez la "validation en deux étapes" et générez un "mot de passe d'application" dans les paramètres de votre compte Google.</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Informations de l'expéditeur */}
                                <div className="bg-green-50 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                                            <Settings className="w-3 h-3 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">Informations de l'expéditeur</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email de l'expéditeur</label>
                                            <input 
                                                type="email" 
                                                value={emailConfig.from_address}
                                                onChange={(e) => setEmailConfig({ ...emailConfig, from_address: e.target.value })}
                                                placeholder="contact@ztrh.com" 
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Adresse email visible par les destinataires</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom de l'expéditeur</label>
                                            <input 
                                                type="text" 
                                                value={emailConfig.from_name}
                                                onChange={(e) => setEmailConfig({ ...emailConfig, from_name: e.target.value })}
                                                placeholder="Zavona Talenta RH" 
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Nom affiché dans les emails</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email de réponse <span className="text-slate-400">(optionnel)</span></label>
                                            <input 
                                                type="email" 
                                                value={emailConfig.reply_to_address}
                                                onChange={(e) => setEmailConfig({ ...emailConfig, reply_to_address: e.target.value })}
                                                placeholder="reponse@ztrh.com" 
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Pour les réponses automatiques</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom de réponse <span className="text-slate-400">(optionnel)</span></label>
                                            <input 
                                                type="text" 
                                                value={emailConfig.reply_to_name}
                                                onChange={(e) => setEmailConfig({ ...emailConfig, reply_to_name: e.target.value })}
                                                placeholder="Support ZTRH" 
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Nom pour les réponses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions fixes en bas */}
                        <div className="bg-white border-t border-slate-200 p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                        onClick={resetToDefaults}
                                        className="px-3 py-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Réinitialiser
                                    </button>
                                    {emailConfig.transport === 'smtp' && (
                                        <button 
                                            onClick={testEmailConnection}
                                            className="px-3 py-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                        >
                                            <TestTube className="w-3 h-3" />
                                            Tester
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={closeConfigModal} 
                                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={saveEmailConfig} 
                                        disabled={configSaving}
                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                                    >
                                        {configSaving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={14} />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                Enregistrer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default EmailConfiguration;
