import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import {
    Activity,
    LogOut,
    User,
    LayoutDashboard,
    Menu,
    X,
    MessageCircle,
    BookOpen
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const isCurrent = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-brand">
                    <div className="brand-icon">
                        <Activity size={24} color="#fff" />
                    </div>
                    <span>Genova AI</span>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-desktop">
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isCurrent('/dashboard') ? 'active' : ''}`}>
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <Link to="/chat" className={`nav-link ${isCurrent('/chat') ? 'active' : ''}`}>
                                <MessageCircle size={18} /> AI Chat
                            </Link>
                            <Link to="/diseases" className={`nav-link ${isCurrent('/diseases') ? 'active' : ''}`}>
                                <Activity size={18} /> Diseases
                            </Link>
                            <Link to="/articles" className={`nav-link ${isCurrent('/articles') ? 'active' : ''}`}>
                                <BookOpen size={18} /> Articles
                            </Link>
                            <div className="user-menu">
                                <span className="user-greeting">
                                    <User size={16} /> {user.name.split(' ')[0]}
                                </span>
                                <button onClick={handleLogout} className="btn-icon" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-ghost">Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </div>
                    )}


                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Link>
                                    <Link to="/chat" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <MessageCircle size={18} /> AI Chat
                                    </Link>
                                    <Link to="/diseases" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <Activity size={18} /> Diseases
                                    </Link>
                                    <Link to="/articles" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <BookOpen size={18} /> Articles
                                    </Link>
                                    <button onClick={handleLogout} className="mobile-link text-rose">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="mobile-link highlight" onClick={() => setIsOpen(false)}>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
