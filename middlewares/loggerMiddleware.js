import logger from '../utils/logger.js';

// Request logging middleware
export function requestLogger(req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

// 404 handler
export function notFoundHandler(req, res, next) {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found' });
}

// Error handler
export function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message || 'Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
