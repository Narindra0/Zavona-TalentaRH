import { useState, useEffect } from 'react';
import { Upload, User, Mail, Phone, Briefcase, FileText, CheckCircle, Loader2 } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import api from '../api/axios';

const ApplyPage = () => {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        contract_type: 'CDI',
        position_searched: '',
        experience_level: 'junior',
        description: '',
        category_id: '',
        sub_category_id: ''
    });

    const [isCategorizing, setIsCategorizing] = useState(false);
    const [suggestion, setSuggestion] = useState(null);

    const [cvFile, setCvFile] = useState(null);

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
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            setCvFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!cvFile) {
            setError("Le téléchargement de votre CV est obligatoire.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        data.append('cv_file', cvFile);

        try {
            await api.post('/candidates', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitted(true);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                contract_type: 'CDI',
                position_searched: '',
                experience_level: 'junior',
                description: ''
            });
            setFileName(null);
            setCvFile(null);
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Erreur lors de l\'envoi:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi de votre candidature.');
        } finally {
            setLoading(false);
        }
    };

    // Job Categorization Logic
    useEffect(() => {
        if (!formData.position_searched) {
            setSuggestion(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsCategorizing(true);
            try {
                const response = await api.get(`/categorize-job?title=${encodeURIComponent(formData.position_searched)}`);
                const result = response.data;

                if (result.category_id && result.sub_category_id) {
                    setFormData(prev => ({
                        ...prev,
                        category_id: result.category_id,
                        sub_category_id: result.sub_category_id
                    }));
                    setSuggestion({
                        category: result.is_suggested ? result.suggested_category : result.category_name,
                        subCategory: result.is_suggested ? result.suggested_subcategory : result.sub_category_name
                    });
                } else {
                    setSuggestion(null);
                }
            } catch (err) {
                console.error("Error categorizing job:", err);
            } finally {
                setIsCategorizing(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [formData.position_searched]);

    return (
        <PublicLayout>
            <div className="min-h-screen bg-slate-50 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Rejoignez l'<span className="text-orange-500">Excellence</span>
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Remplissez le formulaire ci-dessous et téléchargez votre CV (obligatoire) pour que notre équipe puisse examiner votre profil.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left Column: Form */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 md:p-10 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <User className="text-orange-500" /> Informations Personnelles
                            </h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm italic font-bold">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nom</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="Ex: Rakoto"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Prénom</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="Ex: Jean"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="jean.rakoto@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="034 00 000 00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Type de contrat</label>
                                        <select
                                            name="contract_type"
                                            value={formData.contract_type}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
                                        >
                                            <option value="CDI">CDI</option>
                                            <option value="CDD">CDD</option>
                                            <option value="Stage">Stage</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Expérience</label>
                                        <select
                                            name="experience_level"
                                            value={formData.experience_level}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
                                        >
                                            <option value="débutant">Débutant</option>
                                            <option value="junior">Junior</option>
                                            <option value="intermédiaire">Intermédiaire</option>
                                            <option value="senior">Senior</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Poste recherché</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="position_searched"
                                            value={formData.position_searched}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="Ex: Développeur Web"
                                            required
                                        />
                                        {isCategorizing && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
                                                <Loader2 className="animate-spin" size={18} />
                                            </div>
                                        )}
                                    </div>
                                    {suggestion && (
                                        <p className="mt-2 text-xs text-slate-500 italic">
                                            Catégorie suggérée : <span className="font-bold text-orange-600">{suggestion.category}</span> {">"} <span className="font-bold">{suggestion.subCategory}</span>
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 ${submitted ? 'bg-green-500 shadow-green-200' :
                                        loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Envoi en cours...
                                        </>
                                    ) : submitted ? (
                                        <>
                                            <CheckCircle size={20} /> Candidature Envoyée !
                                        </>
                                    ) : (
                                        "Envoyer ma candidature"
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Drag & Drop */}
                        <div className="flex flex-col gap-8">
                            <div
                                className={`relative group border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-300 min-h-[400px] flex flex-col items-center justify-center bg-white shadow-xl shadow-slate-200/40
                                    ${dragActive ? 'border-orange-500 bg-orange-50/50 scale-[1.02]' :
                                        (!fileName && error) ? 'border-red-300 bg-red-50/10 hover:bg-red-50/20' :
                                            'border-slate-200 hover:border-orange-400 hover:bg-slate-50/50'}
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
                                <label
                                    htmlFor="cv-upload"
                                    className="cursor-pointer flex flex-col items-center gap-6"
                                >
                                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 ${(!fileName && error) ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-600'}`}>
                                        <Upload size={40} />
                                    </div>
                                    <div>
                                        <p className={`text-xl font-black mb-2 ${(!fileName && error) ? 'text-red-600' : 'text-slate-900'}`}>
                                            {fileName ? "CV sélectionné !" : "Déposez votre CV ici (Obligatoire)"}
                                        </p>
                                        <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                                            {fileName ? fileName : "ou cliquez pour parcourir vos fichiers (PDF, Word)"}
                                        </p>
                                    </div>
                                </label>

                                {fileName && (
                                    <div className="absolute top-6 right-6">
                                        <div className="bg-green-100 text-green-600 p-2 rounded-full">
                                            <CheckCircle size={20} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <FileText size={20} /> Pourquoi nous ?
                                    </h3>
                                    <p className="text-orange-100 text-sm leading-relaxed">
                                        Chez ZANOVA, nous valorisons chaque talent. Votre CV sera analysé par nos experts pour vous proposer les meilleures opportunités.
                                    </p>
                                </div>
                                <div className="absolute -right-8 -bottom-8 opacity-10">
                                    <Briefcase size={120} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ApplyPage;
