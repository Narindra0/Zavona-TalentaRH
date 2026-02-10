import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const storedAuth = localStorage.getItem('isAuthenticated');

            if (!storedAuth) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Verify token with backend
                await api.get('/user'); // Assuming Laravel provides a /user endpoint or we use a lightweight auth check
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
