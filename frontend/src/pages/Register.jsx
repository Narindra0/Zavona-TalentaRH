import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Loader2, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/Logo-ZTRH.png';
import api, { getCsrfToken } from '../api/axios';

const Register = () => {
    const [matricule, setMatricule] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Validation frontend
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Initialiser la protection CSRF
            await getCsrfToken();

            // 2. Tenter l'inscription
            const response = await api.post('/register', { 
                matricule, 
                email, 
                password 
            });

            // 3. Succès
            setSuccess('Compte créé avec succès! Redirection vers la page de connexion...');
            
            // Redirection automatique après 2 secondes
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Register error:", err);
            if (err.response?.status === 422) {
                // Erreurs de validation
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la création du compte');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8">
                <div className="text-center mb-6">
                    <img
                        src={logoImg}
                        alt="ZANOVA Logo"
                        className="h-12 w-auto object-contain mx-auto mb-0"
                    />
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                        Créer un compte
                    </h1>
                    <p className="text-sm text-slate-500">
                        Rejoignez l'espace d'administration
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-sm font-medium rounded-xl">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Matricule
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                                placeholder="MAT001"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-standard"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre.email@zrth.com"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-standard"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-standard"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirmation
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-standard"
                                required
                            />
                        </div>
                    </div>
                </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:bg-orange-300 transition-standard shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Création du compte...
                            </>
                        ) : (
                            'Créer un compte'
                        )}
                    </button>
                </form>

                {/* <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                            Se connecter
                        </Link>
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default Register;
