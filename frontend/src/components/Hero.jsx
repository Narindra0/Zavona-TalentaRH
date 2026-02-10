import { useState, useEffect } from 'react';

const Hero = () => {
    const [data, setData] = useState({
        title: "Trouvez les meilleurs talents",
        subtitle: "Connectez-vous avec l'excellence pour vos projets de demain.",
        cta: "Explorer nos Talents",
        image: "/hero-bg.png"
    });

    useEffect(() => {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const savedImage = parsed?.hero?.image;

                // If saved image is empty or invalid, use the public default
                const isInvalid = !savedImage || savedImage.trim() === "";

                const finalImage = isInvalid ? "/hero-bg.png" : savedImage;

                setData({
                    title: parsed?.hero?.title || "Trouvez les meilleurs talents",
                    subtitle: parsed?.hero?.subtitle || "Connectez-vous avec l'excellence pour vos projets de demain.",
                    cta: parsed?.hero?.cta || "Explorer nos Talents",
                    image: finalImage
                });
            } catch (e) {
                console.error("Error parsing siteData", e);
            }
        }
    }, []);

    const titleParts = (data.title || "Trouvez les meilleurs talents").split(' ');
    const lastWord = titleParts.pop();
    const firstPart = titleParts.join(' ');

    return (
        <header className="relative px-6 pt-10 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="h-[500px] rounded-[2.5rem] flex items-center justify-center text-center p-8 overflow-hidden relative shadow-2xl bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.8), rgba(15, 23, 42, 0.4)), url('${data.image}')`
                    }}>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 uppercase">
                            {firstPart} <span className="text-orange-400">{lastWord}</span>
                        </h1>
                        <p className="text-xl text-white/90 font-medium mb-8">
                            {data.subtitle}
                        </p>
                        <button className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-standard shadow-lg">
                            {data.cta}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
