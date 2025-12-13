/**
 * Logger utility for consistent logging across the application
 * @module logger
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Log info messages
   * @param {string} message - The message to log
   * @param {...any} optionalParams - Additional parameters
   */
  info: (message, ...optionalParams) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...optionalParams);
    }
  },

  /**
   * Log error messages
   * @param {string} message - The error message
   * @param {...any} optionalParams - Additional parameters
   */
  error: (message, ...optionalParams) => {
    console.error(`[ERROR] ${message}`, ...optionalParams);
  },

  /**
   * Log warning messages
   * @param {string} message - The warning message
   * @param {...any} optionalParams - Additional parameters
   */
  warn: (message, ...optionalParams) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  },

  /**
   * Log debug messages
   * @param {string} message - The debug message
   * @param {...any} optionalParams - Additional parameters
   */
  debug: (message, ...optionalParams) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  },
};
