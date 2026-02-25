import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';
import {
    Users,
    UserPlus,
    Eye,
    Trash2,
    Search,
    Clock,
    CheckCircle2,
    Loader2,
    AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [statsData, setStatsData] = useState({ total: 0, active: 0, pending: 0 });
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPagination(prev => ({ ...prev, current_page: 1 }));
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchCandidates = async (page = 1, search = '', append = false) => {
        if (page === 1 && !append) setLoading(true);
        else setLoadingMore(true);

        try {
            const response = await api.get('/candidates', {
                params: {
                    page,
                    search: search || undefined
                }
            });
            const { data, meta } = response.data;
            const mappedCandidates = data.map(c => ({
                ...c,
                category: c.category?.name || 'N/A',
                sub_category: c.sub_category?.name || 'N/A',
            }));

            if (append) {
                setCandidates(prev => [...prev, ...mappedCandidates]);
            } else {
                setCandidates(mappedCandidates);
            }

            setPagination({
                current_page: meta.current_page,
                last_page: meta.last_page
            });
        } catch (err) {
            console.error("Error fetching candidates:", err);
            setError("Erreur chargement données");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchCandidates(1, debouncedSearch, false);
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, pendingRes] = await Promise.all([
                    api.get('/admin/candidates/stats'),
                    api.get('/pending-categories')
                ]);
                setStatsData(statsRes.data);
                setPendingCount(pendingRes.data.length);
            } catch (err) {
                console.error("Error fetching dashboard meta:", err);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLoadMore = () => {
        if (pagination.current_page < pagination.last_page) {
            fetchCandidates(pagination.current_page + 1, debouncedSearch, true);
        }
    };

    const stats = [
        {
            label: 'Total Candidats',
            value: statsData.total?.toString() || '0',
            icon: <Users size={16} />,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Actifs',
            value: statsData.active?.toString() || '0',
            icon: <CheckCircle2 size={16} />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'En Attente',
            value: statsData.pending?.toString() || '0',
            icon: <Clock size={16} />,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
    ];

    // Remove client-side filtering since we now search server-side
    const filteredCandidates = candidates;

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) {
            try {
                await api.delete(`/candidates/${id}`);
                setCandidates(prev => prev.filter(c => c.id !== id));
                // Update stats locally
                setStatsData(prev => ({ ...prev, total: prev.total - 1 }));
            } catch (err) {
                console.error("Error deleting candidate:", err);
                alert("Erreur lors de la suppression.");
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* ... alert ... */}
            {pendingCount > 0 && (
                <div className="mb-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Nouvelles catégorisations à valider</p>
                            <p className="text-xs text-slate-500">{pendingCount} intitulé(s) de poste inconnu(s) nécessitent votre attention.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/categorizations')}
                        className="px-4 py-2 bg-white text-orange-600 border border-orange-100 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors"
                    >
                        Gérer maintenant
                    </button>
                </div>
            )}

            {/* Action Bar avec Recherche */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div className="w-full md:flex-1 md:max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un candidat, un poste..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => navigate('/admin/add-candidate')}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-orange-600/10 transition-all active:scale-95 whitespace-nowrap"
                >
                    <UserPlus size={16} />
                    Ajouter Candidat
                </button>
            </div>

            {/* KPI Cards (Smaller) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 transition-all hover:shadow-md">
                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-slate-500 text-[11px] font-medium leading-none mb-1">{stat.label}</p>
                            <h3 className="text-lg font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ... table header ... */}
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nom complet</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Poste souhaité</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {candidates.length > 0 ? (
                                candidates.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px] group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                                    {c.first_name?.[0]}{c.last_name?.[0]}
                                                </div>
                                                <span className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors text-sm">
                                                    {c.first_name} {c.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-slate-500 italic">
                                            {c.position_searched}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                                                {c.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-slate-50 text-slate-500'
                                                }`}>
                                                <span className={`w-1 h-1 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                {c.status === 'ACTIVE' ? 'Actif' : c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/candidates/${c.id}`)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Voir détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Aucun candidat trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination.current_page < pagination.last_page && (
                    <div className="p-4 bg-slate-50/20 text-center border-t border-slate-50">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-widest disabled:opacity-50"
                        >
                            {loadingMore ? 'Chargement...' : 'Charger plus de candidats'}
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
