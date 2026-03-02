import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Hero from '../components/Hero';
import OfferSection from '../components/OfferSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Home = () => {
    const { hash } = useLocation();
    const [activeFaq, setActiveFaq] = useState(null);
    const [faqData, setFaqData] = useState({
        title: "Questions Fréquentes",
        subtitle: "Tout ce que vous devez savoir sur nos services.",
        items: [
            {
                q: "Comment fonctionne la plateforme ?",
                a: "Notre plateforme connecte les talents aux meilleures opportunités. Créez simplement votre profil, téléchargez votre CV et postulez aux offres qui vous correspondent."
            },
            {
                q: "Est-ce gratuit pour les candidats ?",
                a: "Oui, l'inscription et l'accès aux offres sont entièrement gratuits pour tous les candidats."
            },
            {
                q: "Comment puis-je mettre à jour mon profil ?",
                a: "Connectez-vous à votre espace personnel pour modifier vos informations, ajouter de nouvelles expériences ou mettre à jour votre CV à tout moment."
            },
            {
                q: "Les recruteurs peuvent-ils voir mon profil ?",
                a: "Oui, une fois votre profil complété, il peut être visible par les recruteurs partenaires à la recherche de profils comme le vôtre."
            }
        ]
    });

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.faqs) {
                    setFaqData(parsed.faqs);
                }
            } catch (e) {
                console.error("Error loading site data", e);
            }
        }

        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [hash]);

    return (
        <PublicLayout>
            <Hero />
            <OfferSection />
            <AboutSection />
            {/* FAQ Section */}
            <section className="py-24 bg-slate-100/50">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">{faqData.title}</h2>
                        <p className="text-slate-500">{faqData.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        {faqData.items?.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    {faq.q}
                                    {activeFaq === i ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ContactSection />
        </PublicLayout>
    );
};

export default Home;
