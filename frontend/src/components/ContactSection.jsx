import { useState, useEffect } from 'react';
import logoImg from '../assets/Logo-ZTRH.png';

const ContactSection = () => {
    const [data, setData] = useState({
        title: "Votre prochaine opportunité commence ici."
    });

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({
                    title: parsed?.contact?.title || "Votre prochaine opportunité commence ici."
                });
            } catch (e) {
                console.error("Error parsing siteData in ContactSection", e);
            }
        }
    }, []);

    return (
        <section id="contact" className="py-20 px-4 scroll-mt-24">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                    <div className="p-8 lg:p-14 flex-1 text-white">
                        <h2 className="text-3xl font-extrabold mb-4 uppercase">
                            {data.title}
                        </h2>
                        <p className="text-white/80 text-base mb-6 max-w-md">
                            Découvrez des offres adaptées à votre profil et connectez-vous avec des entreprises
                            qui recherchent vos talents.
                        </p>
                        <p className="text-white font-medium italic text-sm">
                            "Profitez d'un accompagnement simple, rapide et efficace pour faire évoluer votre carrière."
                        </p>
                    </div>

                    <div className="flex-1 bg-white/10 backdrop-blur-sm p-8 lg:p-14">
                        <form className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nom complet"
                                className="w-full px-6 py-3 rounded-2xl bg-white/90 border-transparent focus:border-orange-200 focus:ring-0 transition-standard outline-none text-slate-900 placeholder:text-slate-400"
                            />
                            <input
                                type="tel"
                                placeholder="Téléphone"
                                className="w-full px-6 py-3 rounded-2xl bg-white/90 border-transparent focus:border-orange-200 focus:ring-0 transition-standard outline-none text-slate-900 placeholder:text-slate-400"
                            />
                            <input
                                type="email"
                                placeholder="exemple@gmail.com"
                                className="w-full px-6 py-3 rounded-2xl bg-white/90 border-transparent focus:border-orange-200 focus:ring-0 transition-standard outline-none text-slate-900 placeholder:text-slate-400"
                            />
                            <textarea
                                placeholder="Vous avez des questions..."
                                rows="3"
                                className="w-full px-6 py-3 rounded-2xl bg-white/90 border-transparent focus:border-orange-200 focus:ring-0 transition-standard outline-none text-slate-900 placeholder:text-slate-400"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-slate-800 transition-standard shadow-lg"
                            >
                                Envoyer la demande
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
