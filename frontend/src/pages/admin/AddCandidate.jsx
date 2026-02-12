import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    Briefcase,
    FileText,
    Upload,
    CheckCircle,
    Loader2,
    ArrowLeft,
    Save,
    X,
    Plus
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../api/axios';
import axios from 'axios';
import CreatableSelect from '../../components/CreatableSelect';

const AddCandidate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [lastAutoCategorizedValue, setLastAutoCategorizedValue] = useState('');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position_searched: '',
        category_id: '',
        sub_category_id: '',
        contract_type: 'CDI',
        experience_level: 'junior',
        description: '',
        status: 'ACTIVE'
    });

    const [cvFile, setCvFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [allAvailableSkills, setAllAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Fetch categories and skills
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, skillRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/skills')
                ]);
                setCategories(catRes.data.map(cat => ({ value: cat.id, label: cat.name })));
                setAllAvailableSkills(skillRes.data.map(s => ({ value: s.id, label: s.name })));
            } catch (err) {
                console.error("Error fetching initial data:", err);
            }
        };
        fetchData();
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

    // Job Categorization Logic
    useEffect(() => {
        if (!formData.position_searched || formData.position_searched === lastAutoCategorizedValue) return;

        const timer = setTimeout(async () => {
            setIsCategorizing(true);
            try {
                const response = await api.get(`/categorize-job?title=${encodeURIComponent(formData.position_searched)}`);
                const result = response.data;

                if (result.category_id && result.sub_category_id) {
                    // Only auto-update if category/subcategory aren't manually set to something else
                    // or if it's the first time we're categorizing this input
                    const currentCatId = formData.category_id;
                    const currentSubCatId = formData.sub_category_id;

                    if (!currentCatId || currentCatId == result.category_id) {
                        setSelectedCategory({ value: result.category_id, label: result.category_name });
                        setFormData(prev => ({ ...prev, category_id: result.category_id }));

                        // Small delay to ensure subcategories are fetched before selecting
                        setTimeout(() => {
                            setSelectedSubCategory({ value: result.sub_category_id, label: result.sub_category_name });
                            setFormData(prev => ({ ...prev, sub_category_id: result.sub_category_id }));
                        }, 500);
                    }
                }
                setLastAutoCategorizedValue(formData.position_searched);
            } catch (err) {
                console.error("Error categorizing job:", err);
            } finally {
                setIsCategorizing(false);
            }
        }, 1000); // 1s debounce

        return () => clearTimeout(timer);
    }, [formData.position_searched, categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            setCvFile(file);
            if (file.type === 'application/pdf') {
                parseCV(file);
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            setCvFile(file);
            if (file.type === 'application/pdf') {
                parseCV(file);
            }
        }
    };

    const parseCV = async (file) => {
        setIsParsing(true);
        setError(null);
        const data = new FormData();
        data.append('cv_file', file);

        try {
            const response = await api.post('/parse-cv', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const result = response.data;
            if (result.error) {
                console.error("Parsing error:", result.error);
                return;
            }

            // Update form data with extracted info
            setFormData(prev => ({
                ...prev,
                first_name: result.first_name || prev.first_name,
                last_name: result.last_name || prev.last_name,
                email: result.email || prev.email,
                phone: result.phone || prev.phone,
                position_searched: result.position || prev.position_searched
            }));

            // Handle skills
            if (result.skills && Array.isArray(result.skills)) {
                const newSkills = result.skills.map(s => {
                    // Check if skill already exists in available skills to use its ID
                    const existing = allAvailableSkills.find(as => as.label.toLowerCase() === s.label.toLowerCase());
                    return existing ? existing : { value: s.label, label: s.label, isNew: true };
                });

                // Merge with existing selected skills, avoiding duplicates
                setSelectedSkills(prev => {
                    const combined = [...prev];
                    newSkills.forEach(ns => {
                        if (!combined.find(cs => cs.label.toLowerCase() === ns.label.toLowerCase())) {
                            combined.push(ns);
                        }
                    });
                    return combined;
                });
            }

        } catch (err) {
            console.error("Error parsing CV:", err);
            // Non-blocking error, user can still fill manually
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Ensure CSRF token
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

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'category_id') data.append(key, categoryId || '');
                else if (key === 'sub_category_id') data.append(key, subCategoryId || '');
                else data.append(key, formData[key]);
            });

            skillIds.forEach(id => data.append('skills[]', id));

            if (cvFile) {
                data.append('cv_file', cvFile);
            }

            await api.post('/candidates', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(true);
            setTimeout(() => navigate('/admin'), 2000);
        } catch (err) {
            console.error('Erreur lors de la création du candidat:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
                    >
                        <ArrowLeft size={18} /> Retour au tableau de bord
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Ajouter un nouveau candidat</h1>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm italic font-bold">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2">
                        <CheckCircle size={20} /> Candidat créé avec succès ! Redirection...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Columns: Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User size={18} className="text-orange-500" /> Informations Personnelles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prénom</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Briefcase size={18} className="text-orange-500" /> Informations Professionnelles
                            </h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Poste recherché</label>
                                    <input
                                        type="text"
                                        name="position_searched"
                                        value={formData.position_searched}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="Ex: Développeur Fullstack"
                                        required
                                    />
                                    {isCategorizing && (
                                        <div className="absolute right-3 top-[34px]">
                                            <Loader2 className="animate-spin text-orange-500" size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Catégorie</label>
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
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sous-catégorie</label>
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
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type de Contrat</label>
                                        <select
                                            name="contract_type"
                                            value={formData.contract_type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                        >
                                            <option value="CDI">CDI</option>
                                            <option value="CDD">CDD</option>
                                            <option value="Stage">Stage</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expérience</label>
                                        <select
                                            name="experience_level"
                                            value={formData.experience_level}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                        >
                                            <option value="débutant">Débutant</option>
                                            <option value="junior">Junior</option>
                                            <option value="intermédiaire">Intermédiaire</option>
                                            <option value="senior">Senior</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Skills */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText size={18} className="text-orange-500" /> Description / Bio
                                </h3>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                    placeholder="Courte présentation du candidat..."
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-50">
                                <h3 className="font-bold text-slate-900 mb-4">Compétences</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold border border-orange-100"
                                        >
                                            {skill.label}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSkills(prev => prev.filter((_, i) => i !== idx))}
                                                className="hover:text-orange-900"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="max-w-md">
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
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Upload & Actions */}
                    <div className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 bg-white shadow-sm
                                ${dragActive ? 'border-orange-500 bg-orange-50/50 scale-[1.02]' : 'border-slate-200 hover:border-orange-400'}
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="cv-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                            <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center relative">
                                    {isParsing ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <Upload size={24} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {isParsing ? "Analyse en cours..." : (fileName ? "CV sélectionné" : "Télécharger le CV")}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[150px]">
                                        {fileName || "PDF (Analyse auto)"}
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Statut Initial</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white font-bold"
                                >
                                    <option value="ACTIVE" className="text-emerald-600">Actif</option>
                                    <option value="PENDING" className="text-amber-600">En attente</option>
                                    <option value="ARCHIVED" className="text-slate-500">Archivé</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || success}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {loading ? "Création..." : "Enregistrer le candidat"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddCandidate;
