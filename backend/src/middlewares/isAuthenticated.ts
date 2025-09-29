import type { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; [key: string]: unknown };
  }
}

export function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = verifyJwt<{ sub: string } & Record<string, unknown>>(token);
    req.user = { id: payload.sub, ...payload };
    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}

