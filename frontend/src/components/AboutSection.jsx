import { useState, useEffect } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

const AboutSection = () => {
    const [data, setData] = useState({
        title: "À propos de nous",
        mainTitle: "Révolutionner le recrutement par le Talent-First",
        content: "Chez ZANOVA Talenta RH, nous croyons que chaque individu possède un potentiel unique qui mérite d'être mis en lumière sans barrières inutiles.",
        image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
        stats: [
            { value: "98%", label: "Satisfaction Recruteurs" },
            { value: "2k+", label: "Talents Disponibles" }
        ],
        features: [
            { title: "Transparence Totale", description: "Des profils complets et vérifiés pour une confiance mutuelle immédiate." },
            { title: "Efficacité Augmentée", description: "Réduisez votre temps de sourcing grâce à notre vivier pré-qualifié." }
        ]
    });

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({
                    title: parsed?.about?.title || "À propos de nous",
                    mainTitle: parsed?.about?.mainTitle || "Révolutionner le recrutement par le Talent-First",
                    content: parsed?.about?.content || "Chez ZANOVA Talenta RH, nous croyons que chaque individu possède un potentiel unique qui mérite d'être mis en lumière sans barrières inutiles.",
                    image: parsed?.about?.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
                    stats: parsed?.about?.stats || [
                        { value: "98%", label: "Satisfaction Recruteurs" },
                        { value: "2k+", label: "Talents Disponibles" }
                    ],
                    features: parsed?.about?.features || [
                        { title: "Transparence Totale", description: "Des profils complets et vérifiés pour une confiance mutuelle immédiate." },
                        { title: "Efficacité Augmentée", description: "Réduisez votre temps de sourcing grâce à notre vivier pré-qualifié." }
                    ]
                });
            } catch (e) {
                console.error("Error parsing siteData in AboutSection", e);
            }
        }
    }, []);

    return (
        <section id="about" className="py-24 px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <div>
                        <span className="text-orange-600 font-bold uppercase tracking-widest text-xs">
                            {data.title}
                        </span>
                        <h2 className="text-4xl font-bold mt-4 mb-6 text-slate-900 leading-tight uppercase">
                            {data.mainTitle}
                        </h2>
                        <p className="text-slate-600 text-lg">
                            {data.content}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {data.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="mt-1 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 shadow-sm">
                                    {index === 0 ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{feature.title}</h4>
                                    <p className="text-slate-500">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="px-8 py-4 border-2 border-slate-900 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-standard">
                        En savoir plus sur notre vision
                    </button>
                </div>

                <div className="flex-1 relative">
                    <div className="relative w-full aspect-square bg-slate-200 rounded-[3rem] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-slate-900/40"></div>
                        <img
                            src={data.image}
                            alt="Équipe ZANOVA"
                            className="w-full h-full object-cover mix-blend-overlay"
                        />

                        {/* Floating Stats */}
                        {data.stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`absolute ${index === 0 ? 'top-10 right-10' : 'bottom-10 left-10'} bg-white p-6 rounded-3xl shadow-2xl`}
                            >
                                <div className={`text-3xl font-extrabold ${index === 0 ? 'text-orange-500' : 'text-slate-900'}`}>{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
