// src/screens /AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromLogout, setFromLogout] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getItem('token');
      const storedUser = await storage.getItem('user');
      const storedUserType = await storage.getItem('userType');

      if (storedToken && storedUser && storedUserType) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setUserType(storedUserType);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, authToken, type) => {
    try {
      await storage.setItem('token', authToken);
      await storage.setItem('user', JSON.stringify(userData));
      await storage.setItem('userType', type);

      setToken(authToken);
      setUser(userData);
      setUserType(type);
      setFromLogout(false);

      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('token');
      await storage.removeItem('user');
      await storage.removeItem('userType');

      setToken(null);
      setUser(null);
      // ⚡ keep userType so we know which login screen to show
      setFromLogout(true);

      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  };

  const isAuthenticated = () => !!(token && user && userType);

  const value = {
    user,
    token,
    userType,
    login,
    logout,
    isAuthenticated,
    loading,
    fromLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
