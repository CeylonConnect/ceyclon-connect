/**
 * Server-side constants and error messages
 * @module constants
 */

/**
 * HTTP Status Codes
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Error Messages
 */


export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  
  // Validation
  REQUIRED_FIELDS_MISSING: 'Required fields are missing',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PHONE: 'Invalid phone number format',
  PASSWORD_TOO_WEAK: 'Password does not meet requirements',
  
  // Resources
  USER_NOT_FOUND: 'User not found',
  TOUR_NOT_FOUND: 'Tour not found',
  BOOKING_NOT_FOUND: 'Booking not found',
  REVIEW_NOT_FOUND: 'Review not found',
  EVENT_NOT_FOUND: 'Event not found',
  MESSAGE_NOT_FOUND: 'Message not found',
  
  // Operations
  CREATE_FAILED: 'Failed to create resource',
  UPDATE_FAILED: 'Failed to update resource',
  DELETE_FAILED: 'Failed to delete resource',
  FETCH_FAILED: 'Failed to fetch data',
  
  // Database
  DB_CONNECTION_ERROR: 'Database connection error',
  DB_QUERY_ERROR: 'Database query error',
  
  // General
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  FORBIDDEN: 'Access forbidden',
  BAD_REQUEST: 'Bad request',
};

/**
 * Success Messages
 */


export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User registered successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  TOUR_CREATED: 'Tour created successfully',
  TOUR_UPDATED: 'Tour updated successfully',
  TOUR_DELETED: 'Tour deleted successfully',
  
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_UPDATED: 'Booking updated successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  
  REVIEW_CREATED: 'Review submitted successfully',
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  
  MESSAGE_SENT: 'Message sent successfully',
  
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
};

/**
 * User Roles
 */


export const USER_ROLES = {
  ADMIN: 'admin',
  GUIDE: 'guide',
  LOCAL: 'local',
  USER: 'user',
};

/**
 * Booking Status
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

/**
 * Tour Status
 */
export const TOUR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
};

/**
 * Pagination defaults
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};


export default {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
  BOOKING_STATUS,
  TOUR_STATUS,
  PAGINATION,
};
