import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        setLoading(true);
        try {
            await axiosInstance.post('users/reset-password-confirm/', {
                token,
                new_password: password
            });
            alert('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center align-items-center min-vh-75">
            <div className="col-md-5">
                <div className="card glass-card p-4 p-lg-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold fs-1 gradient-text mb-2">New Password</h2>
                        <p className="text-muted">Set a strong password to protect your account.</p>
                    </div>

                    {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" placeholder="Min. 8 characters" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" placeholder="Repeat new password" className="form-control" onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="premium-btn w-100 fs-5" disabled={loading}>
                            {loading ? 'Updating password...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
