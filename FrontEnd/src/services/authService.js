import api from './api';

const authService = {
  async register(email, cpf, password, confirmPassword) {
    const response = await api.post('/auth/register', {
      email,
      cpf,
      password,
      confirmPassword,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });

    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }

    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  async verifyEmail(email, token) {
    const response = await api.post('/auth/verify-email', { email, token });
    return response.data;
  },

  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(email, token, password, confirmPassword) {
    const response = await api.post('/auth/reset-password', {
      email,
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');

    if (response.data.success && response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }

    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },
};

export default authService;