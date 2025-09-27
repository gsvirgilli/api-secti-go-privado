import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    
    if (!credentials.username.trim()) {
      newErrors.username = "Usuário é obrigatório";
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
    
    // Permitir login sem validação dos campos
    // if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Credenciais inválidas. Tente novamente.",
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

          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-roboto font-bold text-gray-900 tracking-[0.02em]" aria-label="Título de boas-vindas">Bem-vindo</h3>
              <div className="space-y-2">
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-roboto font-medium tracking-wide">
                  Acesse sua conta para gerenciar
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/register")}
              className="w-full max-w-xs rounded-2xl py-3 sm:py-4 lg:py-5 text-sm font-roboto font-semibold tracking-[0.01em] border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl glow-effect relative overflow-hidden"
              aria-label="Botão para criar nova conta"
            >
              <span className="relative z-10">CRIAR CONTA</span>
            </Button>
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
          <CardContent className="p-6 sm:p-8 lg:p-10 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-roboto font-bold text-primary-foreground mb-2 tracking-[0.02em] relative" aria-label="Título do formulário de login">
                  Acesso ao Sistema
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </h2>
                <p className="text-primary-foreground/80 font-roboto font-medium tracking-wide">
                  Digite suas credenciais para acessar sua conta
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6" role="form" aria-label="Formulário de login">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="username" className="text-primary-foreground font-roboto font-medium tracking-wide">
                    Usuário
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5 transition-colors group-focus-within:text-primary-foreground" aria-hidden="true" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Digite seu usuário"
                      value={credentials.username}
                      onChange={(e) => {
                        setCredentials({ ...credentials, username: e.target.value });
                        if (errors.username) setErrors(prev => ({ ...prev, username: "" }));
                      }}
                      className={`pl-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 sm:h-14 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-roboto tracking-wide ${
                        errors.username ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      aria-describedby="username-error"
                      aria-invalid={!!errors.username}
                    />
                  </div>
                  {errors.username && (
                    <p id="username-error" className="text-destructive text-sm font-roboto font-medium tracking-wide animate-fade-in" role="alert">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="password" className="text-primary-foreground font-roboto font-medium tracking-wide">
                    Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5 transition-colors group-focus-within:text-primary-foreground" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={credentials.password}
                      onChange={(e) => {
                        setCredentials({ ...credentials, password: e.target.value });
                        if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                      }}
                      className={`pl-12 pr-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 sm:h-14 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-roboto tracking-wide ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      aria-describedby="password-error"
                      aria-invalid={!!errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-destructive text-sm font-roboto font-medium tracking-wide animate-fade-in" role="alert">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full max-w-sm bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-roboto font-semibold py-3 sm:py-4 rounded-2xl h-11 sm:h-12 transition-all duration-300 tracking-[0.01em] text-sm sm:text-base hover:scale-105 backdrop-blur-sm relative overflow-hidden group glow-effect shadow-lg hover:shadow-xl"
                  aria-describedby="login-status"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                        ENTRANDO...
                      </>
                    ) : (
                      'FAZER LOGIN'
                    )}
                  </span>
                </Button>
                <div id="login-status" className="sr-only" aria-live="polite">
                  {isLoading ? "Processando login..." : "Pronto para fazer login"}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm underline font-sora transition-colors duration-200 story-link"
                    onClick={() => navigate("/reset-password")}
                  >
                    Esqueceu a senha? Clique aqui
                  </button>
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