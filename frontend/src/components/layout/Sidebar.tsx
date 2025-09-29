import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Settings,
  LogOut,
  User,
  ClipboardList,
  FileText,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Alunos", path: "/alunos" },
  { icon: GraduationCap, label: "Turmas", path: "/turmas" },
  { icon: BookOpen, label: "Cursos", path: "/cursos" },
  { icon: UserCheck, label: "Instrutores", path: "/instrutores" },
  { icon: ClipboardList, label: "Cadastro", path: "/cadastro" },
  { icon: FileText, label: "Relatórios", path: "/relatorios" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-full bg-primary text-primary-foreground flex-col fixed left-0 top-0 z-30 overflow-hidden">
        <SidebarContent location={location} onClose={() => {}} />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 w-64 h-full bg-primary text-primary-foreground flex-col lg:hidden transition-transform duration-300 ease-in-out overflow-hidden",
        isOpen ? "translate-x-0 animate-slide-in-right" : "-translate-x-full"
      )}>
        <SidebarContent location={location} onClose={onClose} />
      </aside>
    </>
  );
};

const SidebarContent = ({ location, onClose }: { location: any; onClose: () => void }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile Close Button */}
      <div className="flex justify-end p-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-light/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {/* Logo */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <div className="relative group">
            <div className="w-16 h-16 bg-white/95 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-400 hover:scale-105 ring-1 ring-white/20">
              <img 
                src="/image.png" 
                alt="Suka Tech Logo" 
                className="w-14 h-14 object-contain flex-shrink-0 drop-shadow-sm"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 min-h-0 bg-gradient-to-b from-transparent via-white/3 to-white/5">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-primary-foreground/85 hover:text-primary-foreground hover:bg-white/15 transition-all duration-300 h-10 rounded-xl font-medium tracking-wide group shadow-sm hover:shadow-md",
                    isActive && "bg-white/20 text-primary-foreground shadow-lg border border-white/30 ring-1 ring-white/20"
                  )}
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate text-sm sm:text-base">{item.label}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-white/10 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-sm mt-auto flex-shrink-0">
        <div className="space-y-2">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground/85 hover:text-primary-foreground hover:bg-white/15 transition-all duration-300 h-10 rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md"
          >
            <Link to="/perfil">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">Perfil</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground/85 hover:text-primary-foreground hover:bg-white/15 transition-all duration-300 h-10 rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md"
          >
            <Link to="/login">
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">Sair</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;