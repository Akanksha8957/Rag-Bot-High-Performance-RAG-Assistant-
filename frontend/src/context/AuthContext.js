import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const res = await axiosInstance.get('users/dashboard/');
                    setUser(res.data.user);
                } catch (err) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post('users/login/', { email, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        // Get user details
        const userRes = await axiosInstance.get('users/dashboard/');
        setUser(userRes.data.user);
        return res;
    };

    const logout = async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            await axiosInstance.post('users/logout/', { refresh_token });
        } catch (err) {
            console.error('Logout failed on server', err);
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
