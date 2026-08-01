/**
 * Async Handler Utility
 *
 * Wraps async route handlers to catch errors
 * and pass them to the error handling middleware.
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
