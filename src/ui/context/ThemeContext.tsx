// src/ui/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'verde' | 'azul' | 'rosado' | 'morado' | 'rojo' | 'amarillo';

interface ThemeContextProps {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Carga el tema guardado en localStorage o usa 'verde' por defecto
    const [theme, setTheme] = useState<ThemeType>(() => {
        return (localStorage.getItem('pos-theme') as ThemeType) || 'verde';
    });

    useEffect(() => {
        // Aplica el atributo al elemento HTML raíz
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pos-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const themes: ThemeType[] = ['verde', 'azul', 'rosado', 'morado', 'rojo', 'amarillo'];
        const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    return context;
};