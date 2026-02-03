import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.password !== formData.password_confirm) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.post('users/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password_confirm: formData.password_confirm
            });
            setSuccess(res.data.message);
        } catch (err) {
            setError(JSON.stringify(err.response?.data) || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center align-items-center min-vh-75 py-5">
            <div className="col-md-6">
                <div className="card glass-card p-4 p-lg-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold fs-1 gradient-text mb-2">Join RAG-AI</h2>
                        <p className="text-muted">Create an account to build your custom AI agents.</p>
                    </div>

                    {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}
                    {success && <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Username</label>
                                <input type="text" name="username" className="form-control" placeholder="johndoe" onChange={handleChange} required />
                            </div>
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Email Address</label>
                                <input type="email" name="email" className="form-control" placeholder="john@example.com" onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" className="form-control" placeholder="••••••••" onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" name="password_confirm" className="form-control" placeholder="••••••••" onChange={handleChange} required />
                            </div>
                        </div>
                        <button type="submit" className="premium-btn w-100 mb-4 fs-5" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="text-center">
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" className="text-primary text-decoration-none fw-500">Sign in instead</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
