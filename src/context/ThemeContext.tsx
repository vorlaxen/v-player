import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

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
    children: ReactNode;
    defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'system' }) => {
    const isValidTheme = (value: any): value is Theme => {
        return value === 'light' || value === 'dark' || value === 'system';
    };

    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return defaultTheme;
        const saved = localStorage.getItem('theme') as Theme | null;
        return isValidTheme(saved) ? saved : 'system';
    });

    const resolvedTheme: 'light' | 'dark' = theme === 'system' ? getSystemTheme() : theme;
    const isDark = resolvedTheme === 'dark';

    const applyTheme = useCallback(
        (themeToApply: Theme) => {
            if (typeof window === 'undefined') return;
            const finalTheme = themeToApply === 'system' ? getSystemTheme() : themeToApply;
            document.documentElement.classList.toggle('dark', finalTheme === 'dark');
        },
        [getSystemTheme]
    );

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('theme', theme);

        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
            if (theme === 'system') applyTheme('system');
        };
        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }, [theme, applyTheme]);

    const setTheme = useCallback((newTheme: Theme) => {
        if (!isValidTheme(newTheme)) newTheme = 'system';
        setThemeState(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState(prev => {
            const current = isValidTheme(prev) ? prev : 'system';
            if (current === 'light') return 'dark';
            if (current === 'dark') return 'light';
            return getSystemTheme() === 'dark' ? 'light' : 'dark';
        });
    }, [getSystemTheme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
