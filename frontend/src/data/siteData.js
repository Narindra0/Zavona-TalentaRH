export const initialSiteData = {
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
            { id: 'stage', title: 'Profils Stagiaires', description: 'Une nouvelle génération de talents prêts à apprendre et à innover au sein de vos équipes.', type: 'STAGE', icon: 'GraduationCap' },
            { id: 'prestataire', title: 'Profils Prestataires', description: 'Des experts indépendants pour des missions spécifiques et du conseil stratégique.', type: 'Prestataire', icon: 'DollarSign' }
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
    },
    footer: {
        description: "ZANOVA connecte les talents les plus qualifiés de Madagascar avec les entreprises visionnaires. Nous redéfinissons le recrutement par une approche humaine et innovante.",
        socials: [
            { id: 'fb', platform: 'Facebook', url: 'https://facebook.com/zanovah' },
            { id: 'li', platform: 'LinkedIn', url: 'https://linkedin.com/company/zanova' },
            { id: 'ig', platform: 'Instagram', url: 'https://instagram.com/zanova' }
        ]
    }
};
