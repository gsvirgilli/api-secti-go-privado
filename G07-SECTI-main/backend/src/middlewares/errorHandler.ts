import type { NextFunction, Request, Response } from 'express';
import { AppError, isAppError } from '../utils/AppError.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isAppError(err)) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  // Fallback para erros inesperados
  const statusCode = 500;
  const message = 'Internal server error';
  console.error('[ERROR]', err);
  return res.status(statusCode).json({ message });
}

