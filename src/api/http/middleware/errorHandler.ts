import { ErrorRequestHandler } from 'express';
import { Logger } from '../../../infra/observability/types.js';
import { NotFoundError, ValidationError } from '../../../shared/errors.js';

export const errorHandler = (logger?: Logger): ErrorRequestHandler => (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof ValidationError) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: err.message } });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    return;
  }

  if (logger) {
    logger.error('http.error', { message: err?.message, stack: err?.stack });
  }

  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
};
