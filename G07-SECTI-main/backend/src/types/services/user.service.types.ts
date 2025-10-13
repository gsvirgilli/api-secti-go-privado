import type { 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserResponse, 
  UserListResponse 
} from '../dtos/user.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface UserServiceInterface extends 
  BaseService<UserResponse, CreateUserRequest, UpdateUserRequest>,
  PaginatedService<UserResponse, { search?: string; role?: string; page?: number; limit?: number }> {
  
  findByEmail(email: string): Promise<{ success: boolean; data?: UserResponse; error?: string }>;
  changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }>;
  updateProfile(userId: number, data: UpdateUserRequest): Promise<{ success: boolean; data?: UserResponse; error?: string }>;
}
