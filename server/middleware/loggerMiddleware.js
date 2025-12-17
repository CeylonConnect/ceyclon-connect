/**
 * Request logging middleware
 * Logs incoming requests with method, path, and response time
 * @module loggerMiddleware
 */

/**
 * Logger middleware to log HTTP requests
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip}`);

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    
    const logColor = statusCode >= 500 ? '\x1b[31m' : // Red for 5xx
                     statusCode >= 400 ? '\x1b[33m' : // Yellow for 4xx
                     statusCode >= 300 ? '\x1b[36m' : // Cyan for 3xx
                     '\x1b[32m'; // Green for 2xx
    
    console.log(
      `${logColor}[${new Date().toISOString()}] ${method} ${originalUrl} - Status: ${statusCode} - ${duration}ms\x1b[0m`
    );
  });

  next();
}

/**
 * Error logger middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
export function errorLogger(err, req, res, next) {
  console.error('\x1b[31m%s\x1b[0m', `[ERROR] ${new Date().toISOString()}`);
  console.error('\x1b[31m%s\x1b[0m', `Path: ${req.method} ${req.originalUrl}`);
  console.error('\x1b[31m%s\x1b[0m', `Message: ${err.message}`);
  console.error('\x1b[31m%s\x1b[0m', `Stack: ${err.stack}`);
  
  next(err);
}

export default {
  requestLogger,
  errorLogger,
};
