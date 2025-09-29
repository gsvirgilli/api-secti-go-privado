import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Save, X, User, Mail, Phone, MapPin, Calendar, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: "Administrador do Sistema",
    email: "admin@sukatech.com",
    telefone: "(11) 99999-9999",
    endereco: "São Paulo, SP",
    dataNascimento: "1990-01-01",
    cpf: "123.456.789-00",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleSave = () => {
    setIsEditing(false);
    // Aqui implementaria a lógica de salvar os dados
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Resetar os dados para o estado original
  };

  const updateField = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Perfil do Usuário</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit3 className="h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
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
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">A</span>
              </div>
            </div>
            <CardTitle className="text-lg">{profileData.nome}</CardTitle>
            <p className="text-muted-foreground">{profileData.email}</p>
          </CardHeader>
          <CardContent>
            {isEditing && (
              <Button variant="outline" className="w-full">
                Alterar Foto
              </Button>
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
                    onChange={(e) => updateField("nome", e.target.value)}
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
                    onChange={(e) => updateField("email", e.target.value)}
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
                    onChange={(e) => updateField("telefone", e.target.value)}
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
                  onChange={(e) => updateField("cpf", e.target.value)}
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
                    onChange={(e) => updateField("dataNascimento", e.target.value)}
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
                    onChange={(e) => updateField("endereco", e.target.value)}
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
                        onChange={(e) => updateField("currentPassword", e.target.value)}
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
                          onChange={(e) => updateField("newPassword", e.target.value)}
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
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
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
    </div>
  );
};

export default Profile;