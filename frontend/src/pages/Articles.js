import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { articles } from '../data/healthData';
import { Search, X, BookOpen, ChevronRight } from 'lucide-react';
import './Library.css';

const Articles = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="library-page container">
            <div className="library-header">
                <h1>Health Articles</h1>
                <p>Expert insights and latest medical research</p>

                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="articles-grid">
                {filteredArticles.map(article => (
                    <motion.div
                        key={article.id}
                        className="article-card"
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedArticle(article)}
                    >
                        <div className="article-icon">
                            <BookOpen size={24} />
                        </div>
                        <div className="article-content">
                            <span className="category-tag">{article.category}</span>
                            <h3>{article.title}</h3>
                            <p>{article.summary}</p>
                            <div className="read-more">Read Article <ChevronRight size={16} /></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedArticle && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArticle(null)}
                    >
                        <motion.div
                            className="modal-content article-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-btn" onClick={() => setSelectedArticle(null)}>
                                <X size={24} />
                            </button>

                            <div className="article-modal-header">
                                <span className="category-tag">{selectedArticle.category}</span>
                                <h1>{selectedArticle.title}</h1>
                            </div>

                            <div className="modal-body article-body">
                                <p className="article-intro">{selectedArticle.summary}</p>
                                <div className="article-text">
                                    {selectedArticle.content}
                                    <br /><br />
                                    <p>
                                        (Full article content would go here. For this demo, we are showing a preview.
                                        In a real application, this would fetch the full Markdown or HTML content from a CMS.)
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Articles;
