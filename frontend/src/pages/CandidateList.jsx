import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, Filter, Loader2 } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import CandidateCard from '../components/CandidateCard';
import CandidateProfileModal from '../components/CandidateProfileModal';
import api from '../api/axios';

const CandidateList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [contractFilter, setContractFilter] = useState(searchParams.get('type')?.toUpperCase() || "Tous les contrats");
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);
            try {
                const params = {
                    status: 'ACTIVE',
                    page: pagination.current_page,
                    search: debouncedSearch || undefined,
                    contract_type: (contractFilter !== "Tous les contrats") ? contractFilter : undefined
                };

                const response = await api.get('/candidates', { params });

                // Laravel Paginated response structure: { data: [...], links: {...}, meta: {...} }
                const { data, meta } = response.data;

                const mappedCandidates = data.map(candidate => ({
                    ...candidate,
                    category: candidate.category?.name || 'N/A',
                    sub_category: candidate.sub_category?.name || 'N/A',
                    skills: candidate.skills?.map(skill => skill.name) || []
                }));

                setCandidates(mappedCandidates);
                setPagination({
                    current_page: meta.current_page,
                    last_page: meta.last_page,
                    total: meta.total
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching candidates:", err);
                setError("Impossible de charger les candidats.");
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [pagination.current_page, debouncedSearch, contractFilter]);

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam) {
            if (typeParam.toLowerCase() === 'tous') {
                setContractFilter("Tous les contrats");
            } else {
                setContractFilter(typeParam.toUpperCase());
            }
        }
    }, [searchParams]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPagination(prev => ({ ...prev, current_page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleViewProfile = (candidateId) => {
        setSelectedCandidate(candidateId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCandidate(null);
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={48} />
                </div>
            </PublicLayout>
        );
    }

    if (error) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 flex items-center justify-center">
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Centered Search */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl mb-3">
                                Recrutez l'excellence
                            </h2>
                            <p className="text-slate-500 text-sm max-w-lg">
                                Une sélection rigoureuse de talents pour vos projets stratégiques.
                            </p>
                        </div>

                        {/* Barre de recherche compacte */}
                        <div className="w-full max-w-3xl">
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-1.5 flex flex-col sm:flex-row items-center gap-1">

                                {/* Recherche textuelle */}
                                <div className="flex-grow flex items-center px-4 gap-3 w-full h-11">
                                    <Search className="text-slate-300 shrink-0" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Métier ou mot-clé..."
                                        className="w-full h-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Séparateur vertical */}
                                <div className="hidden sm:block w-px h-6 bg-slate-100 mx-1"></div>

                                {/* Filtre Contrat */}
                                <div className="relative w-full sm:w-44 h-11">
                                    <select
                                        className="w-full h-full pl-4 pr-10 bg-transparent appearance-none outline-none text-sm text-slate-600 font-medium cursor-pointer"
                                        value={contractFilter}
                                        onChange={(e) => setContractFilter(e.target.value)}
                                    >
                                        <option>Tous les contrats</option>
                                        <option value="CDI">CDI</option>
                                        <option value="CDD">CDD</option>
                                        <option value="STAGE">STAGE</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                </div>

                                {/* Bouton Action */}
                                <button
                                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 h-11 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                                >
                                    <Search size={16} />
                                    <span className="text-sm">Trouver</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section Résultats Count */}
                    <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                                Résultats de recherche
                            </h3>
                            <p className="text-slate-900 font-bold text-xl mt-1">
                                {pagination.total} profil{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
                            </p>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Filter size={14} />
                            Filtrer par date
                        </button>
                    </div>

                    {/* Grille de Talents */}
                    {candidates.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {candidates.map((candidate) => (
                                    <CandidateCard 
                                        key={candidate.id} 
                                        candidate={candidate} 
                                        onViewProfile={handleViewProfile}
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {pagination.last_page > 1 && (
                                <div className="mt-16 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-orange-500 hover:border-orange-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                    >
                                        Précédent
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(pagination.last_page)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${pagination.current_page === i + 1
                                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                        : 'text-slate-400 hover:bg-white hover:text-orange-500'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-orange-500 hover:border-orange-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100">
                            <p className="text-slate-400 font-medium">Aucun talent ne correspond à ces critères.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modal de profil */}
            <CandidateProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                candidateId={selectedCandidate}
            />
        </PublicLayout>
    );
};

export default CandidateList;

