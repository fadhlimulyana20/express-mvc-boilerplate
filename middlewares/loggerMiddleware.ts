import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
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
