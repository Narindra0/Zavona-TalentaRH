import { Link } from 'react-router-dom';
import logoImg from '../assets/Logo-ZTRH.png';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src={logoImg}
                        alt="ZANOVA Logo"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link to="/#offers" className="hover:text-orange-500 transition-standard">Nos Services</Link>
                    <Link to="/#about" className="hover:text-orange-500 transition-standard">À propos</Link>
                    <Link to="/#contact" className="hover:text-orange-500 transition-standard">Contact</Link>
                </div>

                <Link
                    to="/postuler"
                    className="group relative bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition-standard shadow-lg shadow-slate-200 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Postuler
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
