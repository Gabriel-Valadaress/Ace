import api from './api';

const authService = {
  /**
   * Register a new user
   */
  async register(email, cpf, password, confirmPassword) {
    const response = await api.post('/auth/register', {
      email,
      cpf,
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Login user
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });

    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }

    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(email, token) {
    const response = await api.post('/auth/verify-email', { email, token });
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(email, token, password, confirmPassword) {
    const response = await api.post('/auth/reset-password', {
      email,
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Get current logged in user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken() {
    const response = await api.post('/auth/refresh');

    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }

    return response.data;
  },

  /**
   * Check if user is authenticated (has token)
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get stored access token
   */
  getToken() {
    return localStorage.getItem('accessToken');
  },
};

export default authService;