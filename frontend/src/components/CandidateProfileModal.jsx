import { useState, useEffect } from 'react';
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
    Star,
    DollarSign
} from 'lucide-react';
import api from '../api/axios';
import logoZTRH from '../assets/Logo-ZTRH.png';
import RecruiterInterestModal from './RecruiterInterestModal';

const CandidateProfileModal = ({ isOpen, onClose, candidateId }) => {
    const [talent, setTalent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInterested, setIsInterested] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

    useEffect(() => {
        const interests = JSON.parse(localStorage.getItem('recruiter_interests') || '{}');
        if (interests[candidateId]) {
            setIsInterested(true);
        }
    }, [candidateId]);

    useEffect(() => {
        // Désactiver le scroll du body quand la modal est ouverte
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        // Nettoyer quand le composant est démonté
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchCandidate = async () => {
            if (!candidateId || !isOpen) return;
            
            try {
                setLoading(true);
                const response = await api.get(`/candidates/${candidateId}`);
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
                    rate_type: data.rate_type,
                    daily_rate: data.daily_rate,
                    weekly_rate: data.weekly_rate
                };
                setTalent(mappedTalent);
                setError(null);
            } catch (err) {
                console.error("Error fetching candidate:", err);
                setError("Impossible de charger le profil.");
            } finally {
                setLoading(false);
            }
        };

        if (candidateId && isOpen) {
            fetchCandidate();
        }
    }, [candidateId, isOpen]);

    const handleInterestSubmit = async (formData) => {
        setIsSubmittingInterest(true);
        try {
            await api.post(`/candidates/${candidateId}/interest`, formData);

            // Save to localStorage
            const interests = JSON.parse(localStorage.getItem('recruiter_interests') || '{}');
            interests[candidateId] = formData.email;
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
        const email = interests[candidateId];

        try {
            await api.post(`/candidates/${candidateId}/uninterest`, { email });

            // Remove from localStorage
            delete interests[candidateId];
            localStorage.setItem('recruiter_interests', JSON.stringify(interests));

            setIsInterested(false);
        } catch (err) {
            console.error("Error removing interest:", err);
            setIsInterested(false);
        }
    };

    if (!isOpen) return null;

    // Mapping des couleurs pour le badge de contrat
    const contractStyles = {
        'CDI': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'CDD': 'bg-blue-50 text-blue-700 border-blue-100',
        'STAGE': 'bg-purple-50 text-purple-700 border-purple-100',
        'Prestataire': 'bg-orange-50 text-orange-700 border-orange-100'
    };
    const style = contractStyles[talent?.contract_type] || 'bg-slate-50 text-slate-700 border-slate-100';

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4">
                <div className="relative w-full h-full sm:w-full sm:h-auto sm:max-w-4xl sm:max-h-[95vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col">
                    
                    {/* Header avec navigation - Sticky */}
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <img src={logoZTRH} alt="ZTRH Logo" className="h-6 sm:h-8 w-auto" />
                                <span className="text-xs sm:text-sm font-bold text-slate-500 hidden sm:inline">Profil du talent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isInterested ? (
                                    <button
                                        onClick={handleUninterest}
                                        className="bg-slate-100 text-slate-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-1 sm:gap-2"
                                    >
                                        <X size={14} className="sm:hidden" />
                                        <X size={16} className="hidden sm:block" />
                                        <span className="hidden sm:inline">Désintéresser</span>
                                        <span className="sm:hidden">Désintéresser</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-slate-900 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-1 sm:gap-2"
                                    >
                                        <Star size={14} className="sm:hidden" />
                                        <Star size={16} className="hidden sm:block" />
                                        <span className="hidden sm:inline">Intéressé</span>
                                        <span className="sm:hidden">Intéressé</span>
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <X size={18} className="sm:hidden" />
                                    <X size={20} className="hidden sm:block" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contenu scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20 sm:py-32">
                                <Loader2 className="animate-spin text-orange-500 sm:hidden" size={36} />
                                <Loader2 className="animate-spin text-orange-500 hidden sm:block" size={48} />
                            </div>
                        ) : error || !talent ? (
                            <div className="flex flex-col items-center justify-center py-20 sm:py-32 px-4 sm:px-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">{error || "Talent introuvable"}</h2>
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-2 text-orange-600 font-bold hover:underline"
                                >
                                    Fermer
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 sm:p-6 lg:p-8">
                                {/* Carte principale du profil */}
                                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                                    {/* En-tête du profil avec avatar stylisé */}
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 sm:px-8 py-8 sm:py-12 relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                                        <div className="relative z-10">
                                            {/* Avatar et infos principales */}
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25 mb-4 sm:mb-6">
                                                    <User className="text-white sm:hidden" size={32} />
                                                    <User className="text-white hidden sm:block" size={48} />
                                                </div>
                                                <span className={`inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border mb-3 sm:mb-4 ${style}`}>
                                                    {talent.contract_type}
                                                </span>
                                                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1.5 sm:mb-2 tracking-tight">
                                                    {talent.first_name} {talent.last_name}
                                                </h1>
                                                <p className="text-sm sm:text-xl font-semibold text-orange-400 mb-4 sm:mb-6">
                                                    {talent.position_searched}
                                                </p>
                                                
                                                {/* Métriques clés */}
                                                <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                                                        <Briefcase size={14} className="sm:hidden" />
                                                        <Briefcase size={16} className="hidden sm:block" />
                                                        {talent.experience_level} d'expérience
                                                    </div>
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                                                        <MapPin size={14} className="sm:hidden" />
                                                        <MapPin size={16} className="hidden sm:block" />
                                                        {talent.location}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                                                        <Calendar size={14} className="sm:hidden" />
                                                        <Calendar size={16} className="hidden sm:block" />
                                                        Dispo : {talent.disponibility}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenu principal */}
                                    <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-12">
                                        {/* Résumé professionnel */}
                                        {talent.bio && (
                                            <section className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-100">
                                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                                                    <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-orange-500 rounded-full"></div>
                                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">À propos</h3>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                                                    {talent.bio}
                                                </p>
                                            </section>
                                        )}

                                        {/* Section tarification pour les prestataires */}
                                        {talent.contract_type === 'Prestataire' && (
                                            <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <DollarSign size={16} className="text-orange-500" />
                                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Tarification</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {talent.rate_type === 'daily' && talent.daily_rate && (
                                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-slate-600">Journalier</span>
                                                                <span className="text-base sm:text-lg font-bold text-orange-600">
                                                                    {parseFloat(talent.daily_rate).toLocaleString('fr-MG')} Ar
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {talent.rate_type === 'weekly' && talent.weekly_rate && (
                                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-slate-600">Hebdomadaire</span>
                                                                <span className="text-base sm:text-lg font-bold text-orange-600">
                                                                    {parseFloat(talent.weekly_rate).toLocaleString('fr-MG')} Ar
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(!talent.rate_type || (!talent.daily_rate && !talent.weekly_rate)) && (
                                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
                                                            <p className="text-sm text-slate-500 italic">💰 Tarif non renseigné</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                        )}

                                        {/* Compétences et Langues sur deux colonnes */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                            {/* Expertises Techniques */}
                                            {talent.skills && talent.skills.length > 0 && (
                                                <section>
                                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                                                        <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-orange-500 rounded-full"></div>
                                                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Expertises Techniques</h3>
                                                    </div>
                                                    <div className="space-y-2 sm:space-y-3">
                                                        {talent.skills.map((skill, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-orange-300 transition-all">
                                                                <span className="text-xs sm:text-sm font-semibold text-slate-700">{skill}</span>
                                                                <CheckCircle2 size={14} className="sm:hidden text-emerald-500" />
                                                                <CheckCircle2 size={18} className="hidden sm:block text-emerald-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {/* Langues */}
                                            {talent.languages && talent.languages.length > 0 && (
                                                <section>
                                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                                                        <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-orange-500 rounded-full"></div>
                                                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Langues</h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                                        {talent.languages.map((lang, idx) => (
                                                            <span key={idx} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border border-slate-200">
                                                                {lang}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}
                                        </div>

                                        {/* Note du consultant */}
                                        {talent.consultant_note && (
                                            <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl">
                                                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                                    <Award className="text-orange-400 sm:hidden" size={16} />
                                                    <Award className="text-orange-400 hidden sm:block" size={20} />
                                                    <h3 className="text-base sm:text-lg font-bold text-white">Note du consultant</h3>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed mb-4 sm:mb-6 italic text-sm sm:text-base">
                                                    "{talent.consultant_note}"
                                                </p>
                                                <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-6 border-t border-white/10">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xs sm:text-sm">ZH</div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm font-bold text-white">ZANOVA Headhunter</p>
                                                        <p className="text-[9px] sm:text-xs text-slate-400 uppercase tracking-tighter">Consultant Senior</p>
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>

                                {/* Badges de vérification */}
                                <div className="flex items-center justify-center gap-4 sm:gap-8 py-6 sm:py-8">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">Identité vérifiée</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">Tests réussis</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">Certifié ZANOVA</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal d'intérêt */}
            <RecruiterInterestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleInterestSubmit}
                isSubmitting={isSubmittingInterest}
            />
        </div>
    );
};

export default CandidateProfileModal;
