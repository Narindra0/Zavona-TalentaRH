import { useState, useEffect } from 'react';
import {
    Users,
    Building2,
    Mail,
    Phone,
    ExternalLink,
    Loader2,
    Search,
    Filter,
    Download,
    Eye
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const TalentOffers = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPagination(prev => ({ ...prev, current_page: 1 }));
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const fetchInterests = async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/recruiter-interests', {
                    params: {
                        page: pagination.current_page,
                        search: debouncedSearch || undefined,
                        status: filterStatus !== 'ALL' ? filterStatus : undefined
                    }
                });
                const { data, last_page, current_page, total } = response.data;
                setInterests(data);
                setPagination({ current_page, last_page, total });
            } catch (err) {
                console.error("Error fetching interests:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, [pagination.current_page, debouncedSearch, filterStatus]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPagination(prev => ({ ...prev, current_page: newPage }));
        }
    };

    // Server-side filtering now handles this
    const filteredInterests = interests;

    const handleStatusChange = async (interestId, newStatus) => {
        try {
            await api.patch(`/admin/recruiter-interests/${interestId}/status`, { status: newStatus });
            // Optimistic update
            setInterests(prev => prev.map(i => i.id === interestId ? { ...i, status: newStatus } : i));
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Erreur lors de la mise à jour du statut.");
        }
    };

    const exportToCSV = () => {
        const headers = ["Talent", "Entreprise", "Nom Recruteur", "Email Recruteur", "Téléphone Recruteur", "Date"];
        const rows = filteredInterests.map(i => [
            `${i.candidate?.first_name} ${i.candidate?.last_name}`,
            i.company_name,
            i.recruiter_name || 'N/A',
            i.email,
            i.phone || 'N/A',
            i.created_at.substring(0, 10)
        ]);

        const content = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "interets_recruteurs.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Statistics Wrap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Total Intérêts</p>
                            <h3 className="text-2xl font-bold text-slate-900">{pagination.total}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Entreprises</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {new Set(interests.map(i => i.company_name)).size}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Nouveaux (7j)</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {interests.filter(i => new Date(i.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-1 gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher une entreprise ou un talent..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">Tous les statuts</option>
                            <option value="PENDING">En attente</option>
                            <option value="CONTACTED">Contacté</option>
                        </select>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <Download size={18} />
                        Exporter CSV
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Talent</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recruteur</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <Loader2 className="animate-spin text-orange-500 mx-auto" size={32} />
                                        </td>
                                    </tr>
                                ) : filteredInterests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                                            Aucun intérêt trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInterests.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {item.candidate?.first_name} {item.candidate?.last_name}
                                                    </span>
                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                        <span className="text-[10px] font-bold text-orange-500 uppercase">
                                                            {item.candidate?.position_searched}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                                                <Mail size={10} /> {item.candidate?.email}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                                                <Phone size={10} /> {item.candidate?.phone}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 size={14} className="text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-700">{item.company_name}</span>
                                                    </div>
                                                    {item.recruiter_name && (
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                            Par : {item.recruiter_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                                                            {item.email}
                                                        </span>
                                                        {item.phone && (
                                                            <span className="text-xs text-slate-400 font-medium">
                                                                {item.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <a href={`mailto:${item.email}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Emailer le recruteur">
                                                            <Mail size={14} />
                                                        </a>
                                                        {item.phone && (
                                                            <a href={`tel:${item.phone}`} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Appeler le recruteur">
                                                                <Phone size={14} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-slate-500 text-nowrap">
                                                {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border outline-none focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer ${item.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100 focus:ring-amber-500' :
                                                        item.status === 'CONTACTED' ? 'bg-blue-50 text-blue-600 border-blue-100 focus:ring-blue-500' :
                                                            item.status === 'HIRED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 focus:ring-emerald-500' :
                                                                'bg-rose-50 text-rose-600 border-rose-100 focus:ring-rose-500'
                                                        }`}
                                                >
                                                    <option value="PENDING">En attente</option>
                                                    <option value="CONTACTED">Contacté</option>
                                                    <option value="HIRED">Placé</option>
                                                    <option value="REJECTED">Refusé</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/admin/candidates/${item.candidate_id}`}
                                                    className="inline-flex items-center gap-2 p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                    title="Voir le talent"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-50 rounded-b-3xl shadow-sm">
                        <p className="text-xs text-slate-500 font-medium">
                            Affichage de {interests.length} sur {pagination.total} intérêts
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-orange-600 disabled:opacity-50 transition-colors"
                            >
                                Précédent
                            </button>
                            <span className="text-xs font-bold text-slate-900">
                                Page {pagination.current_page} sur {pagination.last_page}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-orange-600 disabled:opacity-50 transition-colors"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default TalentOffers;
