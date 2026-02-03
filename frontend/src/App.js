import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RAGDashboard from './pages/RAGDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<div className="container"><Login /></div>} />
          <Route path="/register" element={<div className="container"><Register /></div>} />
          <Route path="/verify-email" element={<div className="container"><VerifyEmail /></div>} />
          <Route path="/forgot-password" element={<div className="container"><ForgotPassword /></div>} />
          <Route path="/reset-password" element={<div className="container"><ResetPassword /></div>} />
          <Route
            path="/rag-bot"
            element={
              <ProtectedRoute>
                <RAGDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/rag-bot" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
