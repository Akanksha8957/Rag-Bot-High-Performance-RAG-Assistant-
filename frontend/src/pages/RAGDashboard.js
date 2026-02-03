import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/rag`
    : 'http://localhost:8000/api/rag';

const RAGDashboard = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchDocuments();
        fetchSessions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getHeaders = () => {
        const token = localStorage.getItem('access_token');
        return {
            Authorization: `Bearer ${token}`
        };
    };

    const fetchDocuments = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/documents/`, { headers: getHeaders() });
            setDocuments(res.data);
        } catch (err) {
            console.error("Error fetching documents", err);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/sessions/`, { headers: getHeaders() });
            setSessions(res.data);
        } catch (err) {
            console.error("Error fetching sessions", err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        setUploading(true);
        try {
            await axios.post(`${API_BASE_URL}/documents/`, formData, {
                headers: {
                    ...getHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchDocuments();
        } catch (err) {
            console.error("Error uploading document", err);
            alert("Upload failed. Make sure your backend processes are running.");
        } finally {
            setUploading(false);
        }
    };

    const deleteDocument = async (id) => {
        if (!window.confirm("Delete this document? This will remove its knowledge from the RAG bot.")) return;
        try {
            await axios.delete(`${API_BASE_URL}/documents/${id}/`, { headers: getHeaders() });
            fetchDocuments();
        } catch (err) {
            console.error("Error deleting document", err);
        }
    };

    const deleteSession = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this chat session?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/sessions/${id}/`, { headers: getHeaders() });
            if (currentSessionId === id) {
                startNewChat();
            }
            fetchSessions();
        } catch (err) {
            console.error("Error deleting session", err);
        }
    };

    const loadSession = async (sessionId) => {
        setCurrentSessionId(sessionId);
        setLoadingChat(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/history/${sessionId}/`, { headers: getHeaders() });
            setMessages(res.data);
        } catch (err) {
            console.error("Error loading chat history", err);
        } finally {
            setLoadingChat(false);
        }
    };

    const askQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userMsg = { role: 'user', content: question, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        const q = question;
        setQuestion('');
        setLoadingChat(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/ask/`, {
                question: q,
                session_id: currentSessionId
            }, { headers: getHeaders() });

            if (!currentSessionId) {
                setCurrentSessionId(res.data.session_id);
                fetchSessions();
            }

            const botMsg = { role: 'bot', content: res.data.answer, timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error("Error asking question", err);
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I encountered an error processing your request. Please check if your documents are uploaded and your API credits are sufficient." }]);
        } finally {
            setLoadingChat(false);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
    };

    return (
        <div className="container-fluid p-0 d-flex overflow-hidden" style={{ height: 'calc(100vh - 84px)', background: 'var(--bg-dark)' }}>
            {/* Sidebar Overlay for Mobile could be added here */}

            {/* Sidebar */}
            <div className="sidebar-container bg-opacity-25 border-end border-secondary border-opacity-10 d-flex flex-column"
                style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)', backgroundColor: 'var(--bg-sidebar)' }}>

                <div className="p-4 flex-grow-1 overflow-auto">
                    <button onClick={startNewChat} className="premium-btn w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-2 fs-6 glow">
                        <i className="bi bi-plus-lg text-white"></i> New Chat
                    </button>

                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                            <small className="text-white text-uppercase fw-bold letter-spacing-1 opacity-75" style={{ fontSize: '0.7rem' }}>Recent Conversations</small>
                        </div>
                        <div className="d-flex flex-column gap-2">
                            {sessions.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => loadSession(s.id)}
                                    className={`p-3 rounded-4 cursor-pointer d-flex justify-content-between align-items-center transition-all animate-slide-in ${currentSessionId === s.id ? 'bg-primary bg-opacity-10 border border-primary border-opacity-40 text-white shadow-sm' : 'text-white hover-bg-glass opacity-70'}`}
                                    style={{ border: '1px solid transparent' }}
                                >
                                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                                        <i className={`bi ${currentSessionId === s.id ? 'bi-chat-fill text-primary' : 'bi-chat'} small`}></i>
                                        <div className="text-truncate small fw-bold">{s.title}</div>
                                    </div>
                                    <button onClick={(e) => deleteSession(e, s.id)} className="btn btn-link text-danger p-0 border-0 opacity-0 hover-opacity-100 delete-btn transition-all">
                                        <i className="bi bi-trash3 small"></i>
                                    </button>
                                </div>
                            ))}
                            {sessions.length === 0 && <div className="text-center py-4 text-white-50 small italic">No chats yet</div>}
                        </div>
                    </div>

                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                            <small className="text-white text-uppercase fw-bold letter-spacing-1 opacity-75" style={{ fontSize: '0.7rem' }}>Knowledge Base</small>
                            <label className="btn btn-link p-0 text-primary text-decoration-none small fw-bold">
                                {uploading ? <span className="spinner-border spinner-border-sm text-primary"></span> : <i className="bi bi-cloud-arrow-up-fill fs-5 text-primary"></i>}
                                <input type="file" hidden onChange={handleFileUpload} disabled={uploading} />
                            </label>
                        </div>

                        <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '200px' }}>
                            {documents.map(doc => (
                                <div key={doc.id} className="d-flex justify-content-between align-items-center p-2 px-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 animate-slide-in shadow-sm">
                                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                                        <i className="bi bi-file-earmark-pdf-fill text-info small"></i>
                                        <div className="text-truncate small fw-bold" style={{ maxWidth: '140px', color: '#80D8FF' }}>{doc.name}</div>
                                    </div>
                                    <button onClick={() => deleteDocument(doc.id)} className="btn btn-link text-danger p-0 border-0 opacity-80 hover-opacity-100 transition-all">
                                        <i className="bi bi-trash3 small"></i>
                                    </button>
                                </div>
                            ))}
                            {documents.length === 0 && <div className="text-center py-4 text-white-50 small italic bg-white bg-opacity-5 rounded-4 border border-dashed border-secondary border-opacity-25">Knowledge base empty</div>}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-top border-secondary border-opacity-10">
                    <div className="d-flex align-items-center gap-3 p-2">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center glow" style={{ width: '36px', height: '36px' }}>
                            <span className="fw-bold fs-6 text-white text-uppercase">{user?.username?.[0] || 'U'}</span>
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-white small fw-bold text-truncate">{user?.username}</div>
                            <div className="text-white opacity-70" style={{ fontSize: '0.65rem' }}>Active Member</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-grow-1 d-flex flex-column h-100 position-relative shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="p-3 border-bottom border-secondary border-opacity-10 bg-dark bg-opacity-60 d-flex justify-content-between align-items-center px-4 backdrop-blur shadow-sm">
                    <div>
                        <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
                            {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : 'Intelligence Engine'}
                            <span className="badge bg-primary bg-opacity-20 text-white fw-bold rounded-pill border border-primary border-opacity-40" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
                        </h6>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2 text-white opacity-75 small">
                            <i className="bi bi-cpu text-primary fs-6"></i>
                            <span className="fw-bold">GPT-3.5-Turbo</span>
                        </div>
                        <div className="vr h-100 mx-1 opacity-25 bg-white"></div>
                        <button className="btn btn-link text-white-50 p-0 hover-text-white transition-all"><i className="bi bi-gear fs-5"></i></button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-5 custom-scrollbar" style={{ backgroundColor: 'rgba(7, 9, 14, 0.6)' }}>
                    {messages.length === 0 && (
                        <div className="m-auto text-center animate-fade-in" style={{ maxWidth: '600px' }}>
                            <div className="mb-4 d-inline-block">
                                <div className="bg-primary bg-opacity-20 p-4 rounded-circle glow-primary mb-3 d-inline-flex border border-primary border-opacity-20">
                                    <i className="bi bi-robot fs-1 gradient-text"></i>
                                </div>
                            </div>
                            <h1 className="fw-bold mb-3 display-6 text-white">Advanced <span className="gradient-text">RAG Assistant</span></h1>
                            <p className="text-white opacity-90 mb-5 lead fs-6 px-lg-5">Experience the future of document intelligence. Upload your PDFs and start a high-fidelity contextual conversation.</p>

                            <div className="row g-4 text-start">
                                <div className="col-md-6">
                                    <div className="glass-card p-4 h-100 border-opacity-30 hover-translate-up transition-all bg-dark bg-opacity-40 shadow-lg">
                                        <h6 className="fw-bold text-white mb-2">Secured Context</h6>
                                        <p className="text-white opacity-75 small mb-0 lh-base">Answers are strictly derived from your personal knowledge base.</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="glass-card p-4 h-100 border-opacity-30 hover-translate-up transition-all bg-dark bg-opacity-40 shadow-lg">
                                        <h6 className="fw-bold text-white mb-2">Vector Search</h6>
                                        <p className="text-white opacity-75 small mb-0 lh-base">Powered by FAISS vector store for lightning-fast semantic retrieval.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="max-width-900 mx-auto w-100 py-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex mb-5 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start animate-fade-in'}`}>
                                <div className={`d-flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`} style={{ maxWidth: '85%' }}>
                                    <div className={`flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle shadow-sm ${msg.role === 'user' ? 'bg-primary glow' : 'bg-dark border border-secondary border-opacity-30'}`} style={{ width: '40px', height: '40px' }}>
                                        {msg.role === 'user' ?
                                            <i className="bi bi-person text-white fs-5"></i> :
                                            <i className="bi bi-robot text-primary fs-5"></i>
                                        }
                                    </div>
                                    <div className={`p-4 rounded-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'glass-card border-opacity-20 bg-dark bg-opacity-40 shadow-lg'}`}>
                                        <div className="d-flex justify-content-between mb-2 align-items-center">
                                            <span className={`fw-bold small letter-spacing-1 ${msg.role === 'user' ? 'text-white text-opacity-75' : 'text-primary'}`}>
                                                {msg.role === 'user' ? 'WORKSPACE USER' : 'INTELLIGENCE UNIT'}
                                            </span>
                                            <span className="text-white text-opacity-50 ms-4" style={{ fontSize: '0.65rem' }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="fs-6 lh-lg text-white" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loadingChat && (
                        <div className="max-width-900 mx-auto w-100 d-flex justify-content-start animate-pulse">
                            <div className="d-flex gap-3">
                                <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-dark border border-secondary border-opacity-30 shadow-sm" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-robot text-primary fs-5"></i>
                                </div>
                                <div className="glass-card p-3 rounded-4 border-opacity-20 bg-white bg-opacity-5">
                                    <div className="d-flex gap-1 align-items-center">
                                        <div className="dot-blink bg-primary"></div>
                                        <div className="dot-blink bg-primary" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="dot-blink bg-primary" style={{ animationDelay: '0.4s' }}></div>
                                        <span className="ms-2 text-white text-opacity-75 small italic fw-bold">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-dark bg-opacity-40 backdrop-blur border-top border-secondary border-opacity-10">
                    <form onSubmit={askQuestion} className="max-width-900 mx-auto position-relative">
                        <div className="position-relative">
                            <textarea
                                className="form-control bg-black bg-opacity-50 border-secondary border-opacity-25 text-white rounded-4 px-4 py-3 pe-5 custom-textarea shadow-lg"
                                style={{ minHeight: '60px', maxHeight: '200px', resize: 'none' }}
                                placeholder="Message RAG Bot..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        askQuestion(e);
                                    }
                                }}
                                disabled={loadingChat}
                            />
                            <button type="submit" className="premium-btn position-absolute glow p-0 d-flex align-items-center justify-content-center"
                                style={{ bottom: '10px', right: '10px', height: '40px', width: '40px', borderRadius: '12px' }}
                                disabled={loadingChat || !question.trim()}>
                                <i className="bi bi-arrow-up-short fs-3"></i>
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-white text-opacity-50 mb-0 opacity-75" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                <i className="bi bi-info-circle me-1"></i>
                                AI can make mistakes. Check important info. Using <strong>FAISS Semantic Store</strong>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .sidebar-container .session-item:hover .delete-btn { opacity: 1; }
                .hover-bg-glass:hover { background: rgba(255, 255, 255, 0.08); }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .letter-spacing-1 { letter-spacing: 1px; }
                .max-width-900 { max-width: 900px; }
                .hover-translate-up:hover { transform: translateY(-5px); }
                .backdrop-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                .fs-6 { font-size: 0.95rem !important; }
                .custom-textarea::-webkit-scrollbar { width: 4px; }
                .dot-blink { width: 6px; height: 6px; border-radius: 50%; animation: dotBlink 1.4s infinite; }
                @keyframes dotBlink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
                .session-item:hover { transform: translateX(5px); }
                .delete-btn:hover { color: #ff4d4d !important; }
            `}</style>

            {/* Import Bootstrap Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </div>
    );
};

export default RAGDashboard;
