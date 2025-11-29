/**
 * Local storage utility functions with JSON support
 */

const PREFIX = 'beachtennis_';

/**
 * Get item from localStorage
 */
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

/**
 * Clear all items with prefix from localStorage
 */
export const clear = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// ============================================================
// Session Storage (clears when browser closes)
// ============================================================

/**
 * Get item from sessionStorage
 */
export const getSessionItem = (key) => {
  try {
    const item = sessionStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from session:`, error);
    return null;
  }
};

/**
 * Set item in sessionStorage
 */
export const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in session:`, error);
    return false;
  }
};

/**
 * Remove item from sessionStorage
 */
export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from session:`, error);
    return false;
  }
};

// ============================================================
// Token Storage (for auth)
// ============================================================

const TOKEN_KEY = 'accessToken';

/**
 * Get access token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set access token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove access token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user has token (is logged in)
 */
export const hasToken = () => {
  return !!getToken();
};

// ============================================================
// User Preferences
// ============================================================

const PREFERENCES_KEY = 'preferences';

/**
 * Get user preferences
 */
export const getPreferences = () => {
  return getItem(PREFERENCES_KEY) || {};
};

/**
 * Set user preferences
 */
export const setPreferences = (preferences) => {
  return setItem(PREFERENCES_KEY, preferences);
};

/**
 * Update single preference
 */
export const updatePreference = (key, value) => {
  const prefs = getPreferences();
  prefs[key] = value;
  return setPreferences(prefs);
};

/**
 * Get single preference
 */
export const getPreference = (key, defaultValue = null) => {
  const prefs = getPreferences();
  return prefs[key] ?? defaultValue;
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  isAvailable,
  getSessionItem,
  setSessionItem,
  removeSessionItem,
  getToken,
  setToken,
  removeToken,
  hasToken,
  getPreferences,
  setPreferences,
  updatePreference,
  getPreference,
};