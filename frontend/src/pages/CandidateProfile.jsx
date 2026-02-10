import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    ArrowLeft,
    Mail,
    Phone,
    Download,
    FileText,
    ExternalLink,
    Award,
    CheckCircle2,
    MapPin,
    Share2,
    Calendar,
    Loader2,
    X
} from 'lucide-react';
import api from '../api/axios';
import logoZTRH from '../assets/Logo-ZTRH.png';
import RecruiterInterestModal from '../components/RecruiterInterestModal';

const CandidateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [talent, setTalent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInterested, setIsInterested] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

    useEffect(() => {
        const interests = JSON.parse(localStorage.getItem('recruiter_interests') || '{}');
        if (interests[id]) {
            setIsInterested(true);
        }
    }, [id]);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await api.get(`/candidates/${id}`);
                const data = response.data;
                const mappedTalent = {
                    ...data,
                    category: data.category?.name || 'N/A',
                    sub_category: data.sub_category?.name || 'N/A',
                    skills: data.skills?.map(s => s.name) || [],
                    bio: data.description && data.description.trim() !== "" ? data.description : null,
                    // Using real data from backend
                    location: "Madagascar",
                    disponibility: "Immédiate",
                    contract_type: data.contract_type || "CDI",
                    languages: data.languages || [],
                    consultant_note: data.consultant_note && data.consultant_note.trim() !== "" ? data.consultant_note : null,
                    cv_url: data.signed_cv_url ? `${data.signed_cv_url}&#toolbar=0&navpanes=0&scrollbar=0` : null
                };
                setTalent(mappedTalent);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching candidate:", err);
                setError("Impossible de charger le profil.");
                setLoading(false);
            }
        };

        if (id) {
            fetchCandidate();
        }
    }, [id]);

    const handleInterestSubmit = async (formData) => {
        setIsSubmittingInterest(true);
        try {
            await api.post(`/candidates/${id}/interest`, formData);

            // Save to localStorage
            const interests = JSON.parse(localStorage.getItem('recruiter_interests') || '{}');
            interests[id] = formData.email;
            localStorage.setItem('recruiter_interests', JSON.stringify(interests));

            setIsInterested(true);
            return true;
        } catch (err) {
            console.error("Error submitting interest:", err);
            alert("Une erreur est survenue lors de l'envoi de votre intérêt.");
            return false;
        } finally {
            setIsSubmittingInterest(false);
        }
    };

    const handleUninterest = async () => {
        if (!window.confirm("Voulez-vous retirer votre intérêt pour ce talent ?")) return;

        const interests = JSON.parse(localStorage.getItem('recruiter_interests') || '{}');
        const email = interests[id];

        try {
            await api.post(`/candidates/${id}/uninterest`, { email });

            // Remove from localStorage
            delete interests[id];
            localStorage.setItem('recruiter_interests', JSON.stringify(interests));

            setIsInterested(false);
        } catch (err) {
            console.error("Error removing interest:", err);
            // Even if API fails, we could opt to clear local state if it's a persistent error
            setIsInterested(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    if (error || !talent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || "Talent introuvable"}</h2>
                <button
                    onClick={() => navigate('/talents')}
                    className="flex items-center gap-2 text-orange-600 font-bold hover:underline"
                >
                    <ArrowLeft size={18} /> Retour aux talents
                </button>
            </div>
        );
    }

    // Mapping des couleurs pour le badge de contrat
    const contractStyles = {
        'CDI': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'CDD': 'bg-blue-50 text-blue-700 border-blue-100',
        'STAGE': 'bg-purple-50 text-purple-700 border-purple-100'
    };
    const style = contractStyles[talent.contract_type] || 'bg-slate-50 text-slate-700 border-slate-100';

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-8">
            {/* Barre de Navigation Supérieure */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-2 cursor-pointer">
                            <img src={logoZTRH} alt="ZTRH Logo" className="h-10 w-auto" />
                        </Link>

                        <button
                            onClick={() => navigate('/talents')}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
                        >
                            Quitter la vue
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                {/* Actions de retour et utilitaires */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => navigate('/talents')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors w-fit"
                    >
                        <ArrowLeft size={18} />
                        Retour aux résultats
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-100 rounded-xl transition-all shadow-sm">
                            <Share2 size={18} />
                        </button>
                        {isInterested ? (
                            <button
                                onClick={handleUninterest}
                                className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <X size={18} />
                                Désintéresser
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 cta-pulse"
                            >
                                Intéressé par le talent
                            </button>
                        )}
                    </div>
                </div>

                <RecruiterInterestModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleInterestSubmit}
                    isSubmitting={isSubmittingInterest}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                    {/* COLONNE GAUCHE : Visualisation du CV */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-28">
                            <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 aspect-[1/1.414]">
                                {talent.cv_url ? (
                                    <embed
                                        src={talent.cv_url}
                                        type="application/pdf"
                                        className="w-full h-full"
                                        title="CV Aperçu"
                                    />
                                ) : (
                                    <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                        <FileText size={64} className="mb-4" />
                                        <p className="font-bold text-sm uppercase tracking-widest">Aucun CV disponible</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-widest opacity-60">
                                Document certifié conforme par ZANOVA
                            </p>
                        </div>
                    </div>

                    {/* COLONNE DROITE : Informations détaillées */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 p-8 lg:p-12 shadow-sm">
                            {/* En-tête du profil */}
                            <div className="border-b border-slate-50 pb-10 mb-10">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="space-y-2">
                                        <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${style}`}>
                                            {talent.contract_type}
                                        </span>
                                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                                            {talent.first_name} {talent.last_name}
                                        </h2>
                                        <p className="text-xl font-bold text-orange-500">
                                            {talent.position_searched}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-6">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                                <Briefcase size={16} className="text-slate-300" />
                                                {talent.experience_level} d'expérience
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                                <MapPin size={16} className="text-slate-300" />
                                                {talent.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                                <Calendar size={16} className="text-slate-300" />
                                                Dispo : {talent.disponibility}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Contenu principal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-10">
                                    {/* Résumé Professionnel */}
                                    {talent.bio && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">À propos</h4>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed text-sm font-medium">
                                                {talent.bio}
                                            </p>
                                        </section>
                                    )}

                                    {/* Langues */}
                                    {talent.languages && talent.languages.length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Langues</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {talent.languages.map((lang, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="space-y-10">
                                    {/* Expertises Techniques */}
                                    {talent.skills && talent.skills.length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Expertises</h4>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {talent.skills.map((skill, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-orange-100 transition-colors">
                                                        <span className="text-xs font-bold text-slate-700">{skill}</span>
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Zone de recommandation */}
                                    {talent.consultant_note && (
                                        <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-200">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Award className="text-orange-400" size={18} />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Note du consultant</h4>
                                            </div>
                                            <p className="text-xs text-slate-300 font-medium leading-relaxed italic mb-6">
                                                "{talent.consultant_note}"
                                            </p>
                                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-[10px]">ZH</div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-white">ZANOVA Headhunter</p>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Consultant Senior</p>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pied de page informatif */}
                        <div className="flex items-center justify-center gap-8 py-4 opacity-40">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Identité vérifiée</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Tests réussis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateProfile;
