import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('skillbridge_token');
      const storedUser = localStorage.getItem('skillbridge_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh user data from server in background
          const res = await authService.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('skillbridge_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Auth token verification error:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authService.login({ email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('skillbridge_token', receivedToken);
      localStorage.setItem('skillbridge_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('skillbridge_token', receivedToken);
      localStorage.setItem('skillbridge_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Update profile locally & in state
  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('skillbridge_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
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
