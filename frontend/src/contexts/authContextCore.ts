import { createContext } from 'react';

export type UserRole = 'admin' | 'professor';

export interface User {
  id?: number;
  name?: string;
  email?: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isProfessor: () => boolean;
  hasAccess: (requiredRole: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
