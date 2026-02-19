import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatAPI } from '../services/api';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm Genova AI. I can help you with general health questions, lifestyle advice, or information about specific conditions. How can I assist you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message immediately
        const newMessages = [
            ...messages,
            { role: 'user', content: userMessage }
        ];
        setMessages(newMessages);
        setLoading(true);

        try {
            // Prepare history for API (exclude initial greeting if needed, or map properly)
            const apiHistory = newMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await chatAPI.sendMessage(userMessage, apiHistory);

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: response.data.response }
            ]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "I apologize, but I'm having trouble connecting right now. Please try again later.";
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: errorMessage }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-page container">
            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-avatar">
                        <Bot size={24} color="#fff" />
                    </div>
                    <div>
                        <h1>Genova Assistant</h1>
                        <p>Your personal health companion</p>
                    </div>
                </div>

                <div className="messages-area">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`message-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}
                            >
                                <div className="message-content">
                                    {msg.role === 'assistant' && (
                                        <div className="message-icon bot">
                                            <Sparkles size={16} />
                                        </div>
                                    )}
                                    <div className="bubble">
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="message-icon user">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="message-wrapper assistant"
                        >
                            <div className="message-content">
                                <div className="message-icon bot">
                                    <Loader2 size={16} className="animate-spin" />
                                </div>
                                <div className="bubble typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your health..."
                        disabled={loading}
                    />
                    <button type="submit" disabled={!input.trim() || loading} className="send-btn">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
