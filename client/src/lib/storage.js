/**
 * LocalStorage utility with error handling and JSON serialization
 * @module storage
 */

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save data to localStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} True if successful
 */
export function setItem(key, value) {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error.message}`);
    return false;
  }
}

/**
 * Get data from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Retrieved value or default value
 */
export function getItem(key, defaultValue = null) {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
export function removeItem(key) {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error.message}`);
    return false;
  }
}

/**
 * Clear all items from localStorage
 * @returns {boolean} True if successful
 */
export function clear() {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error.message}`);
    return false;
  }
}

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if key exists
 */
export function hasItem(key) {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  return localStorage.getItem(key) !== null;
}

/**
 * Get all keys from localStorage
 * @returns {string[]} Array of keys
 */
export function getAllKeys() {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  return Object.keys(localStorage);
}

export const storage = {
  setItem,
  getItem,
  removeItem,
  clear,
  hasItem,
  getAllKeys,
};

export default storage;
