import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';
import {
    Activity,
    AlertTriangle,
    Clock,
    LayoutDashboard,
    Plus,
    Trash2,
    Calendar,
    ChevronRight
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyData, statsData] = await Promise.all([
                    historyAPI.getHistory({ page: 1, limit: 6 }), // updated params structure based on API
                    historyAPI.getStats()
                ]);
                setHistory(historyData.data.data.analyses); // API structure: response.data.data.analyses
                setStats(statsData.data.data); // API structure: response.data.data
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this analysis?')) {
            try {
                await historyAPI.deleteAnalysis(id);
                setHistory(history.filter(item => item._id !== id));
                // Update stats locally
                if (stats) {
                    setStats(prev => ({
                        ...prev,
                        totalAnalyses: prev.totalAnalyses - 1
                    }));
                }
            } catch (err) {
                alert('Failed to delete analysis');
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 60 }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="dashboard-container container"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="dashboard-header">
                <div>
                    <motion.h1 className="dashboard-title" variants={itemVariants}>
                        Welcome back, {user?.name.split(' ')[0]}
                    </motion.h1>
                    <motion.p className="dashboard-subtitle" variants={itemVariants}>
                        Here's an overview of your health analysis history.
                    </motion.p>
                </div>
                <motion.div variants={itemVariants}>
                    <Link to="/analysis" className="btn btn-primary">
                        <Plus size={20} /> New Analysis
                    </Link>
                </motion.div>
            </div>

            {stats && (
                <motion.div className="stats-grid" variants={containerVariants}>
                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon icon-blue">
                            <Activity size={32} />
                        </div>
                        <div>
                            <div className="stat-value">{stats.totalAnalyses}</div>
                            <div className="stat-label">Total Analyses</div>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon icon-rose">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <div className="stat-value">{stats.emergencyCount}</div>
                            <div className="stat-label">Emergency Flags</div>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon icon-emerald">
                            <Clock size={32} />
                        </div>
                        <div>
                            <div className="stat-value">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="stat-label">Last Login</div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <motion.div className="history-section" variants={containerVariants}>
                <div className="section-header">
                    <h2 className="section-title">Recent Activity</h2>
                    {history.length > 0 && (
                        <Link to="/history" className="auth-link flex items-center gap-2">
                            View All <ChevronRight size={16} />
                        </Link>
                    )}
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {history.length === 0 ? (
                    <motion.div className="empty-state" variants={itemVariants}>
                        <LayoutDashboard className="empty-icon" size={64} />
                        <h3>No analyses yet</h3>
                        <p>Start your first health analysis to get insights.</p>
                        <Link to="/analysis" className="btn btn-primary mt-4">
                            Start Analysis
                        </Link>
                    </motion.div>
                ) : (
                    <div className="history-grid">
                        {history.map((item) => (
                            <motion.div
                                key={item._id}
                                className="history-card"
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="history-date flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                    {item.aiResponse.emergency_flag && (
                                        <span className="emergency-badge">
                                            <AlertTriangle size={12} /> Emergency
                                        </span>
                                    )}
                                </div>

                                <p className="history-summary">
                                    {item.aiResponse.analysis_summary}
                                </p>

                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-light">
                                    <Link to={`/analysis/${item._id}`} className="btn-secondary btn-sm rounded-full">
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn-icon text-rose hover:bg-rose-50"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
