import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically inject JWT Bearer Token if logged in
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const userInfoStr = localStorage.getItem('userInfo');
            if (userInfoStr) {
                try {
                    const userInfo = JSON.parse(userInfoStr);
                    if (userInfo && userInfo.token) {
                        config.headers.Authorization = `Bearer ${userInfo.token}`;
                    }
                } catch (e) {
                    // ignore parsing error
                }
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export const handleApiError = (err: any): string => {
    return err.response?.data?.message || err.message || 'An unexpected error occurred';
};

export default api;
