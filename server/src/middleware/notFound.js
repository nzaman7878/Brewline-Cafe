/**
 * 404 Not Found Middleware
 *
 * Catches requests that don't match any route.
 */

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
