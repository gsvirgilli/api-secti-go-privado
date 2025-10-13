import type { BaseEntity, UserRole } from '../common/index.js';

export interface User extends BaseEntity {
  email: string;
  senha_hash: string;
  role: UserRole;
}

export interface UserSafe extends Omit<User, 'senha_hash'> {
  // User without password hash for API responses
}

export interface UserWithRelations extends UserSafe {
  // Add relations here when needed
  // instructor?: Instructor;
}
