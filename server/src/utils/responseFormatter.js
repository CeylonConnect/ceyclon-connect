/**
 * API Response formatter utility
 * Provides consistent response structure across all endpoints
 * @module responseFormatter
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */

export function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Validation errors or details
 */
export function sendError(res, message = 'Error', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Success message
 */
export function sendPaginated(res, data, page, limit, total, message = 'Success') {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send created response
 * @param {object} res - Express response object
 * @param {any} data - Created resource data
 * @param {string} message - Success message
 */
export function sendCreated(res, data, message = 'Resource created successfully') {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send no content response
 * @param {object} res - Express response object
 */
export function sendNoContent(res) {
  return res.status(204).send();
}

/**
 * Send validation error response
 * @param {object} res - Express response object
 * @param {any} errors - Validation errors
 */
export function sendValidationError(res, errors) {
  return sendError(res, 'Validation failed', 400, errors);
}

/**
 * Send unauthorized response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
export function sendUnauthorized(res, message = 'Unauthorized access') {
  return sendError(res, message, 401);
}

/**
 * Send forbidden response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
export function sendForbidden(res, message = 'Access forbidden') {
  return sendError(res, message, 403);
}

/**
 * Send not found response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
export function sendNotFound(res, message = 'Resource not found') {
  return sendError(res, message, 404);
}

export default {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
