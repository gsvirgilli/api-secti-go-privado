import type { UserRole } from '../common/index.js';

// Request DTOs
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  role?: UserRole;
}

// Response DTOs
export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  role?: UserRole;
  [key: string]: unknown;
}
