import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('relieftrack_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('relieftrack_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const register = (data) => {
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) return { success: false, message: 'Email already registered' };
    const newUser = { id: Date.now(), ...data, role: 'CITIZEN' };
    MOCK_USERS.push({ ...newUser, password: data.password });
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('relieftrack_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('relieftrack_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
