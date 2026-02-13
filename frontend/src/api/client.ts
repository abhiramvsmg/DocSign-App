import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Standardized to loopback IP
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login if token is invalid/expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: Trigger a redirect or state change here
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
