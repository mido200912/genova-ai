import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Chat from './pages/Chat';
import Diseases from './pages/Diseases';
import Articles from './pages/Articles';
import './index.css';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analysis"
                                element={
                                    <ProtectedRoute>
                                        <Analysis />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analysis/:id"
                                element={
                                    <ProtectedRoute>
                                        <Analysis />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/chat"
                                element={
                                    <ProtectedRoute>
                                        <Chat />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/diseases"
                                element={
                                    <ProtectedRoute>
                                        <Diseases />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/articles"
                                element={
                                    <ProtectedRoute>
                                        <Articles />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
