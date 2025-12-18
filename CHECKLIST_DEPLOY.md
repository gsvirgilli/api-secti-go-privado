# 📋 Checklist do Dia do Deploy na Empresa

## 🎯 Objetivo
Instalar e configurar o Sistema SECTI em um computador novo da empresa sem maiores complicações.

---

## ✅ **PRÉ-REQUISITOS (Antes de Ir Para Lá)**

- [ ] Computador com Windows 10/11
- [ ] Acesso à internet (especialmente na primeira instalação)
- [ ] Privilégios de administrador
- [ ] Conta Docker gratuita (opcional, mas recomendado)
- [ ] Este projeto em um pendrive ou compartilhado via nuvem

---

## 🚀 **DIA DO DEPLOY - PASSO A PASSO**

### **PASSO 1: Verificar Virtualização**

> 🕐 **Tempo:** 5 minutos

```bash
# Se for Windows 11:
# Já vem com WSL2, pule para próximo passo

# Se for Windows 10:
# Pressione Win + R, digite "optionalfeatures.msc"
# Ative: "Windows Subsystem for Linux"
# Ative: "Virtual Machine Platform"
# Reinicie o computador
```

**Checklist:**
- [ ] Virtualization habilitada na BIOS (se necessário)
- [ ] WSL2 instalado (Windows 10) ou nativo (Windows 11)

---

### **PASSO 2: Instalar Docker Desktop**

> 🕐 **Tempo:** 10 minutos (+ download ~1GB)

```bash
# 1. Acesse: https://www.docker.com/products/docker-desktop
# 2. Clique "Download for Windows"
# 3. Execute o instalador
# 4. Deixe as opções padrão
# 5. Reinicie o computador quando pedir
```

**Após instalar:**
- [ ] Abra Docker Desktop (aparecerá na bandeja)
- [ ] Aguarde a mensagem "Docker Desktop is running"
- [ ] Abra PowerShell ou CMD e teste:
  ```
  docker --version
  ```
  Deve mostrar algo como: `Docker version 25.0.0`

---

### **PASSO 3: Configurar Inicialização Automática**

> 🕐 **Tempo:** 2 minutos

No Docker Desktop:
1. Abra Settings (engrenagem no canto superior)
2. Vá em "General"
3. Marque: ✅ "Start Docker Desktop when you log in"
4. Clique "Apply & Restart"

**Por quê?** Se não fizer isso, o sistema não inicia depois que a empresa reinicia o PC.

**Checklist:**
- [ ] "Start Docker Desktop when you log in" está ativado

---

### **PASSO 4: Clonar/Copiar o Projeto**

> 🕐 **Tempo:** 2 minutos

**Opção A: Via Git (Recomendado)**
```bash
git clone https://seu-repositorio.git
cd api-secti-go-privado
```

**Opção B: Via Pendrive/Nuvem**
```bash
# Copie a pasta do projeto para:
C:\Users\[usuario]\projetos\api-secti-go-privado
cd C:\Users\[usuario]\projetos\api-secti-go-privado
```

**Checklist:**
- [ ] Projeto está na pasta certa
- [ ] Arquivo `INICIAR_SISTEMA.bat` está visível

---

### **PASSO 5: Primeira Inicialização**

> 🕐 **Tempo:** 15-20 minutos (primeira vez demora mais!)

1. **Abra PowerShell ou CMD como ADMINISTRADOR**

2. **Navegue até a pasta:**
   ```bash
   cd C:\Users\[usuario]\projetos\api-secti-go-privado
   ```

3. **Execute o script:**
   ```bash
   .\INICIAR_SISTEMA.bat
   ```

   Ou simplesmente **clique duas vezes** em `INICIAR_SISTEMA.bat`

4. **Aguarde** - A primeira vez:
   - Docker faz download das imagens (MySQL, Node, etc.)
   - Constrói os containers
   - Pode demora 10-20 minutos
   - Deixe rodando normalmente

5. **Browser abrirá automaticamente** em:
   ```
   http://localhost:3000
   ```

**Checklist:**
- [ ] Script executou sem erros
- [ ] Mensagem "SISTEMA RODANDO COM SUCESSO" apareceu
- [ ] Browser abriu automaticamente
- [ ] Consegue acessar http://localhost:3000

---

### **PASSO 6: Testar o Login**

> 🕐 **Tempo:** 2 minutos

Na página aberta:

**Credenciais:**
```
Email: teste@example.com
Senha: Teste123!
```

1. Clique em "Login"
2. Cole as credenciais
3. Clique em "Entrar"

**Esperado:**
- ✅ Faz login com sucesso
- ✅ Abre dashboard/home
- ✅ Consegue ver cursos

**Se falhar:**
- [ ] Abra PowerShell e execute:
  ```bash
  docker compose logs back
  ```
- [ ] Procure por "Connection refused" ou "table doesn't exist"
- [ ] Se necessário, execute `RESETAR_SISTEMA.bat`

**Checklist:**
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Consegue navegar na aplicação

---

### **PASSO 7: Criar Atalho na Área de Trabalho**

> 🕐 **Tempo:** 2 minutos (Opcional, mas recomendado)

1. Abra a pasta do projeto
2. Procure por `INICIAR_SISTEMA.bat`
3. **Clique direito** → "Enviar para" → "Área de Trabalho (criar atalho)"
4. Na Área de Trabalho:
   - Clique direito no atalho
   - "Propriedades"
   - Clique "Alterar Ícone"
   - Escolha um ícone legal (azul ou verde)
   - OK

**Resultado:** Agora basta clicar no ícone na Área de Trabalho para iniciar!

**Checklist:**
- [ ] Atalho criado na Área de Trabalho
- [ ] Ícone customizado (opcional)

---

## ⚡ **PRÓXIMAS VEZES (Quando Ligar o PC)**

```
1. Docker Desktop inicia automaticamente (já configuramos)
2. Abra o atalho "INICIAR_SISTEMA" na Área de Trabalho
3. Sistema abre em ~15 segundos
4. Pronto! Está online
```

---

## 🛠️ **Comandos Úteis Para o Dia a Dia**

### **Parar o Sistema:**
```bash
# Duplo clique em:
PARAR_SISTEMA.bat

# Ou via command line:
docker compose stop
```

### **Reiniciar:**
```bash
INICIAR_SISTEMA.bat
```

### **Ver Logs do Backend (para debug):**
```bash
# Abra PowerShell na pasta e execute:
docker compose logs -f back

# Para sair: Ctrl + C
```

### **Resetar Banco de Dados (CUIDADO!):**
```bash
# Duplo clique em:
RESETAR_SISTEMA.bat

# Isso deleta TODOS os dados e começa do zero
```

---

## 🆘 **Troubleshooting**

### **Problema: "Docker não está instalado"**
```
Solução: Reinstale Docker Desktop
```

### **Problema: "ERRO ao iniciar containers"**
```
1. Abra Docker Desktop
2. Aguarde aparecer "Docker Desktop is running"
3. Tente novamente
```

### **Problema: "Página não carrega" (http://localhost:3000)**
```
1. Aguarde 30 segundos
2. Atualize a página (F5)
3. Verifique logs: docker compose logs -f back
```

### **Problema: "Login não funciona"**
```
1. Execute: docker compose logs back
2. Procure por erros
3. Se necessário, execute: RESETAR_SISTEMA.bat
```

### **Problema: Portas 3000 ou 5000 já estão em uso**
```
1. Verifique o que está usando:
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
2. Encerre os processos
3. Tente novamente
```

---

## 📞 **Contato & Suporte**

Se algo der errado:

1. **Tire screenshot** do erro
2. **Copie os logs:**
   ```bash
   docker compose logs > erros.txt
   ```
3. **Envie para desenvolvimento**

---

## ✨ **Resumo Final**

| Passo | Ação | Tempo |
|-------|------|-------|
| 1 | Verificar virtualização | 5 min |
| 2 | Instalar Docker | 10 min |
| 3 | Configurar inicialização | 2 min |
| 4 | Copiar projeto | 2 min |
| 5 | Primeira inicialização | 20 min |
| 6 | Testar login | 2 min |
| 7 | Criar atalho | 2 min |
| **TOTAL** | | **43 minutos** |

---

## 🎉 **Pronto!**

Seu sistema SECTI está rodando e pronto para usar! 🚀

**Próximas vezes:** Apenas clique no atalho e aguarde 15 segundos.

Boa sorte! 💪
