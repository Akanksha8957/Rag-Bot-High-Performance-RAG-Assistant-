import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top mb-5">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3 gradient-text" to="/">
                    RAG-AI
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/rag-bot">RAG Bot</Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <button className="premium-btn py-2 px-4 fs-6" onClick={handleLogout}>
                                        Logout ({user.username})
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/login">Login</Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <Link className="premium-btn py-2 px-4 text-decoration-none d-inline-block" to="/register">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
