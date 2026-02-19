import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    ShieldCheck,
    Cpu,
    Zap,
    Activity,
    ArrowRight,
    Stethoscope,
    Brain
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="home-container">
            {/* --- Hero Section --- */}
            <section className="hero-section">
                <div className="container hero-grid">
                    <motion.div
                        className="hero-text"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        <motion.div className="hero-badge" variants={fadeIn}>
                            <span className="pulse-dot"></span>
                            AI-Powered Diagnostics 2.0
                        </motion.div>

                        <motion.h1 className="hero-title" variants={fadeIn}>
                            Understand Your Health with <br />
                            <span className="text-gradient">Precision AI</span>
                        </motion.h1>

                        <motion.p className="hero-description" variants={fadeIn}>
                            Advanced symptom analysis powered by LLaMA-3.
                            Get instant, medical-grade insights and potential diagnoses in seconds.
                            Private. Secure. Reliable.
                        </motion.p>

                        <motion.div className="hero-buttons" variants={fadeIn}>
                            <Link to="/register" className="btn btn-primary btn-xl">
                                Start Free Analysis <ArrowRight size={20} />
                            </Link>
                            <button
                                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                className="btn btn-ghost btn-xl"
                            >
                                How it works
                            </button>
                        </motion.div>

                        <motion.div className="hero-trust" variants={fadeIn}>
                            <div className="avatars">
                                <span className="avatar">👨‍⚕️</span>
                                <span className="avatar">👩‍⚕️</span>
                                <span className="avatar">🩺</span>
                            </div>
                            <p>Trusted by 10,000+ users worldwide</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="glass-mockup">
                            <div className="mockup-header">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                            </div>
                            <div className="mockup-content">
                                <div className="mockup-row">
                                    <Activity size={20} className="text-brand-primary" />
                                    <div className="mockup-line w-75"></div>
                                </div>
                                <div className="mockup-row">
                                    <Brain size={20} className="text-brand-secondary" />
                                    <div className="mockup-line w-50"></div>
                                </div>
                                <div className="mockup-card">
                                    <div className="mockup-badge">Please consult a doctor</div>
                                    <div className="mockup-text">Potential Condition: Migraine</div>
                                    <div className="mockup-progress"></div>
                                </div>
                            </div>
                            <div className="floating-badge badge-1">
                                <Zap size={16} /> Instant Result
                            </div>
                            <div className="floating-badge badge-2">
                                <ShieldCheck size={16} /> 100% Private
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Stats Section --- */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h3 className="stat-number">98%</h3>
                            <p className="stat-label">Accuracy Rate</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3 className="stat-number">50k+</h3>
                            <p className="stat-label">Analyses Run</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3 className="stat-number">24/7</h3>
                            <p className="stat-label">Availability</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- How It Works --- */}
            <section id="how-it-works" className="how-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">How Genova Works</h2>
                        <p className="section-subtitle">Medical insights in 3 simple steps</p>
                    </div>

                    <div className="steps-grid">
                        <motion.div
                            className="step-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="step-icon">1</div>
                            <h3>Describe Symptoms</h3>
                            <p>Enter your symptoms in plain natural language. Our AI understands context and nuances.</p>
                        </motion.div>
                        <motion.div
                            className="step-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="step-icon">2</div>
                            <h3>AI Analysis</h3>
                            <p>Our LLaMA-3 model processes your input against a vast medical database instantly.</p>
                        </motion.div>
                        <motion.div
                            className="step-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="step-icon">3</div>
                            <h3>Get Insights</h3>
                            <p>Receive a detailed report with potential conditions and recommended next steps.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Why Choose Genova?</h2>
                    </div>

                    <div className="features-grid-large">
                        <div className="feature-box">
                            <div className="icon-box blue"><Cpu size={24} /></div>
                            <h3>Advanced AI Engine</h3>
                            <p>Built on the latest LLM technology for superior language understanding and medical reasoning.</p>
                        </div>
                        <div className="feature-box">
                            <div className="icon-box green"><ShieldCheck size={24} /></div>
                            <h3>Bank-Grade Privacy</h3>
                            <p>Your health data is encrypted end-to-end. We never sell your personal information.</p>
                        </div>
                        <div className="feature-box">
                            <div className="icon-box purple"><Stethoscope size={24} /></div>
                            <h3>Doctor Designed</h3>
                            <p>Developed with inputs from medical professionals to ensure clinical relevance.</p>
                        </div>
                        <div className="feature-box">
                            <div className="icon-box rose"><Activity size={24} /></div>
                            <h3>Real-time Monitoring</h3>
                            <p>Track your health history over time and spot patterns in your symptoms.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Testimonials --- */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">Trusted by Users</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                            <p>"It helped me understand my symptoms before seeing a doctor. Highly recommended!"</p>
                            <div className="user-info">
                                <div className="avatar-circle">SJ</div>
                                <div>
                                    <h4>Sarah Jenkins</h4>
                                    <span>Verified User</span>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                            <p>"Incredible accuracy. The interface is so easy to use and looks amazing."</p>
                            <div className="user-info">
                                <div className="avatar-circle">MR</div>
                                <div>
                                    <h4>Michael Ross</h4>
                                    <span>Verified User</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Ready to prioritize your health?</h2>
                        <p>Join Genova AI today and get instant peace of mind.</p>
                        <Link to="/register" className="btn btn-white btn-xl">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="footer slide-up">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h2>Genova AI</h2>
                            <p>Advanced Health Analytics</p>
                        </div>
                        <div className="footer-links">
                            <h3>Product</h3>
                            <Link to="#">Features</Link>
                            <Link to="#">Pricing</Link>
                            <Link to="#">Security</Link>
                        </div>
                        <div className="footer-links">
                            <h3>Company</h3>
                            <Link to="#">About</Link>
                            <Link to="#">Blog</Link>
                            <Link to="#">Contact</Link>
                        </div>
                        <div className="footer-links">
                            <h3>Legal</h3>
                            <Link to="#">Privacy</Link>
                            <Link to="#">Terms</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 Genova AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
