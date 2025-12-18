# 🎯 Sistema SECTI - Documentação Principal

Bem-vindo ao Sistema SECTI! Selecione o guia que mais combina com você:

---

## 📚 **Guias Disponíveis**

### **🚀 Para Começar Já (Windows)**
👉 Leia: **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** (5 minutos)

Instruções passo-a-passo para instalar e iniciar o sistema.

---

### **📋 Guia Completo de Deploy (Gerentes/Admin)**
👉 Leia: **[CHECKLIST_DEPLOY.md](CHECKLIST_DEPLOY.md)** (30 minutos)

Tudo que você precisa saber para instalar em um computador novo da empresa. Inclui:
- Pré-requisitos
- Instalação do Docker
- Testes
- Troubleshooting
- Comandos úteis

---

### **🐳 Guia Docker Completo (Desenvolvedores)**
👉 Leia: **[DOCKER_SETUP.md](DOCKER_SETUP.md)** (30 minutos)

Configuração detalhada de Docker, volumes, variáveis de ambiente, etc.

---

### **💾 Como Funcionam os Dados?**
👉 Leia: **[DADOS_PERSISTENCIA.md](DADOS_PERSISTENCIA.md)** (20 minutos)

Tudo sobre persistência, backups, resets e compartilhamento de dados.

---

## ⚡ **Início Rápido (TL;DR)**

```bash
# Windows - Duplo clique em:
INICIAR_SISTEMA.bat

# Linux/Mac - Execute:
chmod +x setup-docker.sh
./setup-docker.sh
```

**Credenciais:**
```
Email: teste@example.com
Senha: Teste123!
```

---

## 📁 **Estrutura do Projeto**

```
api-secti-go-privado/
├── backend/              # Node.js/Express
├── frontend/             # React/Vite
├── docker-compose.yml    # Configuração Docker
├── Dockerfile            # Container backend
├── Dockerfile.frontend   # Container frontend
├── INICIAR_SISTEMA.bat   # ▶️ Iniciar (Windows)
├── PARAR_SISTEMA.bat     # ⏸️ Parar (Windows)
├── RESETAR_SISTEMA.bat   # 🔴 Resetar banco (Windows)
├── setup-docker.sh       # Iniciar (Linux/Mac)
├── mysql_data/           # 💾 Dados persistentes
├── GUIA_RAPIDO.md        # Para começar já
├── CHECKLIST_DEPLOY.md   # Guia completo
├── DOCKER_SETUP.md       # Config Docker
├── DADOS_PERSISTENCIA.md # Sobre dados
└── README.md             # Este arquivo
```

---

## 🎯 **O Que é Este Sistema?**

Sistema de Gestão de Cursos e Inscrições com:
- ✅ Autenticação de usuários
- ✅ Gerenciamento de cursos
- ✅ Inscrição em turmas
- ✅ Dashboard administrativo
- ✅ Relatórios

**Stack Tecnológico:**
- **Frontend:** React 18 + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Banco:** MySQL 8.0
- **DevOps:** Docker + Docker Compose

---

## 🚀 **Como Usar**

### **Primeira Vez (Setup Inicial)**

**Windows:**
1. Instale Docker Desktop
2. Clique em `INICIAR_SISTEMA.bat`
3. Pronto! 🎉

**Linux/Mac:**
1. Instale Docker
2. Execute `./setup-docker.sh`
3. Pronto! 🎉

### **Próximas Vezes (Após Setup)**

**Windows:**
- Clique em `INICIAR_SISTEMA.bat` na Área de Trabalho

**Linux/Mac:**
```bash
docker compose up -d
```

### **Para Parar**

**Windows:**
- Clique em `PARAR_SISTEMA.bat`

**Linux/Mac:**
```bash
docker compose stop
```

### **Para Resetar (Cuidado!)**

**Windows:**
- Clique em `RESETAR_SISTEMA.bat`

**Linux/Mac:**
```bash
docker compose down -v
```

---

## 🌐 **Acessos**

| Serviço | URL | Porta |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend** | http://localhost:5000 | 5000 |
| **API Docs** | http://localhost:5000/api-docs | 5000 |
| **MySQL** | localhost | 3306 |

---

## 🔑 **Credenciais Padrão**

```
Usuário:  teste@example.com
Senha:    Teste123!
```

**MySQL:**
```
Usuário:  devuser
Senha:    devpass
Banco:    defaultdb
```

---

## 🐳 **Containers**

O Docker roda 3 containers automaticamente:

1. **app_mysql** - Banco de dados
2. **app_backend** - API Node.js
3. **app_frontend** - Aplicação React

Todos eles com auto-restart habilitado.

---

## 💾 **Sobre os Dados**

- **Persistem?** ✅ Sim, em `./mysql_data/`
- **Sobrevivem restart?** ✅ Sim
- **Como fazer backup?** 
  ```bash
  cp -r ./mysql_data ./backup_meu_projeto/
  ```
- **Como restaurar?**
  ```bash
  rm -rf ./mysql_data/
  cp -r ./backup_meu_projeto/ ./mysql_data/
  ```

---

## 📝 **Desenvolvimento**

### **Arquivos Relevantes**

- **Backend:** `backend/src/**`
- **Frontend:** `frontend/src/**`
- **Config BD:** `backend/src/config/database.ts`
- **Models:** `backend/src/models/`
- **Controllers:** `backend/src/modules/*/**.controller.ts`

### **Hot Reload**

Ambos (backend e frontend) têm hot reload:
- Backend: tsx watch
- Frontend: Vite dev

Edite o código e veja as mudanças em tempo real!

---

## 🆘 **Problemas Comuns**

| Problema | Solução |
|----------|---------|
| Docker não instala | Ative virtualização na BIOS |
| "Docker not found" | Reinicie o terminal após instalar |
| Porta 3000/5000 em uso | `netstat -ano \| findstr :3000` e finalize |
| MySQL não conecta | Aguarde 20 segundos e tente novamente |
| Login não funciona | Execute `RESETAR_SISTEMA.bat` |
| Tela branca no frontend | Atualize (F5) e aguarde 10 segundos |

Mais detalhes: Veja **[CHECKLIST_DEPLOY.md](CHECKLIST_DEPLOY.md)**

---

## 📞 **Suporte**

### **Passos para Reportar Problemas**

1. Tire screenshot do erro
2. Copie os logs:
   ```bash
   docker compose logs > erros.txt
   ```
3. Descreva o que estava tentando fazer
4. Envie para a equipe de desenvolvimento

---

## ✅ **Checklist de Primeiro Acesso**

- [ ] Docker Desktop instalado e rodando
- [ ] `INICIAR_SISTEMA.bat` (ou `./setup-docker.sh`) executado com sucesso
- [ ] Frontend carrega em http://localhost:3000
- [ ] Backend responde em http://localhost:5000/api/health
- [ ] Login funciona com teste@example.com
- [ ] Consegue ver cursos e navegar
- [ ] Atalho criado na Área de Trabalho (Windows)

---

## 🎓 **Próximos Passos**

1. ✅ Leia o guia adequado para você
2. ✅ Execute o setup (INICIAR_SISTEMA.bat ou setup-docker.sh)
3. ✅ Teste o login
4. ✅ Explore a aplicação
5. 💪 Comece a desenvolver/usar!

---

## 📚 **Documentação Adicional**

- `GUIA_RAPIDO.md` - Início em 5 minutos
- `CHECKLIST_DEPLOY.md` - Guia completo (43 min)
- `DOCKER_SETUP.md` - Docker aprofundado
- `DADOS_PERSISTENCIA.md` - Como dados funcionam
- `setup-docker.sh` - Script de setup (Linux/Mac)
- `INICIAR_SISTEMA.bat` - Script de início (Windows)

---

## 📄 **Licença**

Sistema SECTI © 2025

---

**Bom desenvolvimento! 🚀**

Dúvidas? Veja os guias acima ou entre em contato com a equipe.
