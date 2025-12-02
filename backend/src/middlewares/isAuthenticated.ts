import type { NextFunction, Request, Response } from 'express';
import type { AuthUser } from '../types/dtos/auth.dto.js';
import { verifyJwt } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

// Extensão de tipo do Express para incluir nosso AuthUser
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const payload = verifyJwt<{ sub: string } & Record<string, unknown>>(token);
    req.user = { id: payload.sub, ...payload } as AuthUser;
    return next();
  } catch (error) {
    return next(error);
  }
}

