import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse 
} from '../dtos/auth.dto.js';
import type { ServiceResponse } from '../api/response.types.js';

export interface AuthServiceInterface {
  register(data: RegisterRequest): Promise<ServiceResponse<RegisterResponse>>;
  login(data: LoginRequest): Promise<ServiceResponse<LoginResponse>>;
  validateToken(token: string): Promise<ServiceResponse<{ userId: number; role: string }>>;
  refreshToken(userId: number): Promise<ServiceResponse<{ token: string }>>;
  logout(userId: number): Promise<ServiceResponse<void>>;
}

export interface PasswordServiceInterface {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  validatePasswordStrength(password: string): boolean;
}

export interface TokenServiceInterface {
  generateToken(payload: { userId: number; role: string }): string;
  verifyToken(token: string): { userId: number; role: string } | null;
  refreshToken(token: string): string | null;
}

