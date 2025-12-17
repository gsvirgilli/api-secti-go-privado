import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContext, AuthContextType, UserRole, User } from './authContextCore';
import { notifyAuthChange, AUTH_CHANGE_EVENT } from '@/lib/authEvents';

// Provider do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função de logout (mover para cima para uso no useEffect)
  const logout = useCallback(() => {
    console.log('Realizando logout');
    localStorage.removeItem('@sukatech:token');
    localStorage.removeItem('@sukatech:user');
    localStorage.removeItem('@sukatech:role');
    setUser(null);
    setIsAuthenticated(false);
    notifyAuthChange();
  }, []);

  // Carregar dados do usuário do localStorage ao inicializar
  useEffect(() => {
    console.log('AuthProvider: Carregando dados do localStorage');
    const token = localStorage.getItem('@sukatech:token');
    const storedUser = localStorage.getItem('@sukatech:user');
    const storedRole = localStorage.getItem('@sukatech:role');

    console.log('AuthProvider: token =', !!token, 'storedUser =', !!storedUser, 'storedRole =', storedRole);

    if (token && storedUser && storedRole) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('AuthProvider: Dados do usuário carregados:', userData);
        setUser({
          ...userData,
          role: storedRole as UserRole
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    } else {
      console.log('AuthProvider: Dados incompletos ou não encontrados');
      setIsAuthenticated(false);
    }
  }, [logout]);

  // Escutar mudanças de autenticação (por exemplo, após login)
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('AuthProvider: Evento AUTH_CHANGE_EVENT recebido, recarregando dados');
      const token = localStorage.getItem('@sukatech:token');
      const storedUser = localStorage.getItem('@sukatech:user');
      const storedRole = localStorage.getItem('@sukatech:role');

      if (token && storedUser && storedRole) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('AuthProvider: Dados do usuário recarregados:', userData);
          setUser({
            ...userData,
            role: storedRole as UserRole
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao recarregar dados do usuário:', error);
        }
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
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
      notifyAuthChange();
    }
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

// (hook moved to a dedicated file)

export default AuthProvider;// (hook moved to a dedicated file)

