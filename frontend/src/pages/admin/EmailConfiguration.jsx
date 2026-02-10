import { useState, useEffect } from 'react';
import {
    Mail,
    Save,
    Send,
    Variable,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Info
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
                                        <input
                                            type="email"
                                            value={selectedTemplate.sender_email || ''}
                                            onChange={(e) => setSelectedTemplate({ ...selectedTemplate, sender_email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                            placeholder="Ex: contact@ztrh.com (Laisse vide pour utiliser l'email par défaut)"
                                        />
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
        </AdminLayout>
    );
};

export default EmailConfiguration;
