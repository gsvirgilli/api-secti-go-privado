import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Mail, Phone, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone) || phone.length >= 10;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {
      nome: "",
      email: "",
      telefone: "",
      password: "",
      confirmPassword: ""
    };
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = "Telefone inválido";
    }
    
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso. Redirecionando...",
      });
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthColors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const passwordStrengthLabels = ['Muito fraca', 'Fraca', 'Regular', 'Boa', 'Forte'];

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
              <h3 className="text-2xl font-sora font-bold text-gray-800 tracking-wide">Junte-se a nós</h3>
              <div className="space-y-2">
                <p className="text-lg text-gray-600 font-sora font-medium">
                  Crie sua conta e comece a gerenciar
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full max-w-sm rounded-2xl py-2 sm:py-3 lg:py-4 text-sm font-roboto font-semibold tracking-[0.01em] border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl glow-effect relative overflow-hidden"
            >
              <span className="relative z-10">FAZER LOGIN</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 lg:flex-1 auth-gradient flex items-center justify-center p-4 lg:p-8 relative overflow-hidden min-h-screen lg:min-h-auto">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border border-white/20 rounded-full floating-orb"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/15 rounded-full floating-orb"></div>
          <div className="absolute inset-0 opacity-[0.03] grid-pattern"></div>
        </div>
        
        <Card className="w-full max-w-md auth-glass animate-scale-in max-h-[90vh] overflow-y-auto relative overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-sora font-bold text-primary-foreground mb-2 tracking-wide relative">
                  Cadastro de Usuário
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </h2>
                <p className="text-primary-foreground/70 font-sora text-sm">
                  Preencha os dados para criar sua conta
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-primary-foreground font-sora font-medium text-sm">
                    Nome Completo
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" />
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={(e) => updateField("nome", e.target.value)}
                      className={`pl-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora text-sm ${
                        errors.nome ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-destructive text-xs font-sora animate-fade-in">{errors.nome}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary-foreground font-sora font-medium text-sm">
                    E-mail
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora text-sm ${
                        errors.email ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                    {formData.email && validateEmail(formData.email) && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                    )}
                    {formData.email && !validateEmail(formData.email) && (
                      <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-xs font-sora animate-fade-in">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-primary-foreground font-sora font-medium text-sm">
                    Telefone
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" />
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => updateField("telefone", e.target.value)}
                      className={`pl-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora text-sm ${
                        errors.telefone ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-destructive text-xs font-sora animate-fade-in">{errors.telefone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-primary-foreground font-sora font-medium text-sm">
                    Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora text-sm ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i < passwordStrength ? passwordStrengthColors[passwordStrength - 1] : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-primary-foreground/70 font-sora">
                        Força da senha: {passwordStrength > 0 ? passwordStrengthLabels[passwordStrength - 1] : 'Muito fraca'}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-destructive text-xs font-sora animate-fade-in">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-primary-foreground font-sora font-medium text-sm">
                    Confirmar Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 h-4 w-4 transition-colors group-focus-within:text-primary-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300 font-sora text-sm ${
                        errors.confirmPassword ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-xs font-sora animate-fade-in">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-roboto font-semibold py-2 sm:py-3 lg:py-4 rounded-2xl h-10 sm:h-11 lg:h-12 transition-all duration-300 tracking-[0.01em] text-sm sm:text-base hover:scale-105 backdrop-blur-sm mt-6 relative overflow-hidden group glow-effect shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        CRIANDO CONTA...
                      </>
                    ) : (
                      'CRIAR CONTA'
                    )}
                  </span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;