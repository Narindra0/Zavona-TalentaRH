import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Facebook, Globe, LogOut, User, Users, ChevronRight, Tags, BriefcaseBusiness, Mail, X, AlertTriangle } from 'lucide-react';
import logoImg from '../assets/Logo-ZTRH.png';
import api from '../api/axios';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = React.useState(0);
    const [user, setUser] = React.useState(null);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    React.useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await api.get('/pending-categories');
                setPendingCount(response.data.length);
            } catch (err) {
                console.error("Error fetching pending count:", err);
            }
        };
        fetchCount();
        // Refresh every 5 minutes
        const interval = setInterval(fetchCount, 300000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        {
            path: '/admin',
            label: 'Tableau de bord',
            Icon: LayoutDashboard
        },
        {
            path: '/admin/edit-site',
            label: 'Modifier le site',
            Icon: Globe
        },
        {
            path: '/admin/categorizations',
            label: 'Catégorisations',
            Icon: Tags,
            badge: pendingCount > 0 ? pendingCount : null
        },
        {
            path: '/admin/talent-offers',
            label: 'Talents avec offres',
            Icon: BriefcaseBusiness
        },
        {
            path: '/admin/email-config',
            label: 'Configuration emails',
            Icon: Mail
        },
    ];

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/login');
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const activeItem = menuItems.find(i => i.path === location.pathname);

    return (
        <div className="flex h-screen bg-[#FBFBFC] font-sans text-slate-900">
            {/* Sidebar Light Mode */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full shadow-sm z-20">
                <div className="p-6 flex justify-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src={logoImg}
                            alt="ZANOVA Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                </div>

                <nav className="flex-1 px-3 mt-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.Icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-sm ${isActive
                                    ? 'bg-orange-50 text-orange-600 font-bold shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                    }`}
                            >
                                <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                                    <Icon size={18} />
                                </div>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="flex justify-between items-center px-8 py-6 h-auto bg-[#FBFBFC]">
                    <div>
                        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                            <span className="hover:text-slate-600 cursor-pointer transition-colors">Admin</span>
                            <ChevronRight size={12} />
                            <span className="text-slate-500 font-medium">
                                {activeItem?.label || 'Dashboard'}
                            </span>
                        </nav>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {activeItem?.label === 'Tableau de bord' ? 'Gestion des Candidats' : activeItem?.label}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-default group">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs group-hover:bg-orange-200 transition-colors">
                            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800">{user?.name || 'Administrateur'}</span>
                            <span className="text-[9px] font-bold text-orange-600 uppercase">{user?.role || 'Super Admin'}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-8 pb-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Modal de confirmation de déconnexion */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={cancelLogout}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
                        {/* Icône d'avertissement */}
                        <div className="flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mx-auto mb-4">
                            <AlertTriangle className="text-rose-600" size={32} />
                        </div>

                        {/* Titre et message */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Confirmer la déconnexion
                            </h3>
                            <p className="text-slate-600 text-sm">
                                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à l'administration.
                            </p>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-3">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors"
                            >
                                Se déconnecter
                            </button>
                        </div>

                        {/* Bouton de fermeture (optionnel) */}
                        <button
                            onClick={cancelLogout}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
