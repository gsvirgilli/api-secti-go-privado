import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Save, X, User, Mail, Phone, MapPin, Calendar, Eye, EyeOff, Lock, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/useAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { notifyAuthChange } from "@/lib/authEvents";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
    cpf: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Timeout para mostrar aviso se não carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadTimeout(true);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  // Debugar localStorage na montagem
  useEffect(() => {
    const token = localStorage.getItem('@sukatech:token');
    const storedUser = localStorage.getItem('@sukatech:user');
    const storedRole = localStorage.getItem('@sukatech:role');

    console.log("Profile Debug: localStorage contents", { token: !!token, storedUser: !!storedUser, storedRole });
    if (storedUser) {
      try {
        console.log("Profile Debug: Parsed user from localStorage", JSON.parse(storedUser));
      } catch (e) {
        console.error("Profile Debug: Erro ao parsear user", e);
      }
    }

    setDebugInfo({ token: !!token, storedUser: !!storedUser, storedRole, contextUser: user });
  }, [user]);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    console.log("Profile.tsx: useEffect rodou, user =", user);
    if (user) {
      console.log("Carregando dados do usuário:", user);
      const initialData = {
        nome: user.nome || user.name || "",
        email: user.email || "",
        telefone: user.telefone || user.phone || "",
        endereco: user.endereco || user.address || "",
        dataNascimento: user.dataNascimento || user.date_nascimento || user.data_nascimento || "",
        cpf: user.cpf || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      };
      setProfileData(initialData);
      setOriginalData(initialData);

      // Carregar avatar salvo do usuário
      if (user.avatar_url) {
        console.log("Carregando avatar do usuário:", user.avatar_url);
        setAvatarPreview(user.avatar_url);
      }

      setIsLoading(false);
    } else {
      console.log("Profile.tsx: Usuário não carregado ainda");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validações básicas
      if (!profileData.nome.trim()) {
        toast.error("Nome não pode estar vazio");
        setIsSaving(false);
        return;
      }

      if (!profileData.email.trim()) {
        toast.error("Email não pode estar vazio");
        setIsSaving(false);
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        toast.error("Email inválido");
        setIsSaving(false);
        return;
      }

      // Se estiver alterando senha, validar
      if (profileData.newPassword) {
        if (!profileData.currentPassword) {
          toast.error("Digite sua senha atual para alterar a senha");
          setIsSaving(false);
          return;
        }

        if (profileData.newPassword !== profileData.confirmPassword) {
          toast.error("As novas senhas não correspondem");
          setIsSaving(false);
          return;
        }

        if (profileData.newPassword.length < 6) {
          toast.error("A nova senha deve ter pelo menos 6 caracteres");
          setIsSaving(false);
          return;
        }
      }

      // Preparar dados para enviar
      const dataToSend = {
        nome: profileData.nome,
        email: profileData.email,
        telefone: profileData.telefone,
        endereco: profileData.endereco,
        dataNascimento: profileData.dataNascimento,
        cpf: profileData.cpf
      };

      // Adicionar alteração de senha se houver
      if (profileData.newPassword) {
        Object.assign(dataToSend, {
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        });
      }

      console.log("Salvando perfil:", dataToSend);

      // Chamar API para salvar - usar 'api' que tem interceptor de token
      const response = await api.put(
        `/users/${user?.id || user?.usuario_id}`,
        dataToSend
      );

      console.log("Resposta do servidor:", response.data);

      toast.success("Perfil atualizado com sucesso!");

      // Atualizar dados originais
      setOriginalData(profileData);

      // Atualizar localStorage com os novos dados
      const updatedUser = {
        ...user,
        nome: profileData.nome,
        email: profileData.email,
        telefone: profileData.telefone,
        endereco: profileData.endereco,
        dataNascimento: profileData.dataNascimento,
        cpf: profileData.cpf
      };
      localStorage.setItem('@sukatech:user', JSON.stringify(updatedUser));

      // Limpar campos de senha
      setProfileData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      setIsEditing(false);
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      const errorMessage = error.response?.data?.message || error.message || "Erro ao salvar perfil";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    // Limpar campos de senha
    setProfileData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem não pode ser maior que 5MB');
        return;
      }

      setAvatarFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      console.log('Nenhum arquivo selecionado');
      return;
    }

    try {
      const userId = user?.id || user?.usuario_id;
      console.log('User object:', user);
      console.log('User ID:', userId);

      if (!userId) {
        toast.error('Usuário não identificado');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      console.log('Enviando avatar para usuário:', userId);
      console.log('Avatar File:', { name: avatarFile.name, size: avatarFile.size, type: avatarFile.type });

      const response = await api.put(
        `/users/${userId}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Avatar enviado com sucesso:', response.data);
      toast.success('Foto de perfil atualizada com sucesso!');

      // Limpar preview
      setAvatarPreview(null);
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Atualizar localStorage com novo avatar
      if (user) {
        const updatedUser = {
          ...user,
          avatar_url: response.data.avatar_url
        };
        console.log('Atualizando localStorage com:', updatedUser);
        localStorage.setItem('@sukatech:user', JSON.stringify(updatedUser));

        // Disparar evento para recarregar o usuário em todo o app
        console.log('Disparando notifyAuthChange');
        notifyAuthChange();
      }
    } catch (error: any) {
      console.error('Erro ao enviar avatar:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      toast.error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando perfil...</p>            {loadTimeout && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded max-w-md">
                <p className="text-yellow-800 text-sm mb-2">
                  Demorando para carregar. Verifique se você está autenticado.
                </p>
                {debugInfo && (
                  <div className="text-xs bg-white p-2 rounded mb-2 text-left">
                    <p>Token: {debugInfo.token ? '✓' : '✗'}</p>
                    <p>User localStorage: {debugInfo.storedUser ? '✓' : '✗'}</p>
                    <p>Role: {debugInfo.storedRole || '(não definido)'}</p>
                    <p>Context User: {debugInfo.contextUser ? 'Carregado' : 'Não carregado'}</p>
                  </div>
                )}
                <button
                  onClick={() => navigate('/login')}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 w-full"
                >
                  Ir para Login
                </button>
              </div>
            )}          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Perfil do Usuário</h1>
              <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
            </div>
            {!isEditing ? (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Editar Perfil
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/register")}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Criar Conta
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2" disabled={isSaving}>
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar Section */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Erro ao carregar preview:', e);
                          }}
                        />
                      ) : user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Erro ao carregar avatar:', user.avatar_url, e);
                            // Fallback para inicial
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-primary-foreground text-2xl font-bold">
                          {profileData.nome.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg">{profileData.nome}</CardTitle>
                <p className="text-muted-foreground">{profileData.email}</p>
              </CardHeader>
              <CardContent>
                {isEditing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={handleAvatarClick}
                      >
                        <Upload className="h-4 w-4" />
                        Alterar Foto
                      </Button>
                      {avatarFile && (
                        <Button
                          onClick={handleUploadAvatar}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="nome"
                        value={profileData.nome}
                        onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="telefone"
                        value={profileData.telefone}
                        onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={profileData.cpf}
                      onChange={(e) => setProfileData({ ...profileData, cpf: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="dataNascimento"
                        type="date"
                        value={profileData.dataNascimento}
                        onChange={(e) => setProfileData({ ...profileData, dataNascimento: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="endereco"
                        value={profileData.endereco}
                        onChange={(e) => setProfileData({ ...profileData, endereco: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Alterar Senha</h3>

                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha atual"
                            value={profileData.currentPassword}
                            onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            className="pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nova Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Digite a nova senha"
                              value={profileData.newPassword}
                              onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirme a nova senha"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Excluir Conta</h4>
                  <p className="text-sm text-muted-foreground">
                    Esta ação é irreversível. Todos os seus dados serão perdidos.
                  </p>
                </div>
                <Button variant="destructive">
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Profile;