import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

const CvDropzone = ({
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange,
    fileName,
    error
}) => {
    return (
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
    );
};

export default CvDropzone;
