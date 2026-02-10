import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
import logoImg from '../assets/Logo-ZTRH.png';
import api, { getCsrfToken } from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Initialiser la protection CSRF
            await getCsrfToken();

            // 2. Tenter la connexion
            const response = await api.post('/login', { email, password });

            // 3. Succès
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/admin');
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || 'Identifiants incorrects ou erreur serveur');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-slate-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12">
                <div className="text-center mb-8">
                    <img
                        src={logoImg}
                        alt="ZANOVA Logo"
                        className="h-16 w-auto object-contain mx-auto mb-6"
                    />
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                        Espace Administration
                    </h1>
                    <p className="text-slate-500">
                        Connectez-vous pour accéder au tableau de bord
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                                placeholder="admin@zrth.com"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-standard"
                                required
                            />
                        </div>
                    </div>

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
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-standard"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:bg-orange-300 transition-standard shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Connexion...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Identifiants de test : <span className="font-semibold">admin@zrth.com</span> / <span className="font-semibold">password123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
