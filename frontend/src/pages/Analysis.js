import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI } from '../services/api';
import {
    Activity,
    Send,
    AlertTriangle,
    Stethoscope,
    ClipboardList,
    CheckCircle2
} from 'lucide-react';
import './Analysis.css';

const Analysis = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchAnalysis = async () => {
                setLoading(true);
                try {
                    const response = await analysisAPI.getAnalysisById(id);
                    const data = response.data.data;
                    setSymptoms(data.userInput || data.symptoms || '');
                    setResult(data.aiResponse);
                } catch (err) {
                    setError('Failed to load analysis details');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAnalysis();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await analysisAPI.analyzeSymptoms(symptoms);
            setResult(response.data.data.aiResponse);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to analyze symptoms');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const resultVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="analysis-container container">
            <motion.div
                className="analysis-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex justify-center mb-4">
                    <div className="icon-wrapper-large">
                        <Activity size={48} color="var(--brand-primary)" />
                    </div>
                </div>
                <h1 className="analysis-title">New Health Analysis</h1>
                <p className="analysis-subtitle">
                    Describe your symptoms in detail for an AI-powered assessment.
                </p>
            </motion.div>

            <div className="analysis-content max-w-3xl mx-auto">
                <motion.form
                    onSubmit={handleSubmit}
                    className="symptom-form"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <textarea
                        className="textarea w-full"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Ex: I've had a headache for 3 days, accompanied by nausea and sensitivity to light..."
                        disabled={loading}
                        rows="6"
                    />

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-muted text-sm">
                            {symptoms.length} characters
                        </span>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !symptoms.trim()}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="spinner-sm"></div> Analyzing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Analyze Symptoms <Send size={18} />
                                </span>
                            )}
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            className="alert alert-danger mt-4 flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <AlertTriangle size={18} /> {error}
                        </motion.div>
                    )}
                </motion.form>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            className="results-section"
                            variants={resultVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {result.emergency_flag && (
                                <div className="emergency-alert mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 flex items-start gap-4">
                                    <AlertTriangle size={24} className="shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-lg">Potential Emergency Detected</h3>
                                        <p>Based on your symptoms, we recommend seeking immediate medical attention.</p>
                                    </div>
                                </div>
                            )}

                            <div className="result-card p-6 bg-surface rounded-2xl shadow-sm border border-light mb-6">
                                <h3 className="result-title">
                                    <ClipboardList size={24} className="text-brand-primary" />
                                    Analysis Summary
                                </h3>
                                <p className="text-main leading-relaxed">
                                    {result.analysis_summary}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="result-card p-6 bg-surface rounded-2xl shadow-sm border border-light">
                                    <h3 className="result-title mb-4">
                                        <Activity size={24} className="text-brand-secondary" />
                                        Potential Conditions
                                    </h3>
                                    <div className="conditions-list space-y-4">
                                        {result.possible_conditions.map((condition, index) => (
                                            <div key={index} className="condition-item">
                                                <div className="condition-header">
                                                    <span className="condition-name">{condition.condition}</span>
                                                    <span className={`badge badge-${(condition.risk_level || 'medium').toLowerCase()}`}>
                                                        {condition.risk_level || 'Medium'}
                                                    </span>
                                                </div>
                                                <p className="condition-reason">{condition.reason || condition.reasoning}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="result-card p-6 bg-surface rounded-2xl shadow-sm border border-light">
                                        <h3 className="result-title mb-4">
                                            <Stethoscope size={24} className="text-brand-accent" />
                                            Recommended Specialist
                                        </h3>
                                        <div className="p-4 bg-blue-50 text-brand-primary font-bold rounded-xl text-center">
                                            {result.recommended_specialist}
                                        </div>
                                    </div>

                                    <div className="result-card p-6 bg-surface rounded-2xl shadow-sm border border-light">
                                        <h3 className="result-title mb-4">
                                            <ClipboardList size={24} className="text-brand-emerald" />
                                            Suggested Tests
                                        </h3>
                                        <ul className="tests-list">
                                            {result.suggested_tests.map((test, index) => (
                                                <li key={index} className="flex items-center gap-3">
                                                    <CheckCircle2 size={16} className="text-brand-emerald shrink-0" />
                                                    <span>{test}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-secondary px-8"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Analysis;
