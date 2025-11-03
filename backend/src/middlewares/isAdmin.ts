import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware para verificar se o usuário autenticado é administrador
 * Deve ser usado após o middleware isAuthenticated
 */
export function isAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Access denied. Admin privileges required.', 403);
  }

  return next();
}
