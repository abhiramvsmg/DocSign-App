const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,

    // Documents
    DOCUMENTS: `${API_BASE_URL}/api/docs`,
    UPLOAD: `${API_BASE_URL}/api/docs/upload`,

    // Public
    PUBLIC_SIGN: (token: string) => `${API_BASE_URL}/api/docs/public/${token}`,
};

export default API_BASE_URL;
