import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import profileService from '../services/profileService';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
      setHasProfile(false);
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await profileService.getMyProfile();

      if (response.success) {
        setProfile(response.data);
        setHasProfile(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
        setHasProfile(false);
      } else {
        console.error('Failed to fetch profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData) => {
    try {
      setError(null);
      const response = await profileService.createProfile(profileData);

      if (response.success) {
        setProfile(response.data);
        setHasProfile(true);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create profile';
      setError(message);
      return { success: false, message, errors: err.response?.data?.errors };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await profileService.updateProfile(profileData);

      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      return { success: false, message, errors: err.response?.data?.errors };
    }
  };

  const uploadPhoto = async (file) => {
    try {
      setError(null);
      const response = await profileService.uploadPhoto(file);

      if (response.success) {
        setProfile((prev) => ({
          ...prev,
          photoUrl: response.data.photoUrl,
        }));
        return { success: true, photoUrl: response.data.photoUrl };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload photo';
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => setError(null);

  const value = {
    profile,
    loading,
    error,
    hasProfile,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadPhoto,
    clearError,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
}

export default ProfileContext;