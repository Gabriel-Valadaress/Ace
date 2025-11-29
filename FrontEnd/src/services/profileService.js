import api from './api';

const profileService = {
  /**
   * Get current user's profile
   */
  async getMyProfile() {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  /**
   * Create profile for current user
   */
  async createProfile(profileData) {
    const response = await api.post('/profiles/me', {
      fullName: profileData.fullName,
      birthDate: profileData.birthDate,
      phoneNumber: profileData.phoneNumber,
      height: profileData.height || null,
    });
    return response.data;
  },

  /**
   * Update current user's profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/profiles/me', {
      fullName: profileData.fullName,
      birthDate: profileData.birthDate,
      phoneNumber: profileData.phoneNumber,
      height: profileData.height || null,
    });
    return response.data;
  },

  /**
   * Upload profile photo
   */
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/profiles/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get player profile by ID
   */
  async getPlayerProfile(userId) {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },

  /**
   * Search players by name
   */
  async searchPlayers(query, page = 1, pageSize = 20) {
    const response = await api.get('/profiles/search', {
      params: { query, page, pageSize },
    });
    return response.data;
  },

  /**
   * Check if current user has a profile
   */
  async hasProfile() {
    try {
      const response = await api.get('/profiles/me');
      return response.data.success;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },
};

export default profileService;