import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL || ''; // Empty defaults to current origin (localhost:5173 with proxy)
const baseURL = apiURL.endsWith('/api') ? apiURL : `${apiURL}/api`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Required for Sanctum CSRF
});

// Helper for Sanctum CSRF
export const getCsrfToken = () => {
    // With proxy, we just hit /sanctum/csrf-cookie relative to current origin
    return axios.get('/sanctum/csrf-cookie', { baseURL: apiURL || '/' });
};

export default api;
