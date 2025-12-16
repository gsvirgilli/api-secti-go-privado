import { User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { NotificationCenter } from "@/components/NotificationCenter";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem("@sukatech:token");
    localStorage.removeItem("@sukatech:user");

    // Redirecionar para a página inicial usando React Router
    navigate("/");
  };

  return (
    <>
      {/* Skip to main content for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      <header
        className="h-14 sm:h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-3 sm:px-4 lg:px-6 lg:pl-6 sticky top-0 z-40"
        role="banner"
      >
        {/* Mobile Menu Button + Search */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Abrir menu de navegação"
            aria-expanded="false"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Action Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Ações do usuário">
          {/* Notifications - Using new NotificationCenter component */}
          <NotificationCenter />

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 h-8 w-8 sm:h-9 sm:w-9"
                aria-label="Menu do usuário"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 sm:w-56 bg-background border shadow-lg z-50"
              role="menu"
              aria-label="Opções do usuário"
            >
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="cursor-pointer hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-1 text-xs sm:text-sm"
                role="menuitem"
              >
                <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-destructive focus:ring-offset-1 text-destructive focus:text-destructive text-xs sm:text-sm"
                role="menuitem"
              >
                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
    </>
  );
};

export default Header;