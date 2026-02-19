import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://genova-ai-backend-gulq.vercel.app/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/me'),
};

// Analysis API
export const analysisAPI = {
    analyzeSymptoms: (symptoms) => api.post('/analysis', { symptoms }),
    getAnalysisById: (id) => api.get(`/analysis/${id}`),
};

// History API
export const historyAPI = {
    getHistory: (params) => api.get('/history', { params }),
    getStats: () => api.get('/history/stats'),
    deleteAnalysis: (id) => api.delete(`/history/${id}`),
};

// Chat API
export const chatAPI = {
    sendMessage: (message, history) => api.post('/chat', { message, history }),
};

export default api;
