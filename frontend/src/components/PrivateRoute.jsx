import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('user_token'); // Vérifie le token [cite: 90]
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;