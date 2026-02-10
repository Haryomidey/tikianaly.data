import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../infra/observability/types.js';

export const requestLogger = (logger?: Logger) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!logger) return next();
    const start = Date.now();
    res.on('finish', () => {
      logger.info('http.request', {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });
    next();
  };
