import api from './api';

const profileService = {
  async getMyProfile() {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  async createProfile(profileData) {
    const response = await api.post('/profiles/me', {
      fullName: profileData.fullName,
      birthDate: profileData.birthDate,
      phoneNumber: profileData.phoneNumber,
      height: profileData.height || null,
    });
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/profiles/me', {
      fullName: profileData.fullName,
      birthDate: profileData.birthDate,
      phoneNumber: profileData.phoneNumber,
      height: profileData.height || null,
    });
    return response.data;
  },

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

  async getPlayerProfile(userId) {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },

  async searchPlayers(query, page = 1, pageSize = 20) {
    const response = await api.get('/profiles/search', {
      params: { query, page, pageSize },
    });
    return response.data;
  },

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