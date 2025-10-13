import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("E-mail é obrigatório");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, digite um e-mail válido");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      // Simulate API call to send reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar e-mail. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-sora bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl floating-orb"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/12 rounded-full blur-3xl floating-orb"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/6 rounded-full blur-2xl floating-orb"></div>
          <div className="absolute inset-0 opacity-[0.02] grid-pattern"></div>
        </div>

        {/* Left side - Logo and Back */}
        <div className="flex-1 bg-transparent flex items-center justify-center p-4 lg:p-8 hidden lg:flex">
          <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
            <div className="space-y-6">
              {/* Enhanced Logo */}
              <div className="flex justify-center mb-12">
                <div className="text-center">
                  <div className="relative">
                    <img 
                      src="/logo_suckatech.png" 
                      alt="Suka Tech Logo" 
                      className="w-64 h-64 object-contain drop-shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-sora font-bold text-gray-800 tracking-wide">Recuperação de Senha</h3>
                <div className="space-y-2">
                  <p className="text-lg text-gray-600 font-sora">
                    Não se preocupe, vamos te ajudar
                  </p>
                  <p className="text-sm text-gray-500 font-sora">
                    Enviaremos um link para redefinir sua senha
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full max-w-xs rounded-full py-4 text-sm font-semibold tracking-wide border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 hover-scale font-sora shadow-lg hover:shadow-xl glow-effect relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  VOLTAR AO LOGIN
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Success Message */}
        <div className="flex-1 lg:flex-1 auth-gradient flex items-center justify-center p-4 lg:p-8 relative overflow-hidden min-h-screen lg:min-h-auto">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 opacity-8">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/15 rounded-full floating-orb"></div>
            <div className="absolute top-32 right-20 w-20 h-20 border border-white/20 rounded-full floating-orb"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/15 rounded-full floating-orb"></div>
            <div className="absolute inset-0 opacity-[0.03] grid-pattern"></div>
          </div>
          
          <Card className="w-full max-w-md auth-glass animate-scale-in relative overflow-hidden">
            <CardContent className="p-10 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="space-y-8 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-sora font-bold text-primary-foreground mb-2 tracking-wide relative">
                      E-MAIL ENVIADO
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    </h2>
                    <p className="text-primary-foreground/70 font-sora">
                      Enviamos um link de recuperação para
                    </p>
                    <p className="text-primary-foreground font-semibold font-sora">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-primary-foreground/80 text-sm font-sora">
                      Verifique sua caixa de entrada (e spam) e clique no link para redefinir sua senha.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    className="w-full bg-white/20 hover:bg-white/30 text-primary-foreground font-semibold py-4 rounded-xl h-14 transition-all duration-300 tracking-wide font-sora text-lg hover-scale backdrop-blur-sm relative overflow-hidden group glow-effect shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10">ENVIAR NOVAMENTE</span>
                  </Button>
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
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/8 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/12 rounded-full blur-3xl floating-orb"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/6 rounded-full blur-2xl floating-orb"></div>
        <div className="absolute inset-0 opacity-[0.02] grid-pattern"></div>
      </div>

      {/* Left side - Logo and Back */}
      <div className="flex-1 bg-transparent flex items-center justify-center p-4 lg:p-8 hidden lg:flex">
        <div className="max-w-md w-full space-y-6 text-center animate-fade-in">
          <div className="space-y-4">
            {/* Enhanced Logo */}
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="relative">
                  <img 
                    src="/logo_suckatech.png" 
                    alt="Suka Tech Logo" 
                    className="w-48 h-48 object-contain drop-shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-lg text-gray-600 font-sora font-medium">
                  Enviaremos instruções para seu e-mail
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full max-w-sm rounded-2xl py-2 sm:py-3 lg:py-4 text-sm font-roboto font-semibold tracking-[0.01em] border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl glow-effect relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                VOLTAR AO LOGIN
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="flex-1 lg:flex-1 auth-gradient flex items-center justify-center p-4 lg:p-8 relative overflow-hidden min-h-screen lg:min-h-auto">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border border-white/20 rounded-full floating-orb"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute inset-0 opacity-[0.03] grid-pattern"></div>
        </div>
        
        <Card className="w-full max-w-md auth-glass animate-scale-in relative overflow-hidden">
          <CardContent className="p-10 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-primary-foreground/70 font-sora">
                  Digite seu e-mail para receber instruções de recuperação
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-primary-foreground font-sora font-medium">
                    E-mail
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-5 w-5 transition-colors group-focus-within:text-primary-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={`pl-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-14 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora ${
                        error ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-destructive text-sm font-sora animate-fade-in">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-roboto font-semibold py-2 sm:py-3 lg:py-4 rounded-2xl h-10 sm:h-11 lg:h-12 transition-all duration-300 tracking-[0.01em] text-sm sm:text-base hover:scale-105 backdrop-blur-sm relative overflow-hidden group glow-effect shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ENVIANDO...
                      </>
                    ) : (
                      'ENVIAR LINK DE RECUPERAÇÃO'
                    )}
                  </span>
                </Button>

                <div className="text-center">
                  <p className="text-primary-foreground/60 text-sm font-sora">
                    Lembrou da senha?{" "}
                    <button
                      type="button"
                      className="text-primary-foreground hover:text-white underline font-semibold transition-colors duration-200 story-link"
                      onClick={() => navigate("/login")}
                    >
                      Fazer login
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;