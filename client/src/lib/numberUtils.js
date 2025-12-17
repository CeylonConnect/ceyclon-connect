/**
 * Number formatting utilities
 * @module numberUtils
 */

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale code (default: en-US)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  if (isNaN(amount)) return 'N/A';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @param {string} locale - Locale code (default: en-US)
 * @returns {string} Formatted number string
 */
export function formatNumber(num, locale = 'en-US') {
  if (isNaN(num)) return 'N/A';
  
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format number as percentage
 * @param {number} num - Number to format (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether input is decimal (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(num, isDecimal = true, decimals = 0) {
  if (isNaN(num)) return 'N/A';
  
  const value = isDecimal ? num * 100 : num;
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number in compact notation (e.g., 1.2K, 3.4M)
 * @param {number} num - Number to format
 * @param {string} locale - Locale code (default: en-US)
 * @returns {string} Formatted compact number
 */
export function formatCompactNumber(num, locale = 'en-US') {
  if (isNaN(num)) return 'N/A';
  
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Format bytes to human readable size
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (isNaN(bytes)) return 'N/A';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Round number to specified decimal places
 * @param {number} num - Number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded number
 */
export function roundTo(num, decimals = 2) {
  if (isNaN(num)) return 0;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate average of array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value
 */
export function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Format rating with stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star string representation
 */
export function formatRating(rating) {
  if (isNaN(rating)) return '☆☆☆☆☆';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '⯨' : '') + '☆'.repeat(emptyStars);
}

export const numberUtils = {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatCompactNumber,
  formatFileSize,
  roundTo,
  clamp,
  randomBetween,
  average,
  formatRating,
};

export default numberUtils;
