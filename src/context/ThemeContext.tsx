import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
    const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved) return saved;
        return defaultTheme || 'system';
    });

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    useEffect(() => {
        const applyTheme = (theme: Theme) => {
            const finalTheme = theme === 'system' ? getSystemTheme() : theme;
            const html = document.documentElement;

            if (finalTheme === 'dark') html.classList.add('dark');
            else html.classList.remove('dark');
        };

        applyTheme(theme);

        localStorage.setItem('theme', theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
            if (theme === 'system') applyTheme('system');
        };
        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState(prev =>
            prev === 'light' ? 'dark' :
                prev === 'dark' ? 'light' :
                    getSystemTheme() === 'dark' ? 'light' : 'dark'
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
