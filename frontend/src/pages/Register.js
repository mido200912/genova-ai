import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    UserPlus,
    User,
    Mail,
    Lock,
    Calendar,
    Users,
    ArrowRight,
    AlertTriangle
} from 'lucide-react';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender || undefined,
        };

        console.log('Sending registration data:', userData);

        const result = await register(userData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-header">
                    <div className="flex justify-center mb-4">
                        <div className="icon-wrapper bg-blue-50 text-brand-primary p-3 rounded-full inline-flex">
                            <UserPlus size={32} />
                        </div>
                    </div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join Genova AI today</p>
                </div>

                {error && (
                    <motion.div
                        className="alert alert-danger flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <AlertTriangle size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="name">Full Name *</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input has-icon"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address *</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input has-icon"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                            <label className="input-label" htmlFor="age">Age</label>
                            <div className="input-wrapper">
                                <Calendar className="input-icon" size={18} />
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    className="input has-icon"
                                    placeholder="25"
                                    min="1"
                                    max="150"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="gender">Gender</label>
                            <div className="input-wrapper">
                                <Users className="input-icon" size={18} />
                                <select
                                    id="gender"
                                    name="gender"
                                    className="input has-icon"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password *</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input has-icon"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="confirmPassword">Confirm Password *</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="input has-icon"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <div className="spinner-sm"></div> Creating account...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">
                                Create Account <ArrowRight size={18} />
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
