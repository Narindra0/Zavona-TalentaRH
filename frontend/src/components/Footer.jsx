import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/Logo-ZTRH.png';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        description: "ZANOVA connecte les talents les plus qualifiés de Madagascar avec les entreprises visionnaires. Nous redéfinissons le recrutement par une approche humaine et innovante.",
        socials: [
            { id: 'fb', platform: 'Facebook', url: 'https://facebook.com/zanovah', icon: 'fab fa-facebook-f' },
            { id: 'li', platform: 'LinkedIn', url: 'https://linkedin.com/company/zanova', icon: 'fab fa-linkedin-in' },
            { id: 'ig', platform: 'Instagram', url: 'https://instagram.com/zanova', icon: 'fab fa-instagram' }
        ]
    });

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.footer) {
                    setFooterData(prev => ({
                        ...prev,
                        ...parsed.footer,
                        // Conserver les icônes par défaut si non fournies
                        socials: parsed.footer.socials?.map((s, i) => ({
                            ...prev.socials[i],
                            ...s
                        })) || prev.socials
                    }));
                }
            } catch (e) {
                console.error("Error loading footer data", e);
            }
        }
    }, []);

    return (
        <footer className="bg-[#0f172a] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Colonne 1: Branding & Description */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center">
                            <img
                                src={logoImg}
                                alt="ZANOVA Logo"
                                className="h-12 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {footerData.description}
                        </p>
                    </div>

                    {/* Colonne 2: Liens Rapides */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 border-l-4 border-orange-500 pl-3 uppercase tracking-wider text-slate-200">Nos Services</h3>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><Link to="/talents?type=CDI" className="footer-link flex items-center">Recrutement CDI</Link></li>
                            <li><Link to="/talents?type=CDD" className="footer-link flex items-center">Missions CDD</Link></li>
                            <li><Link to="/talents?type=STAGE" className="footer-link flex items-center">Programmes Stagiaires</Link></li>
                            <li><Link to="/#contact" className="footer-link flex items-center">Conseil RH</Link></li>
                            <li><Link to="/#contact" className="footer-link flex items-center">Chasse de têtes</Link></li>
                        </ul>
                    </div>

                    {/* Colonne 3: Réseaux Sociaux */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 border-l-4 border-orange-500 pl-3 uppercase tracking-wider text-slate-200">Suivez-nous</h3>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            {footerData.socials.map((social) => (
                                <li key={social.id}>
                                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="footer-link flex items-center">
                                        <i className={`${social.icon || 'fas fa-link'} w-5`}></i>
                                        <span>{social.platform}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 border-l-4 border-orange-500 pl-3 uppercase tracking-wider text-slate-200">Restez informé</h3>
                        <p className="text-slate-400 text-sm mb-4">Abonnez-vous pour recevoir les dernières offres et conseils RH.</p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20"
                            >
                                S'abonner
                            </button>
                        </form>
                    </div>

                </div>

                {/* Barre de séparation et Copyright */}
                <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} ZANOVA Talenta RH. Tous droits réservés. Antananarivo, Madagascar.</p>
                    <div className="flex space-x-6">
                        <Link to="/#mentions" className="hover:text-white transition-colors">Mentions Légales</Link>
                        <Link to="/#privacy" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
                        <Link to="/#cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
