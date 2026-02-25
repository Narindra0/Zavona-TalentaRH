import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Mail,
    Phone,
    Download,
    FileText,
    CheckCircle2,
    MapPin,
    Calendar,
    Loader2,
    Trash2,
    Archive,
    CheckCircle,
    Edit2,
    X,
    Save,
    ArrowLeft,
    Eye,
    User,
    Star,
    Settings,
    AlertCircle
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';
import axios from 'axios';
import CreatableSelect from '../../components/CreatableSelect';
import PdfViewer from '../../components/PdfViewer';

const CandidateDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [talent, setTalent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [allAvailableSkills, setAllAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await api.get(`/candidates/${id}`);
                const data = response.data;
                const mappedTalent = {
                    ...data,
                    category: data.category?.name || 'N/A',
                    category_id: data.category_id,
                    sub_category: data.sub_category?.name || 'N/A',
                    sub_category_id: data.sub_category_id,
                    skills: data.skills?.map(s => s.name) || [],
                    skills_raw: data.skills || [], // Garder les objets pour l'édition
                    bio: data.description || "Aucune description disponible.",
                    cv_url: data.signed_cv_url || (data.cv_files?.[0]?.file_path ? `/storage/${data.cv_files[0].file_path}` : null)
                };
                setTalent(mappedTalent);
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    position_searched: data.position_searched || '',
                    category_id: data.category_id || '',
                    sub_category_id: data.sub_category_id || '',
                    contract_type: data.contract_type || 'CDI',
                    experience_level: data.experience_level || 'junior',
                    description: data.description || '',
                    status: data.status || 'PENDING'
                });
                setSelectedSkills(data.skills?.map(s => ({ value: s.id, label: s.name })) || []);
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

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data.map(cat => ({ value: cat.id, label: cat.name })));
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch all skills
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills');
                setAllAvailableSkills(response.data.map(s => ({ value: s.id, label: s.name })));
            } catch (err) {
                console.error("Error fetching skills:", err);
            }
        };
        fetchSkills();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubCategories = async () => {
            if (selectedCategory && !selectedCategory.isNew) {
                try {
                    const response = await api.get(`/categories/${selectedCategory.value}/sub-categories`);
                    setSubCategories(response.data.map(sub => ({ value: sub.id, label: sub.name })));
                } catch (err) {
                    console.error("Error fetching subcategories:", err);
                }
            } else {
                setSubCategories([]);
            }
        };
        fetchSubCategories();
    }, [selectedCategory]);

    // Set initial selected category/subcategory when talent loads
    useEffect(() => {
        if (talent && categories.length > 0) {
            const cat = categories.find(c => c.value === talent.category_id);
            setSelectedCategory(cat || null);
        }
    }, [talent, categories]);

    useEffect(() => {
        if (talent && subCategories.length > 0) {
            const sub = subCategories.find(s => s.value === talent.sub_category_id);
            setSelectedSubCategory(sub || null);
        }
    }, [talent, subCategories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Ensure CSRF token is set
            await axios.get('/sanctum/csrf-cookie', { baseURL: import.meta.env.VITE_API_URL || '/' });

            // Handle category creation if new
            let categoryId = formData.category_id;
            if (selectedCategory?.isNew) {
                const catResponse = await api.post('/categories/find-or-create', { name: selectedCategory.label });
                categoryId = catResponse.data.id;
            }

            // Handle subcategory creation if new
            let subCategoryId = formData.sub_category_id;
            if (selectedSubCategory?.isNew) {
                const subResponse = await api.post('/sub-categories/find-or-create', {
                    name: selectedSubCategory.label,
                    category_id: categoryId
                });
                subCategoryId = subResponse.data.id;
            }

            // Handle skills creation if new
            const skillIds = [];
            for (const skill of selectedSkills) {
                if (skill.isNew) {
                    const skillResponse = await api.post('/skills/find-or-create', { name: skill.label });
                    skillIds.push(skillResponse.data.id);
                } else {
                    skillIds.push(skill.value);
                }
            }

            // Update candidate with final IDs
            const updateData = {
                ...formData,
                category_id: categoryId,
                sub_category_id: subCategoryId,
                skills: skillIds
            };

            await api.put(`/candidates/${id}`, updateData);

            // Refresh data
            const response = await api.get(`/candidates/${id}`);
            const data = response.data;
            const mappedTalent = {
                ...data,
                category: data.category?.name || 'N/A',
                category_id: data.category_id,
                sub_category: data.sub_category?.name || 'N/A',
                sub_category_id: data.sub_category_id,
                skills: data.skills?.map(s => s.name) || [],
                bio: data.description || "Aucune description disponible.",
                cv_url: data.cv_files?.[0]?.file_path ? `/storage/${data.cv_files[0].file_path}` : null
            };
            setTalent(mappedTalent);
            setIsEditing(false);

            // Refresh categories list
            const catResponse = await api.get('/categories');
            setCategories(catResponse.data.map(cat => ({ value: cat.id, label: cat.name })));

            // Refresh available skills list
            const skillResponse = await api.get('/skills');
            setAllAvailableSkills(skillResponse.data.map(s => ({ value: s.id, label: s.name })));
            setSelectedSkills(data.skills?.map(s => ({ value: s.id, label: s.name })) || []);
        } catch (err) {
            console.error("Error saving candidate:", err);
            alert("Erreur lors de la sauvegarde des modifications.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form data
        setFormData({
            first_name: talent.first_name || '',
            last_name: talent.last_name || '',
            email: talent.email || '',
            phone: talent.phone || '',
            position_searched: talent.position_searched || '',
            category_id: talent.category_id || '',
            sub_category_id: talent.sub_category_id || '',
            contract_type: talent.contract_type || 'CDI',
            experience_level: talent.experience_level || 'junior',
            description: talent.description || '',
            status: talent.status || 'PENDING'
        });
        setSelectedSkills(talent.skills_raw?.map(s => ({ value: s.id, label: s.name })) || []);
        setIsEditing(false);
    };

    const handleStatusChange = async (newStatus) => {
        setStatusUpdating(true);
        try {
            await api.patch(`/candidates/${id}/update-status`, { status: newStatus });
            setTalent(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Erreur lors de la mise à jour du statut.");
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat définitivement ?")) {
            try {
                await api.delete(`/candidates/${id}`);
                navigate('/admin');
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
                    <Loader2 className="animate-spin text-orange-500" size={48} />
                </div>
            </AdminLayout>
        );
    }

    if (error || !talent) {
        return (
            <AdminLayout>
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || "Talent introuvable"}</h2>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-orange-600 font-bold hover:underline"
                    >
                        <ArrowLeft size={18} /> Retour au tableau de bord
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const statusConfig = {
        'PENDING': { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50', icon: Calendar },
        'ACTIVE': { label: 'Actif', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
        'HIRED': { label: 'Recruté', color: 'text-blue-600', bg: 'bg-blue-50', icon: Briefcase },
        'ARCHIVED': { label: 'Archivé', color: 'text-slate-500', bg: 'bg-slate-100', icon: Archive },
    };

    const currentStatus = statusConfig[talent.status] || statusConfig['PENDING'];

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto py-6">
                {/* Header Simplifié */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{talent.first_name} {talent.last_name}</h1>
                                <p className="text-orange-600 font-semibold">{talent.position_searched}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold ${currentStatus.bg} ${currentStatus.color}`}>
                                <currentStatus.icon size={16} />
                                {currentStatus.label}
                            </div>
                            
                            {/* Actions rapides */}
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                                            title="Modifier"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        
                                        {/* Actions selon le statut */}
                                        {talent.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleStatusChange('ACTIVE')}
                                                disabled={statusUpdating}
                                                className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-50"
                                                title="Activer"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        
                                        {talent.status === 'ACTIVE' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange('HIRED')}
                                                    disabled={statusUpdating}
                                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50"
                                                    title="Marquer comme recruté"
                                                >
                                                    <Briefcase size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange('ARCHIVED')}
                                                    disabled={statusUpdating}
                                                    className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
                                                    title="Archiver"
                                                >
                                                    <Archive size={18} />
                                                </button>
                                            </>
                                        )}
                                        
                                        {talent.status === 'HIRED' && (
                                            <button
                                                onClick={() => handleStatusChange('ARCHIVED')}
                                                disabled={statusUpdating}
                                                className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
                                                title="Archiver"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        )}
                                        
                                        {talent.status === 'ARCHIVED' && (
                                            <button
                                                onClick={() => handleStatusChange('ACTIVE')}
                                                disabled={statusUpdating}
                                                className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-50"
                                                title="Réactiver"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        
                                        {/* Bouton supprimer toujours visible */}
                                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            <X size={16} /> Annuler
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation par onglets */}
                <div className="bg-white rounded-2xl border border-slate-100 mb-6 shadow-sm">
                    <div className="flex border-b border-slate-100">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 px-6 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'overview' 
                                    ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <User size={16} className="inline mr-2" />
                            Aperçu
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 px-6 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'details' 
                                    ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Settings size={16} className="inline mr-2" />
                            Détails
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`flex-1 px-6 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'documents' 
                                    ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <FileText size={16} className="inline mr-2" />
                            Documents
                        </button>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="p-6">
                        {/* Onglet Aperçu */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Informations principales */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <User size={18} className="text-orange-500" />
                                            Informations Personnelles
                                        </h3>
                                        
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Prénom"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Nom"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Email"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Téléphone"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <Mail size={16} className="text-slate-400" />
                                                    <a href={`mailto:${talent.email}`} className="hover:text-orange-600 transition-colors">{talent.email || 'Non renseigné'}</a>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <Phone size={16} className="text-slate-400" />
                                                    <span>{talent.phone || 'Non renseigné'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <MapPin size={16} className="text-slate-400" />
                                                    <span>Madagascar</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <Briefcase size={18} className="text-orange-500" />
                                            Informations Professionnelles
                                        </h3>
                                        
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="position_searched"
                                                    value={formData.position_searched}
                                                    onChange={handleInputChange}
                                                    placeholder="Poste recherché"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                                <select
                                                    name="contract_type"
                                                    value={formData.contract_type}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                >
                                                    <option value="CDI">CDI</option>
                                                    <option value="CDD">CDD</option>
                                                    <option value="Stage">Stage</option>
                                                </select>
                                                <select
                                                    name="experience_level"
                                                    value={formData.experience_level}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                                >
                                                    <option value="débutant">Débutant</option>
                                                    <option value="junior">Junior</option>
                                                    <option value="intermédiaire">Intermédiaire</option>
                                                    <option value="senior">Senior</option>
                                                    <option value="expert">Expert</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Poste</p>
                                                    <p className="font-semibold text-slate-700">{talent.position_searched}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Contrat</p>
                                                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                                                        {talent.contract_type || 'Non spécifié'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Expérience</p>
                                                    <p className="font-semibold text-slate-700 capitalize">{talent.experience_level}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Description</h3>
                                    {isEditing ? (
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                            placeholder="Description du candidat..."
                                        />
                                    ) : (
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                            {talent.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Onglet Détails */}
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                {/* Catégories */}
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Catégories</h3>
                                    {isEditing ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Catégorie</label>
                                                <CreatableSelect
                                                    options={categories}
                                                    value={selectedCategory?.value}
                                                    onChange={(option) => {
                                                        setSelectedCategory(option);
                                                        setFormData(prev => ({ ...prev, category_id: option?.value || '' }));
                                                        setSelectedSubCategory(null);
                                                        setFormData(prev => ({ ...prev, sub_category_id: '' }));
                                                    }}
                                                    placeholder="Sélectionner ou créer..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sous-catégorie</label>
                                                <CreatableSelect
                                                    options={subCategories}
                                                    value={selectedSubCategory?.value}
                                                    onChange={(option) => {
                                                        setSelectedSubCategory(option);
                                                        setFormData(prev => ({ ...prev, sub_category_id: option?.value || '' }));
                                                    }}
                                                    placeholder="Sélectionner ou créer..."
                                                    disabled={!selectedCategory}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold">
                                                {talent.category}
                                            </span>
                                            <span className="text-slate-400">→</span>
                                            <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold">
                                                {talent.sub_category}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Compétences */}
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Compétences</h3>
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSkills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold"
                                                    >
                                                        {skill.label}
                                                        <button
                                                            onClick={() => setSelectedSkills(prev => prev.filter((_, i) => i !== idx))}
                                                            className="hover:text-orange-900"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <CreatableSelect
                                                options={allAvailableSkills.filter(s => !selectedSkills.some(ss => ss.value === s.value))}
                                                onChange={(option) => {
                                                    if (option && !selectedSkills.some(s => s.label === option.label)) {
                                                        setSelectedSkills(prev => [...prev, option]);
                                                    }
                                                }}
                                                placeholder="Ajouter une compétence..."
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {talent.skills.length > 0 ? (
                                                talent.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">Aucune compétence listée.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Onglet Documents */}
                        {activeTab === 'documents' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <FileText size={18} className="text-orange-500" />
                                    CV et Documents
                                </h3>
                                
                                {talent.cv_files && talent.cv_files.length > 0 ? (
                                    <div className="space-y-4">
                                        {talent.cv_files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">CV Document</p>
                                                        <p className="text-xs text-slate-400">{file.created_at?.substring(0, 10)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowPreview(!showPreview)}
                                                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                                                        title="Aperçu"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <a
                                                        href={`/storage/${file.file_path}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                                                        title="Télécharger"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                                        <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                                        <p className="text-sm text-slate-400">Aucun document disponible</p>
                                    </div>
                                )}

                                {showPreview && talent.cv_url && (
                                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <Eye size={18} className="text-orange-500" />
                                                Aperçu du CV
                                            </h3>
                                            <button
                                                onClick={() => setShowPreview(false)}
                                                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className="h-[600px]">
                                            <PdfViewer url={talent.cv_url} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CandidateDetail;
