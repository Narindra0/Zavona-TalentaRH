import { Briefcase, GraduationCap } from 'lucide-react';

const CandidateCard = ({ candidate, onViewProfile }) => {
    // Mapping des couleurs pour les contrats
    const contractStyles = {
        'CDI': 'border-emerald-100 text-emerald-600 bg-emerald-50/50',
        'CDD': 'border-blue-100 text-blue-600 bg-blue-50/50',
        'STAGE': 'border-purple-100 text-purple-600 bg-purple-50/50'
    };

    const style = contractStyles[candidate.contract_type] || 'border-slate-100 text-slate-600 bg-slate-50/50';

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {candidate.first_name} {candidate.last_name}
                    </h4>
                    <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mt-0.5">
                        {candidate.position_searched}
                    </p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${style}`}>
                    {candidate.contract_type}
                </span>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
                        <Briefcase size={14} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-medium">{candidate.experience_level} d'expérience</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
                        <GraduationCap size={14} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-medium leading-tight">
                        {candidate.category} - {candidate.sub_category}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {candidate.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-bold border border-slate-100/50"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <button
                onClick={() => onViewProfile(candidate.id)}
                className="block w-full text-center py-3 bg-slate-50 text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98]"
            >
                Consulter le profil
            </button>
        </div>
    );
};

export default CandidateCard;


