import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '../common/index.js';

// Extended Response interface with helper methods
export interface ApiResponseHandler extends Response {
  success: (data?: any, message?: string) => void;
  error: (message: string, statusCode?: number, details?: any) => void;
  created: (data?: any, message?: string) => void;
  paginated: <T>(data: T[], total: number, page: number, limit: number) => void;
}

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ServicePaginatedResponse<T = any> extends ServiceResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database operation result types
export interface CreateResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UpdateResult<T = any> {
  success: boolean;
  data?: T;
  affectedRows?: number;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  affectedRows?: number;
  error?: string;
}

export interface FindResult<T = any> {
  success: boolean;
  data?: T | null;
  error?: string;
}

export interface FindAllResult<T = any> {
  success: boolean;
  data?: T[];
  total?: number;
  error?: string;
}
