import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Save,
    RotateCcw,
    Layout,
    Type,
    Image as ImageIcon,
    Users,
    Phone,
    Mail,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    Clock,
    GraduationCap,
    Star,
    Heart,
    Zap,
    Shield,
    Globe,
    Award,
    Activity,
    HelpCircle
} from 'lucide-react';

const EditSite = () => {
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock initial data
    const initialData = {
        hero: {
            title: "DÉCOUVREZ LES MEILLEURS TALENTS À MADAGASCAR",
            subtitle: "ZANOVA vous connecte avec les profils les plus qualifiés pour propulser votre entreprise vers de nouveaux sommets.",
            cta: "Explorer nos Talents",
            image: "/hero-bg.png"
        },
        services: {
            title: "NOS SERVICES & OFFRES",
            description: "Nous offrons une gamme complète de solutions RH adaptées à vos besoins spécifiques.",
            cards: [
                { id: 'all', title: 'Tous nos Talents', description: "Explorez l'intégralité de notre vivier de talents qualifiés et trouvez la perle rare.", type: 'Tous', icon: 'Users' },
                { id: 'cdi', title: 'Profils CDI', description: 'Des experts engagés en quête de stabilité pour un partenariat durable et fructueux.', type: 'CDI', icon: 'Briefcase' },
                { id: 'cdd', title: 'Profils CDD', description: 'Des talents hautement qualifiés disponibles pour des missions spécifiques et flexibles.', type: 'CDD', icon: 'Clock' },
                { id: 'stage', title: 'Profils Stagiaires', description: 'Une nouvelle génération de talents prêts à apprendre et à innover au sein de vos équipes.', type: 'STAGE', icon: 'GraduationCap' }
            ]
        },
        about: {
            title: "À PROPOS DE ZANOVA",
            mainTitle: "Révolutionner le recrutement par le Talent-First",
            content: "Plus qu'une agence de recrutement, nous sommes votre partenaire stratégique dans la gestion et l'acquisition de talents exceptionnels.",
            image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
            stats: [
                { value: "98%", label: "Satisfaction Recruteurs" },
                { value: "2k+", label: "Talents Disponibles" }
            ],
            features: [
                { title: "Transparence Totale", description: "Des profils complets et vérifiés pour une confiance mutuelle immédiate." },
                { title: "Efficacité Augmentée", description: "Réduisez votre temps de sourcing grâce à notre vivier pré-qualifié." }
            ]
        },
        contact: {
            title: "CONTACTEZ-NOUS",
            email: "contact@zanova.mg",
            phone: "+261 34 00 000 00",
            address: "Antananarivo, Madagascar"
        },
        faqs: {
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
        }
    };

    const [siteData, setSiteData] = useState(initialData);

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSiteData(prev => ({
                    ...prev,
                    ...parsed,
                    services: {
                        ...prev.services,
                        ...parsed.services,
                        // Ensure cards exist, merging saved cards if they exist, otherwise keep default/prev cards
                        cards: parsed?.services?.cards || prev.services.cards
                    },
                    hero: {
                        ...prev.hero,
                        ...parsed.hero
                    },
                    about: {
                        ...prev.about,
                        ...parsed.about
                    },
                    contact: {
                        ...prev.contact,
                        ...parsed.contact
                    },
                    faqs: {
                        ...prev.faqs,
                        ...(parsed.faqs || {}),
                        items: parsed?.faqs?.items || prev.faqs.items
                    }
                }));
            } catch (e) {
                console.error("Error loading site data", e);
            }
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('siteData', JSON.stringify(siteData));
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler toutes les modifications non sauvegardées ?")) {
            const saved = localStorage.getItem('siteData');
            setSiteData(saved ? JSON.parse(saved) : initialData);
        }
    };

    const updateField = (section, field, value) => {
        setSiteData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Services Management
    const addServiceCard = () => {
        const newCard = {
            id: Date.now().toString(),
            title: "Nouveau Service",
            description: "Description du service...",
            type: "CDI",
            icon: "Star"
        };
        setSiteData(prev => ({
            ...prev,
            services: {
                ...prev.services,
                cards: [...(prev.services.cards || []), newCard]
            }
        }));
    };

    const removeServiceCard = (index) => {
        const newCards = [...siteData.services.cards];
        newCards.splice(index, 1);
        setSiteData(prev => ({
            ...prev,
            services: {
                ...prev.services,
                cards: newCards
            }
        }));
    };

    const updateServiceCard = (index, field, value) => {
        const newCards = [...siteData.services.cards];
        newCards[index] = { ...newCards[index], [field]: value };
        setSiteData(prev => ({
            ...prev,
            services: {
                ...prev.services,
                cards: newCards
            }
        }));
    };

    // FAQ Management
    const addFaq = () => {
        const newFaq = {
            q: "Nouvelle Question",
            a: "Réponse..."
        };
        setSiteData(prev => ({
            ...prev,
            faqs: {
                ...prev.faqs,
                items: [...(prev.faqs.items || []), newFaq]
            }
        }));
    };

    const removeFaq = (index) => {
        const newItems = [...siteData.faqs.items];
        newItems.splice(index, 1);
        setSiteData(prev => ({
            ...prev,
            faqs: {
                ...prev.faqs,
                items: newItems
            }
        }));
    };

    const updateFaq = (index, field, value) => {
        const newItems = [...siteData.faqs.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setSiteData(prev => ({
            ...prev,
            faqs: {
                ...prev.faqs,
                items: newItems
            }
        }));
    };

    const AVAILABLE_ICONS = ['Users', 'Briefcase', 'Clock', 'GraduationCap', 'Star', 'Heart', 'Zap', 'Shield', 'Globe', 'Award'];

    const tabs = [
        { id: 'hero', label: 'Section Hero', icon: <Layout size={18} /> },
        { id: 'services', label: 'Services', icon: <Users size={18} /> },
        { id: 'about', label: 'À Propos', icon: <Type size={18} /> },
        { id: 'faqs', label: 'FAQ', icon: <HelpCircle size={18} /> },
        { id: 'contact', label: 'Contact', icon: <Phone size={18} /> },
    ];

    const IconComponent = ({ name, size = 16, className = "" }) => {
        const Icon = {
            Users, Briefcase, Clock, GraduationCap, Star, Heart, Zap, Shield, Globe, Award
        }[name];
        return Icon ? <Icon size={size} className={className} /> : null;
    };

    return (
        <AdminLayout>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 active:scale-[0.98]'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 shadow-sm'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                        <div className="flex items-center gap-2 text-orange-700 mb-2">
                            <AlertCircle size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Note</span>
                        </div>
                        <p className="text-[11px] text-orange-600 font-medium leading-relaxed">
                            Les modifications apportées ici seront visibles immédiatement sur la page d'accueil après sauvegarde.
                        </p>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <header className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-orange-600 shadow-sm">
                                {tabs.find(t => t.id === activeTab)?.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Édition : {tabs.find(t => t.id === activeTab)?.label}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configuration du contenu</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors"
                            >
                                <RotateCcw size={16} />
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-600/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <Save size={16} />}
                                {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                            </button>
                        </div>
                    </header>

                    <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                        {activeTab === 'hero' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <FormGroup label="Titre Principal" icon={<Type size={16} />}>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none min-h-[100px]"
                                        value={siteData.hero.title}
                                        onChange={(e) => updateField('hero', 'title', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup label="Sous-titre" icon={<Type size={16} />}>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none min-h-[80px]"
                                        value={siteData.hero.subtitle}
                                        onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                                    />
                                </FormGroup>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormGroup label="Texte du bouton CTA" icon={<Layout size={16} />}>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.hero.cta}
                                            onChange={(e) => updateField('hero', 'cta', e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Image de fond (URL)" icon={<ImageIcon size={16} />}>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.hero.image}
                                            onChange={(e) => updateField('hero', 'image', e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-6">
                                    <FormGroup label="Titre de la section" icon={<Type size={16} />}>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.services.title}
                                            onChange={(e) => updateField('services', 'title', e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Description courte" icon={<Type size={16} />}>
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none min-h-[100px]"
                                            value={siteData.services.description}
                                            onChange={(e) => updateField('services', 'description', e.target.value)}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-slate-800">Cartes de Services</h4>
                                        <button
                                            onClick={addServiceCard}
                                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                                        >
                                            + Ajouter
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {siteData.services.cards?.map((card, index) => (
                                            <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative group hover:border-orange-200 transition-colors">
                                                <button
                                                    onClick={() => removeServiceCard(index)}
                                                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 p-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                                    title="Supprimer"
                                                >
                                                    <RotateCcw className="rotate-45" size={16} />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Titre de l'offre"
                                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 font-bold"
                                                            value={card.title}
                                                            onChange={(e) => updateServiceCard(index, 'title', e.target.value)}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Type (ex: CDI)"
                                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                                                            value={card.type}
                                                            onChange={(e) => updateServiceCard(index, 'type', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="relative flex items-center">
                                                            <span className="absolute left-3 text-slate-400">
                                                                <IconComponent name={card.icon} size={16} />
                                                            </span>
                                                            <select
                                                                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-orange-500 text-slate-600 appearance-none"
                                                                value={card.icon}
                                                                onChange={(e) => updateServiceCard(index, 'icon', e.target.value)}
                                                            >
                                                                {AVAILABLE_ICONS.map(icon => (
                                                                    <option key={icon} value={icon}>{icon}</option>
                                                                ))}
                                                            </select>
                                                            <span className="absolute right-3 text-slate-400 pointer-events-none">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </span>
                                                        </div>
                                                        <textarea
                                                            placeholder="Description"
                                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 min-h-[60px]"
                                                            value={card.description}
                                                            onChange={(e) => updateServiceCard(index, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-6">
                                    <FormGroup label="Titre de la section" icon={<Type size={16} />}>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.about.title}
                                            onChange={(e) => updateField('about', 'title', e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Titre Principal" icon={<Type size={16} />}>
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none min-h-[80px]"
                                            value={siteData.about.mainTitle || "Révolutionner le recrutement par le Talent-First"}
                                            onChange={(e) => updateField('about', 'mainTitle', e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Contenu principal" icon={<Type size={16} />}>
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none min-h-[150px]"
                                            value={siteData.about.content}
                                            onChange={(e) => updateField('about', 'content', e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Image (URL)" icon={<ImageIcon size={16} />}>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.about.image || ""}
                                            onChange={(e) => updateField('about', 'image', e.target.value)}
                                        />
                                    </FormGroup>
                                </div>

                                {/* Stats Section */}
                                <div className="border-t border-slate-100 pt-6">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Activity size={18} className="text-orange-500" />
                                        Statistiques Flottantes
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[0, 1].map((index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Valeur (ex: 98%)"
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                                                        value={siteData.about.stats?.[index]?.value || ""}
                                                        onChange={(e) => {
                                                            const newStats = [...(siteData.about.stats || [])];
                                                            newStats[index] = { ...newStats[index], value: e.target.value };
                                                            updateField('about', 'stats', newStats);
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Label"
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                                                        value={siteData.about.stats?.[index]?.label || ""}
                                                        onChange={(e) => {
                                                            const newStats = [...(siteData.about.stats || [])];
                                                            newStats[index] = { ...newStats[index], label: e.target.value };
                                                            updateField('about', 'stats', newStats);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Features Section */}
                                <div className="border-t border-slate-100 pt-6">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-orange-500" />
                                        Points Forts
                                    </h4>
                                    <div className="space-y-4">
                                        {[0, 1].map((index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                                                <div className="mt-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 border border-slate-100 shrink-0">
                                                    <span className="font-bold text-xs">{index + 1}</span>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Titre du point fort"
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                                                        value={siteData.about.features?.[index]?.title || ""}
                                                        onChange={(e) => {
                                                            const newFeatures = [...(siteData.about.features || [])];
                                                            newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                                                            updateField('about', 'features', newFeatures);
                                                        }}
                                                    />
                                                    <textarea
                                                        placeholder="Description"
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs h-20"
                                                        value={siteData.about.features?.[index]?.description || ""}
                                                        onChange={(e) => {
                                                            const newFeatures = [...(siteData.about.features || [])];
                                                            newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                                                            updateField('about', 'features', newFeatures);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'faqs' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-6">
                                    <FormGroup label="Titre de la section" icon={<Type size={16} />}>
                                        <input
                                            type="text"
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none`}
                                            value={siteData?.faqs?.title || ''}
                                            onChange={(e) => updateField('faqs', 'title', e.target.value)}
                                        />
                                    </FormGroup>

                                    <FormGroup label="Sous-titre" icon={<Type size={16} />}>
                                        <textarea
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none min-h-[80px]`}
                                            value={siteData?.faqs?.subtitle || ''}
                                            onChange={(e) => updateField('faqs', 'subtitle', e.target.value)}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-slate-800">Questions & Réponses</h4>
                                        <button
                                            type="button"
                                            onClick={addFaq}
                                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                                        >
                                            + Ajouter
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {siteData?.faqs?.items?.map((faq, index) => (
                                            <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative group hover:border-orange-200 transition-colors">
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaq(index)}
                                                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 p-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                                                >
                                                    <RotateCcw className="rotate-45" size={16} />
                                                </button>

                                                <div className="space-y-4">
                                                    <FormGroup label={`Question ${index + 1}`} icon={<HelpCircle size={14} />}>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-orange-500"
                                                            value={faq?.q || ''}
                                                            onChange={(e) => updateFaq(index, 'q', e.target.value)}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup label="Réponse" icon={<Type size={14} />}>
                                                        <textarea
                                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 min-h-[80px]"
                                                            value={faq?.a || ''}
                                                            onChange={(e) => updateFaq(index, 'a', e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <FormGroup label="Titre de la section" icon={<Type size={16} />}>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                        value={siteData.contact.title}
                                        onChange={(e) => updateField('contact', 'title', e.target.value)}
                                    />
                                </FormGroup>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormGroup label="Email de contact" icon={<Mail size={16} />}>
                                        <input
                                            type="email"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.contact.email}
                                            onChange={(e) => updateField('contact', 'email', e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label="Téléphone" icon={<Phone size={16} />}>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                            value={siteData.contact.phone}
                                            onChange={(e) => updateField('contact', 'phone', e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                                <FormGroup label="Adresse physique" icon={<MapPin size={16} />}>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                        value={siteData.contact.address}
                                        onChange={(e) => updateField('contact', 'address', e.target.value)}
                                    />
                                </FormGroup>
                            </div>
                        )}
                    </div>

                    <footer className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                        <div className={`flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all duration-500 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                            <CheckCircle2 size={16} />
                            Modifications enregistrées avec succès
                        </div>
                    </footer>
                </div>
            </div>
        </AdminLayout>
    );
};

const FormGroup = ({ label, icon, children }) => (
    <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {icon}
            {label}
        </label>
        {children}
    </div>
);

export default EditSite;
