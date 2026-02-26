import React from 'react';
import { User, Mail, Phone, Briefcase, CheckCircle, Loader2, DollarSign } from 'lucide-react';

const ApplyForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    loading,
    submitted,
    isCategorizing,
    suggestion,
    error
}) => {
    return (
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
                            <option value="Prestataire">Prestataire</option>
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

                {/* Section tarification pour les prestataires */}
                {formData.contract_type === 'Prestataire' && (
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <DollarSign className="text-orange-500" /> Tarification
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Type de tarif</label>
                                <select
                                    name="rate_type"
                                    value={formData.rate_type || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="daily">Tarif journalier</option>
                                    <option value="weekly">Tarif hebdomadaire</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Montant (Ar)</label>
                                <input
                                    type="number"
                                    name="rate_amount"
                                    value={formData.rate_amount || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="Ex: 50000"
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        {formData.rate_type && formData.rate_amount && (
                            <p className="mt-3 text-sm text-orange-600 font-medium">
                                Tarif : {formData.rate_type === 'daily' ? 'Journalier' : 'Hebdomadaire'} - {new Intl.NumberFormat('fr-MG').format(parseFloat(formData.rate_amount) || 0)} Ar
                            </p>
                        )}
                    </div>
                )}

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
    );
};

export default ApplyForm;
