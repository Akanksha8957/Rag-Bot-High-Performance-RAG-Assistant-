import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/rag-bot');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center align-items-center min-vh-75">
            <div className="col-md-5">
                <div className="card glass-card p-4 p-lg-5 animate-fade-in">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold fs-1 gradient-text mb-2">Welcome Back</h2>
                        <p className="text-muted">Enter your credentials to access your AI workspace.</p>
                    </div>

                    {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <label className="form-label">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-decoration-none text-primary small">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="premium-btn w-100 mb-4 fs-5" disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center">
                        <span className="text-muted">New to RAG-AI? </span>
                        <Link to="/register" className="text-primary text-decoration-none fw-500">Create account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
