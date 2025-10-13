import type { Request } from 'express';
import type { AuthUser } from '../dtos/auth.dto.js';

// Extended Request interface with user authentication
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// Request with pagination
export interface PaginatedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    search?: string;
    [key: string]: string | undefined;
  };
}

// Request with authentication and pagination
export interface AuthenticatedPaginatedRequest extends AuthenticatedRequest {
  query: {
    page?: string;
    limit?: string;
    search?: string;
    [key: string]: string | undefined;
  };
}

// Request body validation types
export interface RequestWithBody<T = any> extends Request {
  body: T;
}

export interface AuthenticatedRequestWithBody<T = any> extends AuthenticatedRequest {
  body: T;
}
