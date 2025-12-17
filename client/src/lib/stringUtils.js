/**
 * String manipulation utilities
 * @module stringUtils
 */

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 50, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength).trim() + suffix;
}

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - String to convert
 * @returns {string} Slug string
 */
export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Remove extra whitespace from string
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
export function removeExtraSpaces(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Check if string contains substring (case-insensitive)
 * @param {string} str - String to search in
 * @param {string} substring - Substring to find
 * @returns {boolean} True if contains substring
 */
export function containsIgnoreCase(str, substring) {
  if (!str || !substring) return false;
  return str.toLowerCase().includes(substring.toLowerCase());
}

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum number of initials
 * @returns {string} Initials
 */
export function getInitials(name, maxInitials = 2) {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  const initials = parts
    .slice(0, maxInitials)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  
  return initials;
}

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {object} Parsed object
 */
export function parseQueryString(queryString) {
  if (!queryString) return {};
  
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
}

export const stringUtils = {
  capitalize,
  toTitleCase,
  truncate,
  slugify,
  removeExtraSpaces,
  containsIgnoreCase,
  getInitials,
  randomString,
  escapeHtml,
  parseQueryString,
};

export default stringUtils;
