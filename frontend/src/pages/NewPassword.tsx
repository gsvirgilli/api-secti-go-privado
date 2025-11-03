import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      toast({
        title: "Erro",
        description: "Token inválido ou ausente",
        variant: "destructive",
      });
      navigate("/reset-password");
      return;
    }

    // Validar token com a API
    const validateToken = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/auth/reset-password/${token}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setTokenValid(true);
        } else {
          toast({
            title: "Token inválido",
            description: data.message || "Token expirado ou já utilizado. Solicite uma nova recuperação.",
            variant: "destructive",
          });
          setTimeout(() => navigate("/reset-password"), 3000);
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        toast({
          title: "Erro",
          description: "Erro ao validar token. Tente novamente.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/reset-password"), 3000);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, navigate, toast]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "A senha deve ter no mínimo 6 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra maiúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "A senha deve conter pelo menos um número";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      setError("Nova senha é obrigatória");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3333/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast({
          title: "Senha redefinida!",
          description: "Sua senha foi alterada com sucesso. Redirecionando para o login...",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Erro ao redefinir senha");
        toast({
          title: "Erro",
          description: data.message || "Erro ao redefinir senha. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError("Erro ao conectar com o servidor");
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-sora">Validando token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-sora bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl floating-orb"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/12 rounded-full blur-3xl floating-orb"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <Card className="w-full max-w-md auth-glass animate-scale-in">
            <CardContent className="p-10">
              <div className="space-y-8 text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-sora font-bold text-gray-900">
                    Senha Redefinida!
                  </h2>
                  <p className="text-gray-600 font-sora">
                    Sua senha foi alterada com sucesso. 
                  </p>
                  <p className="text-gray-500 font-sora text-sm">
                    Redirecionando para o login...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sora bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/12 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/6 rounded-full blur-2xl floating-orb"></div>
      </div>

      <div className="flex-1 bg-transparent flex items-center justify-center p-4 lg:p-8 hidden lg:flex">
        <div className="max-w-md w-full space-y-6 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo_suckatech.png" 
              alt="Suka Tech Logo" 
              className="w-48 h-48 object-contain drop-shadow-xl"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-sora font-bold text-gray-800">Nova Senha</h3>
            <p className="text-gray-600 font-sora">
              Defina uma senha forte e segura
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full max-w-sm rounded-2xl py-4 text-sm font-semibold border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            VOLTAR AO LOGIN
          </Button>
        </div>
      </div>

      <div className="flex-1 auth-gradient flex items-center justify-center p-4 lg:p-8 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border border-white/20 rounded-full floating-orb"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/15 rounded-full floating-orb"></div>
        </div>
        
        <Card className="w-full max-w-md auth-glass animate-scale-in relative overflow-hidden">
          <CardContent className="p-10 relative">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-sora font-bold text-primary-foreground">
                  REDEFINIR SENHA
                </h2>
                <p className="text-primary-foreground/70 font-sora">
                  Digite sua nova senha
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-primary-foreground font-sora font-medium">
                    Nova Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className="pl-12 pr-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-14 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-primary-foreground font-sora font-medium">
                    Confirmar Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className="pl-12 pr-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-14 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-3">
                    <p className="text-destructive text-sm font-sora">{error}</p>
                  </div>
                )}

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <p className="text-primary-foreground/80 text-xs font-sora">
                    <strong>Requisitos da senha:</strong>
                  </p>
                  <ul className="text-primary-foreground/70 text-xs font-sora mt-2 space-y-1">
                    <li className={newPassword.length >= 6 ? "text-green-400" : ""}>
                      • Mínimo 6 caracteres
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? "text-green-400" : ""}>
                      • Pelo menos uma letra maiúscula
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? "text-green-400" : ""}>
                      • Pelo menos uma letra minúscula
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? "text-green-400" : ""}>
                      • Pelo menos um número
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 text-primary-foreground font-semibold py-4 rounded-xl h-14 transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      REDEFININDO...
                    </>
                  ) : (
                    'REDEFINIR SENHA'
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewPassword;
