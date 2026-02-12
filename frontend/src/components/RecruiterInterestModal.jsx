import { useState, useEffect } from 'react';
import { X, Send, Building2, Mail, Phone, Loader2, CheckCircle2, Users } from 'lucide-react';

const RecruiterInterestModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        recruiter_name: '',
        company_name: '',
        email: '',
        phone: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);

    // Charger les données sauvegardées au montage
    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted') {
            const savedInfo = localStorage.getItem('recruiter_info');
            if (savedInfo) {
                try {
                    const parsedInfo = JSON.parse(savedInfo);
                    setFormData(prev => ({
                        ...prev,
                        ...parsedInfo
                    }));
                } catch (e) {
                    console.error("Error parsing saved recruiter info", e);
                }
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(formData);
        if (success) {
            // Sauvegarder les informations si le consentement est donné
            const consent = localStorage.getItem('cookieConsent');
            if (consent === 'accepted') {
                localStorage.setItem('recruiter_info', JSON.stringify(formData));
            }

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                // On ne vide plus le formulaire si on veut qu'il reste pré-rempli (ou on le laisse tel quel)
                // Mais pour cette session on peut le laisser ainsi
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {isSuccess ? (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Intérêt envoyé !</h3>
                        <p className="text-slate-500">ZANOVA vous contactera très prochainement pour faire le lien avec ce talent.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Intéressé par ce talent ?</h3>
                                <p className="text-xs text-slate-500 font-medium">Manifestez votre intérêt pour entrer en contact.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Votre Nom Complet *
                                    </label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: Jean Dupont"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                            value={formData.recruiter_name}
                                            onChange={(e) => setFormData({ ...formData, recruiter_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Nom de l'entreprise *
                                    </label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: Google Madagascar"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Email professionnel *
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            required
                                            type="email"
                                            placeholder="nom@entreprise.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                        Téléphone de contact
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            placeholder="+261 34 XX XXX XX"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Confirmer l'intérêt</span>
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                                En cliquant, vous acceptez que ZANOVA transmette votre demande
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecruiterInterestModal;
