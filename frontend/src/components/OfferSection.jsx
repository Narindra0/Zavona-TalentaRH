import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Briefcase, Clock, GraduationCap,
    Star, Heart, Zap, Shield, Globe, Award
} from 'lucide-react';

const ICON_MAP = {
    Users, Briefcase, Clock, GraduationCap,
    Star, Heart, Zap, Shield, Globe, Award
};

const OfferSection = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: "NOS SERVICES & OFFRES",
        description: "ZANOVA met en avant l'humain. Découvrez directement les talents disponibles selon leur mobilité et type de collaboration souhaitée.",
        cards: [
            { id: 'all', title: 'Tous nos Talents', description: "Explorez l'intégralité de notre vivier de talents qualifiés et trouvez la perle rare.", type: 'Tous', icon: 'Users' },
            { id: 'cdi', title: 'Profils CDI', description: 'Des experts engagés en quête de stabilité pour un partenariat durable et fructueux.', type: 'CDI', icon: 'Briefcase' },
            { id: 'cdd', title: 'Profils CDD', description: 'Des talents hautement qualifiés disponibles pour des missions spécifiques et flexibles.', type: 'CDD', icon: 'Clock' },
            { id: 'stage', title: 'Profils Stagiaires', description: 'Une nouvelle génération de talents prêts à apprendre et à innover au sein de vos équipes.', type: 'STAGE', icon: 'GraduationCap' }
        ]
    });

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(prev => ({
                    ...prev,
                    title: parsed?.services?.title || prev.title,
                    description: parsed?.services?.description || prev.description,
                    cards: parsed?.services?.cards || prev.cards
                }));
            } catch (e) {
                console.error("Error parsing siteData in OfferSection", e);
            }
        }
    }, []);

    const handleSearch = (type) => {
        navigate(`/talents?type=${type}`);
    };

    return (
        <section id="offers" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold mb-4 text-slate-900 uppercase">
                        {data.title}
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        {data.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.cards.map((offer, index) => {
                        const Icon = ICON_MAP[offer.icon] || Users;
                        return (
                            <div
                                key={offer.id || index}
                                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 card-hover"
                            >
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">{offer.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 min-h-[75px]">
                                    {offer.description}
                                </p>
                                <button
                                    onClick={() => handleSearch(offer.type)}
                                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-standard"
                                >
                                    Découvrir
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OfferSection;
