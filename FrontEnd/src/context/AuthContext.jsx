import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!authService.isAuthenticated()) {
        setUser(null);
        return;
      }

      const response = await authService.getCurrentUser();

      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);

      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Register
  const register = async (email, cpf, password, confirmPassword) => {
    try {
      setError(null);
      const response = await authService.register(email, cpf, password, confirmPassword);

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      const errors = err.response?.data?.errors;
      setError(message);
      return { success: false, message, errors };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  // Verify email
  const verifyEmail = async (email, token) => {
    try {
      setError(null);
      const response = await authService.verifyEmail(email, token);
      return { success: response.success, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authService.forgotPassword(email);
      return { success: response.success, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Request failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Reset password
  const resetPassword = async (email, token, password, confirmPassword) => {
    try {
      setError(null);
      const response = await authService.resetPassword(email, token, password, confirmPassword);
      return { success: response.success, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Reset failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;