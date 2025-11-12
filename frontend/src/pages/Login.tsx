import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Loader2, Shield, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthAPI } from "@/lib/api";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    
    if (!credentials.username.trim()) {
      newErrors.username = "E-mail é obrigatório";
    }
    
    if (!credentials.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Chamar API de login
      const response = await AuthAPI.login({
        email: credentials.username,
        senha: credentials.password
      });
      
      // Salvar token e dados do usuário
      if (response.data.token) {
        localStorage.setItem('@sukatech:token', response.data.token);
        localStorage.setItem('@sukatech:user', JSON.stringify(response.data.usuario || response.data.user));
        localStorage.setItem('@sukatech:role', selectedRole);
        
        // Atualizar contexto de autenticação com o perfil selecionado
        login(credentials.username, credentials.password, selectedRole);
      }
      
      toast({
        title: "Sucesso!",
        description: `Login realizado como ${selectedRole === 'admin' ? 'Administrador' : 'Professor'}`,
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          "Credenciais inválidas. Tente novamente.";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-roboto bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/12 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/6 rounded-full blur-2xl floating-orb"></div>
        <div className="absolute inset-0 opacity-[0.02] grid-pattern"></div>
      </div>
      
      {/* Left side - Logo and Welcome */}
      <div className="flex-1 bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 2xl:p-16 hidden lg:flex">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl w-full space-y-6 text-center animate-fade-in">
          <div className="space-y-4">
            {/* Enhanced Logo */}
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="relative">
                  <img 
                    src="/logo_suckatech.png" 
                    alt="Suka Tech Logo" 
                    className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain drop-shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-3">
              <h3 className="text-2xl lg:text-3xl font-roboto font-bold text-gray-900" aria-label="Título de boas-vindas">Sistema SUKATECH</h3>
              <p className="text-base lg:text-lg text-gray-700 font-roboto font-medium">
                Gestão Educacional
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 lg:flex-1 auth-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 2xl:p-16 relative overflow-hidden min-h-screen lg:min-h-auto">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border border-white/20 rounded-full floating-orb"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute inset-0 opacity-[0.03] grid-pattern"></div>
        </div>
        
        <Card className="w-full max-w-md auth-glass animate-scale-in relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 lg:p-6 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="space-y-3">
              <div className="text-center">
                <h2 className="text-2xl font-roboto font-bold text-white tracking-tight mb-1" aria-label="Título do formulário de login">
                  Acesso ao Sistema
                </h2>
                <p className="text-white/80 font-roboto text-xs">
                  Selecione seu perfil e faça login
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3" role="form" aria-label="Formulário de login">
                {/* Seleção de Perfil */}
                <div className="space-y-2">
                  <Label className="text-primary-foreground font-roboto font-semibold text-xs text-center block">
                    Selecione seu perfil:
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`group flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedRole === 'admin'
                          ? 'bg-white/40 border-white shadow-lg scale-105'
                          : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      <Shield className={`h-6 w-6 mb-1.5 transition-all ${
                        selectedRole === 'admin' ? 'text-white drop-shadow-lg' : 'text-primary-foreground/70'
                      }`} />
                      <span className={`text-xs font-roboto font-bold transition-all ${
                        selectedRole === 'admin' ? 'text-white drop-shadow' : 'text-primary-foreground/80'
                      }`}>
                        Admin
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedRole('professor')}
                      className={`group flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedRole === 'professor'
                          ? 'bg-white/40 border-white shadow-lg scale-105'
                          : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      <GraduationCap className={`h-6 w-6 mb-1.5 transition-all ${
                        selectedRole === 'professor' ? 'text-white drop-shadow-lg' : 'text-primary-foreground/70'
                      }`} />
                      <span className={`text-xs font-roboto font-bold transition-all ${
                        selectedRole === 'professor' ? 'text-white drop-shadow' : 'text-primary-foreground/80'
                      }`}>
                        Professor
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-primary-foreground font-roboto font-medium text-sm">
                    E-mail
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" aria-hidden="true" />
                    <Input
                      id="username"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={credentials.username}
                      onChange={(e) => {
                        setCredentials({ ...credentials, username: e.target.value });
                        if (errors.username) setErrors(prev => ({ ...prev, username: "" }));
                      }}
                      className={`pl-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-lg h-10 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-roboto text-sm ${
                        errors.username ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      aria-describedby="username-error"
                      aria-invalid={!!errors.username}
                    />
                  </div>
                  {errors.username && (
                    <p id="username-error" className="text-destructive text-xs font-roboto font-medium animate-fade-in" role="alert">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-primary-foreground font-roboto font-medium text-sm">
                    Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={credentials.password}
                      onChange={(e) => {
                        setCredentials({ ...credentials, password: e.target.value });
                        if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                      }}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-lg h-10 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-roboto text-sm ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      aria-describedby="password-error"
                      aria-invalid={!!errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-destructive text-xs font-roboto font-medium animate-fade-in" role="alert">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed text-primary font-roboto font-bold py-3 rounded-xl transition-all duration-300 tracking-wide text-sm hover:scale-105 hover:shadow-2xl relative overflow-hidden group shadow-lg"
                  aria-describedby="login-status"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar
                      </>
                    )}
                  </span>
                </Button>
                <div id="login-status" className="sr-only" aria-live="polite">
                  {isLoading ? "Processando login..." : "Pronto para fazer login"}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;