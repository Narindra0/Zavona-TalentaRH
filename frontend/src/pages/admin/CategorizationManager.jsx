import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';
import {
    Tags,
    List,
    Clock,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Loader2,
    Search,
    Save,
    AlertCircle,
    ChevronRight
} from 'lucide-react';


const CategorizationManager = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pending, setPending] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [processing, setProcessing] = useState(null);

    // Editing states
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubCategory, setNewSubCategory] = useState({ name: '', category_id: '', keywords: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [managerRes, pendingRes] = await Promise.all([
                api.get('/admin/categories/manager'),
                api.get('/pending-categories')
            ]);
            setCategories(managerRes.data.categories);
            setPendingCount(managerRes.data.pending_count);
            setPending(pendingRes.data);
        } catch (err) {
            showNotification('Erreur lors du chargement des données', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- Category Actions ---
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await api.post('/categories', { name: newCategoryName });
            setCategories([...categories, { ...res.data.data, sub_categories: [] }]);
            setNewCategoryName('');
            showNotification('Catégorie ajoutée');
        } catch (err) {
            showNotification('Erreur lors de l\'ajout', 'error');
        }
    };

    const handleUpdateCategory = async (id) => {
        try {
            await api.put(`/categories/${id}`, { name: editValue });
            setCategories(categories.map(cat => cat.id === id ? { ...cat, name: editValue } : cat));
            setEditingId(null);
            showNotification('Catégorie mise à jour');
        } catch (err) {
            showNotification('Erreur de mise à jour', 'error');
        }
    };

    const handleDeleteCategory = async (id) => {
        const cat = categories.find(c => c.id === id);
        if (cat.sub_categories.length > 0) {
            alert("Impossible de supprimer une catégorie contenant des sous-catégories.");
            return;
        }
        if (!window.confirm("Supprimer cette catégorie ?")) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
            showNotification('Catégorie supprimée');
        } catch (err) {
            showNotification('Erreur de suppression', 'error');
        }
    };

    // --- SubCategory Actions ---
    const handleAddSubCategory = async () => {
        if (!newSubCategory.name || !newSubCategory.category_id) return;
        try {
            const keywordsArray = newSubCategory.keywords
                ? newSubCategory.keywords.split(',').map(k => k.trim()).filter(k => k)
                : [];

            const res = await api.post('/sub-categories', {
                ...newSubCategory,
                keywords: keywordsArray
            });

            setCategories(categories.map(cat =>
                cat.id === parseInt(newSubCategory.category_id)
                    ? { ...cat, sub_categories: [...cat.sub_categories, res.data.data] }
                    : cat
            ));

            setNewSubCategory({ name: '', category_id: '', keywords: '' });
            showNotification('Sous-catégorie ajoutée');
        } catch (err) {
            showNotification('Erreur lors de l\'ajout', 'error');
        }
    };

    const handleUpdateSubCategory = async (subCatId, catId, field, value) => {
        try {
            const updateData = { [field]: value };
            if (field === 'keywords') {
                updateData.keywords = value.split(',').map(k => k.trim()).filter(k => k);
            }

            await api.put(`/sub-categories/${subCatId}`, updateData);

            setCategories(categories.map(cat => {
                if (cat.id === catId) {
                    return {
                        ...cat,
                        sub_categories: cat.sub_categories.map(sc =>
                            sc.id === subCatId ? { ...sc, ...updateData } : sc
                        )
                    };
                }
                return cat;
            }));
            setEditingId(null);
            showNotification('Sous-catégorie mise à jour');
        } catch (err) {
            showNotification('Erreur de mise à jour', 'error');
        }
    };

    const handleDeleteSubCategory = async (subCatId, catId) => {
        if (!window.confirm("Supprimer cette sous-catégorie ?")) return;
        try {
            await api.delete(`/sub-categories/${subCatId}`);
            setCategories(categories.map(cat =>
                cat.id === catId
                    ? { ...cat, sub_categories: cat.sub_categories.filter(sc => sc.id !== subCatId) }
                    : cat
            ));
            showNotification('Sous-catégorie supprimée');
        } catch (err) {
            showNotification('Erreur de suppression', 'error');
        }
    };

    // --- Pending Actions ---
    const handleApprovePending = async (item) => {
        setProcessing(item.id);
        try {
            await api.post(`/pending-categories/${item.id}/approve`, {
                category_name: item.suggested_category,
                subcategory_name: item.suggested_subcategory
            });
            setPending(pending.filter(p => p.id !== item.id));
            setPendingCount(prev => prev - 1);
            showNotification('Suggestions approuvées');
            // Refresh to see the new category/subcategory
            fetchData();
        } catch (err) {
            showNotification('Erreur lors de l\'approbation', 'error');
        } finally {
            setProcessing(null);
        }
    };

    const handleRejectPending = async (id) => {
        if (!window.confirm("Rejeter cette suggestion ?")) return;
        setProcessing(id);
        try {
            await api.post(`/pending-categories/${id}/reject`);
            setPending(pending.filter(p => p.id !== id));
            setPendingCount(prev => prev - 1);
            showNotification('Suggestion rejetée');
        } catch (err) {
            showNotification('Erreur', 'error');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={48} />
                </div>
            </AdminLayout>
        );
    }

    const allSubCategories = categories.flatMap(cat =>
        cat.sub_categories.map(sc => ({ ...sc, category_name: cat.name }))
    ).filter(sc =>
        sc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto py-8">
                {notification && (
                    <div className={`fixed top-24 right-8 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                        {notification.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manager de Catégories</h1>
                    <p className="text-slate-500 font-medium">Configurez l'intelligence de votre système de tri des talents.</p>
                </div>

                {/* Navigation par Onglets */}
                <div className="flex items-center gap-2 mb-8 bg-slate-100/50 p-1 rounded-2xl w-fit border border-slate-100">
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <List size={18} /> Catégories
                    </button>
                    <button
                        onClick={() => setActiveTab('subcategories')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'subcategories' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <Tags size={18} /> Sous-catégories
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <Clock size={18} /> En attente
                        {pendingCount > 0 && (
                            <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-black">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="animate-in fade-in duration-500">
                    {/* ONGLET CATEGORIES */}
                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Nouvelle catégorie</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Ex: Marketing & Communication"
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <button
                                        onClick={handleAddCategory}
                                        className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Ajouter
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map(cat => (
                                    <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                                        <div className="flex-1">
                                            {editingId === `cat-${cat.id}` ? (
                                                <input
                                                    autoFocus
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => handleUpdateCategory(cat.id)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory(cat.id)}
                                                    className="bg-slate-50 border-orange-500 border rounded px-2 py-1 text-sm font-bold w-full"
                                                />
                                            ) : (
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{cat.sub_categories.length} sous-catégories</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingId(`cat-${cat.id}`); setEditValue(cat.name); }}
                                                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ONGLET SOUS-CATEGORIES */}
                    {activeTab === 'subcategories' && (
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6">
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Ajouter une sous-catégorie</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nom</label>
                                        <input
                                            type="text"
                                            value={newSubCategory.name}
                                            onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                                            placeholder="Ex: Développeur React"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Catégorie Parente</label>
                                        <select
                                            value={newSubCategory.category_id}
                                            onChange={(e) => setNewSubCategory({ ...newSubCategory, category_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm bg-transparent"
                                        >
                                            <option value="">Sélectionner...</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Mots-clés (séparés par virgules)</label>
                                        <input
                                            type="text"
                                            value={newSubCategory.keywords}
                                            onChange={(e) => setNewSubCategory({ ...newSubCategory, keywords: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                                            placeholder="Ex: react, web, frontend"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddSubCategory}
                                    className="bg-slate-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                >
                                    Créer la sous-catégorie
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une sous-catégorie ou catégorie..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sous-catégorie</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Catégorie</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Intelligence (Mots-clés)</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {allSubCategories.map(sub => (
                                                <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        {editingId === `subname-${sub.id}` ? (
                                                            <input
                                                                autoFocus
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onBlur={() => handleUpdateSubCategory(sub.id, sub.category_id, 'name', editValue)}
                                                                onKeyPress={(e) => e.key === 'Enter' && handleUpdateSubCategory(sub.id, sub.category_id, 'name', editValue)}
                                                                className="bg-white border-orange-500 border rounded px-2 py-1 text-sm font-bold w-full"
                                                            />
                                                        ) : (
                                                            <span
                                                                className="text-sm font-bold text-slate-900 cursor-pointer hover:text-orange-600 transition-colors"
                                                                onClick={() => { setEditingId(`subname-${sub.id}`); setEditValue(sub.name); }}
                                                            >
                                                                {sub.name}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                                                            {sub.category_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {editingId === `subkeys-${sub.id}` ? (
                                                            <input
                                                                autoFocus
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onBlur={() => handleUpdateSubCategory(sub.id, sub.category_id, 'keywords', editValue)}
                                                                onKeyPress={(e) => e.key === 'Enter' && handleUpdateSubCategory(sub.id, sub.category_id, 'keywords', editValue)}
                                                                className="bg-white border-orange-500 border rounded px-2 py-1 text-sm font-medium w-full"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="flex flex-wrap gap-1 cursor-pointer min-h-[1.5rem]"
                                                                onClick={() => { setEditingId(`subkeys-${sub.id}`); setEditValue(sub.keywords?.join(', ') || ''); }}
                                                            >
                                                                {sub.keywords?.length > 0 ? (
                                                                    sub.keywords.map((k, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">
                                                                            {k}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-slate-300 text-[10px] italic">Aucun mot-clé</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteSubCategory(sub.id, sub.category_id)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET EN ATTENTE */}
                    {activeTab === 'pending' && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            {pending.length === 0 ? (
                                <div className="p-20 text-center">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Tout est classé</h3>
                                    <p className="text-slate-500">Aucune suggestion en attente pour le moment.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Intitulé Original</th>
                                                <th className="px-4 py-4 text-center"></th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Suggestion Proposée</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Validation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {pending.map(item => (
                                                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900">{item.original_title}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                                            <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <ChevronRight className="text-slate-300 mx-auto" size={16} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded font-bold uppercase">{item.suggested_category}</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-700">{item.suggested_subcategory}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApprovePending(item)}
                                                                disabled={processing === item.id}
                                                                className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                {processing === item.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                                                                Approuver
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectPending(item.id)}
                                                                className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                                                disabled={processing === item.id}
                                                            >
                                                                Rejeter
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategorizationManager;
