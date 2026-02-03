import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const VerifyEmail = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            axiosInstance.get(`users/verify-email/?token=${token}`)
                .then(res => {
                    setStatus('success');
                    setMessage(res.data.message);
                })
                .catch(err => {
                    setStatus('error');
                    setMessage(err.response?.data?.error || 'Verification failed');
                });
        } else {
            setStatus('error');
            setMessage('No token provided');
        }
    }, [location]);

    return (
        <div className="row justify-content-center align-items-center min-vh-75 mt-5">
            <div className="col-md-6">
                <div className="card glass-card p-5 text-center">
                    {status === 'loading' && (
                        <div className="py-5">
                            <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <h3 className="fw-bold">Verifying your account...</h3>
                            <p className="text-muted">Just a moment while we secure your workspace.</p>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="py-4">
                            <div className="mb-4 text-success display-1">✓</div>
                            <h2 className="fw-bold fs-1 gradient-text mb-3">Verified!</h2>
                            <p className="text-muted mb-5">{message}</p>
                            <Link to="/login" className="premium-btn text-decoration-none px-5">Continue to Login</Link>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="py-4">
                            <div className="mb-4 text-danger display-1">✕</div>
                            <h2 className="fw-bold mb-3">Verification Failed</h2>
                            <p className="text-muted mb-5">{message}</p>
                            <Link to="/register" className="btn btn-outline-light px-5 rounded-3">Try Registering Again</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
