import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_BASE_URL = 'http://localhost:8000';
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('user_id');

    if (token && role && name && userId) {
      setUser({
        token,
        role,
        name,
        id: parseInt(userId, 10),
      });
      // Setup default Authorization header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { access_token, role, name, user_id } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      localStorage.setItem('user_id', user_id.toString());

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const userData = {
        token: access_token,
        role,
        name,
        id: user_id,
      };
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed. Please check credentials.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post('/api/register', { name, email, password });
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Registration failed.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user_id');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Automatically log out when receiving a 401 Unauthorized response (session expired or invalid)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Prevent auto-logout loop if login itself fails with 401
          if (!error.config.url.endsWith('/api/login')) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
