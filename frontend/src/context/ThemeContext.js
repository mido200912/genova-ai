import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Force dark mode globally
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f1f5f9';
    }, []);

    const value = {
        theme: 'dark',
        toggleTheme: () => { }, // No-op
        isDark: true,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
