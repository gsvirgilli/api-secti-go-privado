import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from './request.types.js';

// Middleware function types
export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type AuthenticatedMiddlewareFunction = (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Promise<void>;

// Validation middleware types
export interface ValidationSchema {
  body?: any;
  query?: any;
  params?: any;
}

export type ValidationMiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

// Error handling types
export interface ErrorHandlerFunction {
  (err: Error, req: Request, res: Response, next: NextFunction): void | Promise<void>;
}

// JWT payload type
export interface JwtPayload {
  sub: string; // user id
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

// Authentication context
export interface AuthContext {
  userId: number;
  role: string;
  isAuthenticated: boolean;
}

