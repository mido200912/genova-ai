import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { diseases } from '../data/healthData';
import { Search, X, MessageCircle, Activity, Dna } from 'lucide-react';
import './Library.css'; // Shared CSS for library pages

const Diseases = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDisease, setSelectedDisease] = useState(null);
    const navigate = useNavigate();

    const filteredDiseases = diseases.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAskAI = (diseaseName) => {
        // Navigate to chat with a pre-filled context (conceptually, distinct chat history would be better but simple start)
        // For now, we just go to chat. Maybe pass state?
        // But Chat.js doesn't handle location state yet. 
        // I will just navigate to chat. The user can type.
        // Or better: Implement initial message handling in Chat.js later.
        navigate('/chat');
    };

    return (
        <div className="library-page container">
            <div className="library-header">
                <h1>Chronic & Genetic Diseases</h1>
                <p>Comprehensive guide to conditions and treatments</p>

                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search diseases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="diseases-grid">
                {filteredDiseases.map(disease => (
                    <motion.div
                        key={disease.id}
                        className="disease-card"
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedDisease(disease)}
                    >
                        <div className={`disease-icon ${disease.category === 'Genetic' ? 'genetic' : 'chronic'}`}>
                            {disease.category === 'Genetic' ? <Dna size={24} /> : <Activity size={24} />}
                        </div>
                        <h3>{disease.name}</h3>
                        <span className="category-tag">{disease.category}</span>
                        <p>{disease.description}</p>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedDisease && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedDisease(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-btn" onClick={() => setSelectedDisease(null)}>
                                <X size={24} />
                            </button>

                            <div className="modal-header">
                                <div className={`disease-icon-lg ${selectedDisease.category === 'Genetic' ? 'genetic' : 'chronic'}`}>
                                    {selectedDisease.category === 'Genetic' ? <Dna size={32} /> : <Activity size={32} />}
                                </div>
                                <div>
                                    <h2>{selectedDisease.name}</h2>
                                    <span className="category-tag">{selectedDisease.category} Condition</span>
                                </div>
                            </div>

                            <div className="modal-body">
                                <h3>About</h3>
                                <p>{selectedDisease.description}</p>

                                <h3>Common Symptoms</h3>
                                <ul>
                                    {selectedDisease.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>

                                <h3>Treatments & Management</h3>
                                <ul>
                                    {selectedDisease.treatments.map((t, i) => <li key={i}>{t}</li>)}
                                </ul>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-primary w-full" onClick={() => handleAskAI(selectedDisease.name)}>
                                    <MessageCircle size={18} /> Ask AI about this condition
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Diseases;
