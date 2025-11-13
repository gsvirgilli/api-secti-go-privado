import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de perfil de usuário
export type UserRole = 'admin' | 'professor';

// Interface do usuário
export interface User {
  id?: number;
  name?: string;
  email?: string;
  role: UserRole;
}

// Interface do contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isProfessor: () => boolean;
  hasAccess: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar dados do usuário do localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('@sukatech:token');
    const storedUser = localStorage.getItem('@sukatech:user');
    const storedRole = localStorage.getItem('@sukatech:role');

    if (token && storedUser && storedRole) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          role: storedRole as UserRole
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
  }, []);

  // Função de login
  const login = (email: string, password: string, role: UserRole) => {
    // Os dados já foram salvos no localStorage pela página de Login
    // Aqui apenas atualizamos o estado do contexto
    const storedUser = localStorage.getItem('@sukatech:user');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        ...userData,
        role
      });
      setIsAuthenticated(true);
      
      // Salvar o perfil no localStorage
      localStorage.setItem('@sukatech:role', role);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('@sukatech:token');
    localStorage.removeItem('@sukatech:user');
    localStorage.removeItem('@sukatech:role');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verificar se é admin
  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  // Verificar se é professor
  const isProfessor = (): boolean => {
    return user?.role === 'professor';
  };

  // Verificar se tem acesso baseado no perfil
  const hasAccess = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    // Admin sempre tem acesso a tudo
    if (user.role === 'admin') return true;
    
    // Verificar se o perfil do usuário está na lista de perfis permitidos
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    userRole: user?.role || null,
    login,
    logout,
    isAdmin,
    isProfessor,
    hasAccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

