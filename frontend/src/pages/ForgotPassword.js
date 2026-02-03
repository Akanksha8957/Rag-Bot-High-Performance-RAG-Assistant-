import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await axiosInstance.post('users/forgot-password/', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center align-items-center min-vh-75">
            <div className="col-md-5">
                <div className="card glass-card p-4 p-lg-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold fs-1 gradient-text mb-2">Reset Password</h2>
                        <p className="text-muted">Enter your email and we'll send you instructions to reset your password.</p>
                    </div>

                    {message && <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success">{message}</div>}
                    {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="premium-btn w-100 mb-4 fs-5" disabled={loading}>
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <div className="text-center">
                        <Link to="/login" className="text-primary text-decoration-none fw-500">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
