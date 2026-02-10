import { Request, Response, NextFunction } from 'express';
import { Metrics } from '../../../infra/observability/types.js';

export const metricsMiddleware = (metrics?: Metrics) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!metrics) return next();
    const start = Date.now();
    res.on('finish', () => {
      metrics.timing('http.request.latency', Date.now() - start, {
        method: req.method,
        path: req.route?.path ?? req.path,
        status: String(res.statusCode),
      });
    });
    next();
  };
