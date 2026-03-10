import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos el estado leyendo de localStorage, o forzamos 'dark' como base
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('backcare_theme');
    if (savedTheme) {
      return savedTheme as Theme;
    }
    // Si quieres que el modo oscuro sea la base indiscutible para usuarios nuevos:
    return 'dark'; 
    
    // O si prefieres que lea la preferencia de su celular:
    // return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Cada vez que el tema cambia, actualizamos el HTML y el localStorage
  useEffect(() => {
    const root = window.document.documentElement; // Esto es la etiqueta <html>
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('backcare_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};
