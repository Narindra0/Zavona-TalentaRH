import { useState, useEffect } from 'react';
import { Briefcase, FileText } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import api from '../api/axios';
import ApplyForm from '../components/Apply/ApplyForm';
import CvDropzone from '../components/Apply/CvDropzone';

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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
            setFormData({
                first_name: '', last_name: '', email: '', phone: '',
                contract_type: 'CDI', position_searched: '', experience_level: 'junior',
                description: '', category_id: '', sub_category_id: ''
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
                        <ApplyForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            submitted={submitted}
                            isCategorizing={isCategorizing}
                            suggestion={suggestion}
                            error={error}
                        />

                        <div className="flex flex-col gap-8">
                            <CvDropzone
                                dragActive={dragActive}
                                handleDrag={handleDrag}
                                handleDrop={handleDrop}
                                handleFileChange={handleFileChange}
                                fileName={fileName}
                                error={error}
                            />

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
