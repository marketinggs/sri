import { STATUS_CODES } from 'http';
import logger from '../utils/logger.js';

// Custom error class for API errors
export class APIError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'APIError';
  }
}

// Custom error class for validation errors
export class ValidationError extends APIError {
  constructor(message, details = null) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  // If headers have already been sent, delegate to the default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Log error details (consider using a proper logging library like winston)
  logger.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  const statusText = STATUS_CODES[statusCode] || 'Internal Server Error';

  // Format error response based on environment
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || statusText,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details,
    }),
  };

  // Handle different response types
  if (req.accepts('html')) {
    res.status(statusCode).render('error', { error: errorResponse });
  } else {
    res.status(statusCode).json(errorResponse);
  }
};

// 404 handler middleware
export const notFoundHandler = (req, res) => {
  const statusCode = 404;
  const message = `Route ${req.method} ${req.url} not found`;

  if (req.accepts('html')) {
    res.status(statusCode).render('404');
  } else {
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
    });
  }
};
