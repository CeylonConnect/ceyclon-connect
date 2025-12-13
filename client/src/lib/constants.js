/**
 * Application-wide constants
 * @module constants
 */

/**
 * API error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unexpected error occurred.',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
};

/**
 * API endpoints base paths
 */
export const API_ENDPOINTS = {
  USERS: '/api/users',
  TOURS: '/api/tours',
  BOOKINGS: '/api/bookings',
  MESSAGES: '/api/messages',
  REVIEWS: '/api/reviews',
  EVENTS: '/api/events',
  BADGES: '/api/badges',
  DISPUTES: '/api/disputes',
  ADMIN: '/api/admin',
};

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  TOURS: '/tours',
  EVENTS: '/events',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  LOCAL: '/local',
};
