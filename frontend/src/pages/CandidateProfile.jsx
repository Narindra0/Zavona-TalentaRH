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
    X,
    User,
    Star
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
                    consultant_note: data.consultant_note && data.consultant_note.trim() !== "" ? data.consultant_note : null
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
                {/* Actions flottantes */}
                <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
                    {isInterested ? (
                        <button
                            onClick={handleUninterest}
                            className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                        >
                            <X size={18} />
                            Désintéresser
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/30 cta-pulse"
                        >
                            <Star size={18} />
                            Intéressé par le talent
                        </button>
                    )}
                    <button className="bg-white text-slate-600 p-3 rounded-2xl hover:bg-slate-50 transition-all shadow-lg shadow-slate-200">
                        <Share2 size={18} />
                    </button>
                </div>

                <RecruiterInterestModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleInterestSubmit}
                    isSubmitting={isSubmittingInterest}
                />

                <div className="max-w-4xl mx-auto">
                    {/* Carte principale du profil */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        {/* En-tête du profil avec avatar stylisé */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                {/* Avatar et infos principales */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25 mb-6">
                                        <User className="text-white" size={48} />
                                    </div>
                                    <span className={`inline-flex px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border mb-4 ${style}`}>
                                        {talent.contract_type}
                                    </span>
                                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                                        {talent.first_name} {talent.last_name}
                                    </h1>
                                    <p className="text-xl font-semibold text-orange-400 mb-6">
                                        {talent.position_searched}
                                    </p>
                                    
                                    {/* Métriques clés */}
                                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Briefcase size={16} />
                                            {talent.experience_level} d'expérience
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <MapPin size={16} />
                                            {talent.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar size={16} />
                                            Dispo : {talent.disponibility}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div className="p-8 lg:p-12 space-y-12">
                            {/* Résumé professionnel */}
                            {talent.bio && (
                                <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                        <h3 className="text-lg font-bold text-slate-900">À propos</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        {talent.bio}
                                    </p>
                                </section>
                            )}

                            {/* Compétences et Langues sur deux colonnes */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Expertises Techniques */}
                                {talent.skills && talent.skills.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                            <h3 className="text-lg font-bold text-slate-900">Expertises Techniques</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {talent.skills.map((skill, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-300 transition-all">
                                                    <span className="text-sm font-semibold text-slate-700">{skill}</span>
                                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Langues */}
                                {talent.languages && talent.languages.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                            <h3 className="text-lg font-bold text-slate-900">Langues</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {talent.languages.map((lang, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Note du consultant */}
                            {talent.consultant_note && (
                                <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Award className="text-orange-400" size={20} />
                                        <h3 className="text-lg font-bold text-white">Note du consultant</h3>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed mb-6 italic">
                                        "{talent.consultant_note}"
                                    </p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-sm">ZH</div>
                                        <div>
                                            <p className="text-sm font-bold text-white">ZANOVA Headhunter</p>
                                            <p className="text-xs text-slate-400 uppercase tracking-tighter">Consultant Senior</p>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Badges de vérification */}
                    <div className="flex items-center justify-center gap-8 py-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Identité vérifiée</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Tests réussis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Certifié ZANOVA</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateProfile;
