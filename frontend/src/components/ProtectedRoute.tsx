import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, hasAccess } = useAuth();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  // Verificar acesso negado e mostrar toast
  useEffect(() => {
    if (isAuthenticated && allowedRoles && userRole && !hasAccess(allowedRoles) && !hasShownToast) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [isAuthenticated, allowedRoles, userRole, hasAccess, hasShownToast, toast]);

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se allowedRoles não for especificado, permitir acesso a todos os usuários autenticados
  if (!allowedRoles) {
    return <>{children}</>;
  }

  // Verificar se o usuário tem acesso baseado no perfil
  if (userRole && !hasAccess(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

