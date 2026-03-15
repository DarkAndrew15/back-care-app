import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  userId: string;
  userName: string;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_ID = 'backcare_user_id';
const STORAGE_USER_NAME = 'backcare_user_name';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Cargar o generar identidad
    let storedId = localStorage.getItem(STORAGE_USER_ID);
    let storedName = localStorage.getItem(STORAGE_USER_NAME);

    if (!storedId) {
      // Generar ID único persistente
      storedId = crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(STORAGE_USER_ID, storedId);
    }

    if (!storedName) {
      storedName = 'Invitado'; // Default
    }

    setUserId(storedId);
    setUserName(storedName);
    setIsAuthenticated(true); // Por ahora siempre "autenticado" como anónimo/local
  }, []);

  const login = (name: string) => {
    setUserName(name);
    localStorage.setItem(STORAGE_USER_NAME, name);
  };

  const logout = () => {
    // En modo local-first, logout podría ser borrar datos o solo resetear nombre
    // Por ahora solo reseteamos nombre a Invitado, mantenemos ID para no perder datos
    setUserName('Invitado');
    localStorage.removeItem(STORAGE_USER_NAME);
  };

  return (
    <AuthContext.Provider value={{ userId, userName, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
