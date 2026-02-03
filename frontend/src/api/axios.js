import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/` : 'http://localhost:8000/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest.url === 'users/token/refresh/') {
            // If refresh token fails, logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('users/token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('access_token', response.data.access);
                    axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed', refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
