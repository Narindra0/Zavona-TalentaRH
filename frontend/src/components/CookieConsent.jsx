import { useState, useEffect } from 'react';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[500] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative group">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />

                <div className="p-6 md:p-8 relative">
                    <div className="flex items-start gap-5">
                        <div className="shrink-0 w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                            <Cookie size={24} />
                        </div>

                        <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                Cookies & Expérience
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Nous utilisons des cookies pour <span className="text-slate-900 font-medium tracking-tight">faciliter le remplissage de vos formulaires</span> et améliorer votre navigation sur ZANOVA.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <button
                            onClick={handleDecline}
                            className="px-6 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            <X size={16} />
                            Refuser
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-6 py-3.5 text-sm font-bold bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group/btn"
                        >
                            <Check size={16} />
                            <span>Accepter</span>
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-1.5 opacity-40">
                        <ShieldCheck size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Respect de la vie privée
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
