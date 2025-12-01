const PREFIX = 'beachtennis_';

export const getItem = (key) => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
    return false;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

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

export const getSessionItem = (key) => {
  try {
    const item = sessionStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from session:`, error);
    return null;
  }
};

export const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in session:`, error);
    return false;
  }
};

export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from session:`, error);
    return false;
  }
};

const TOKEN_KEY = 'accessToken';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = () => {
  return !!getToken();
};

const PREFERENCES_KEY = 'preferences';

export const getPreferences = () => {
  return getItem(PREFERENCES_KEY) || {};
};

export const setPreferences = (preferences) => {
  return setItem(PREFERENCES_KEY, preferences);
};

export const updatePreference = (key, value) => {
  const prefs = getPreferences();
  prefs[key] = value;
  return setPreferences(prefs);
};

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