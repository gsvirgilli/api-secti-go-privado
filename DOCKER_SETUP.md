# 🐳 Guia de Setup - Docker Compose

## ⚡ Setup Rápido (Novo Computador)

### **Opção 1: Automático (Recomendado)**

```bash
# 1. Clonar o projeto
git clone seu-repositorio
cd api-secti-go-privado

# 2. Dar permissão de execução ao script
chmod +x setup-docker.sh

# 3. Executar o setup automático
./setup-docker.sh

# 4. Pronto! Acessar http://localhost:3000
```

### **Opção 2: Manual**

```bash
# 1. Build e start
docker compose up --build -d

# 2. Aguardar 20 segundos (MySQL inicializar)
sleep 20

# 3. Criar tabelas
docker cp backend/create-all-tables.sql app_mysql:/tmp/
docker exec app_mysql sh -c "mysql -u devuser -pdevpass defaultdb < /tmp/create-all-tables.sql"

# 4. Inserir dados
docker cp backend/insert-dados.sql app_mysql:/tmp/
docker exec app_mysql sh -c "mysql -u devuser -pdevpass defaultdb < /tmp/insert-dados.sql"

# 5. Criar usuário teste
docker exec app_mysql mysql -u devuser -pdevpass defaultdb -e \
  "INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES ('Usuário Teste', 'teste@example.com', '\$2b\$10\$RNoM5x2pA6wVhoFi2ox4Te7etuB1KAKR3cikdgGzFhyyGGt87Y0US', 'ADMIN', 1);"

# 6. Reiniciar backend
docker compose restart back
```

---

## 🔐 Credenciais Padrão

| Campo | Valor |
|-------|-------|
| **Email** | `teste@example.com` |
| **Senha** | `Teste123!` |
| **Role** | ADMIN |

---

## 🌐 Acessos

| Serviço | URL | Porta |
|---------|-----|-------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| API Docs | http://localhost:5000/api-docs | 5000 |
| MySQL | localhost | 3306 |

**Credenciais MySQL:**
- User: `devuser`
- Password: `devpass`
- Database: `defaultdb`

---

## 📦 Estrutura Docker

```yaml
db:        MySQL 8.0 (porta 3306) - Persiste em ./mysql_data
back:      Node.js/Express (porta 5000)
front:     React/Vite (porta 3000)
```

---

## 💾 Persistência de Dados

### **Os dados são permanentes?**

✅ **SIM!** Uma vez inseridos, os dados ficam em `./mysql_data`

### **Como funciona:**

```bash
# Iniciar (dados existem se mysql_data/ não foi deletado)
docker compose up -d

# Parar (dados permanecem)
docker compose down

# Parar e DELETAR dados (CUIDADO!)
docker compose down -v
```

### **Cenários:**

| Ação | Dados |
|------|-------|
| Reiniciar PC | ✅ Persistem |
| `docker compose down` | ✅ Persistem |
| `docker compose down -v` | ❌ DELETADOS |
| Deletar `./mysql_data/` | ❌ DELETADOS |

---

## 🔄 Comandos Úteis

```bash
# Ver logs
docker compose logs -f back          # Backend
docker compose logs -f front         # Frontend
docker compose logs -f db            # MySQL

# Reiniciar serviços
docker compose restart               # Todos
docker compose restart back          # Apenas backend
docker compose restart front         # Apenas frontend

# Parar/Iniciar
docker compose stop                  # Parar tudo
docker compose start                 # Iniciar tudo
docker compose down                  # Parar e remover containers

# Acessar MySQL
docker exec -it app_mysql mysql -u devuser -pdevpass defaultdb

# Ver status
docker compose ps
docker compose ps --all
```

---

## 🆘 Troubleshooting

### **Erro: Tabelas não existem**
```bash
docker cp backend/create-all-tables.sql app_mysql:/tmp/
docker exec app_mysql sh -c "mysql -u devuser -pdevpass defaultdb < /tmp/create-all-tables.sql"
docker compose restart back
```

### **Erro: Conexão recusada (backend)**
```bash
# Verificar MySQL está pronto
docker compose logs db | tail -20

# Reiniciar backend
docker compose restart back
```

### **Erro: Frontend não consegue acessar backend**
```bash
# Verificar se backend responde
curl http://localhost:5000/api/health

# Se não responder, verificar logs
docker compose logs back
```

### **Resetar tudo (perder dados!)**
```bash
docker compose down -v
rm -rf ./mysql_data
docker compose up --build -d
sleep 20
./setup-docker.sh  # ou executar steps manualmente
```

---

## 📝 Ambiente de Desenvolvimento

Para **modificar código** e ter hot-reload:

```bash
# Os serviços já têm hot-reload habilitado:
# - Backend: tsx watch (auto-reinicia em mudanças)
# - Frontend: Vite dev (hot-reload automático)

# Ver logs de mudanças
docker compose logs -f back
docker compose logs -f front
```

---

## 🚀 Próximos Passos

1. ✅ Setup completo
2. 🔐 Fazer login em http://localhost:3000
3. 📚 Explorar a API em http://localhost:5000/api-docs
4. 💻 Começar a desenvolver!

---

## 📞 Dúvidas

**P: Posso usar para produção?**  
R: Não. Este setup é só para desenvolvimento. Para produção, use imagens otimizadas e não use `-v` (bind mounts).

**P: Como faço backup do banco?**  
R: Copie a pasta `./mysql_data/` para um local seguro.

**P: Posso usar PostgreSQL ao invés de MySQL?**  
R: Sim, modifique o `docker-compose.yml` e a conexão no backend.

**P: Qual a porta padrão do MySQL?**  
R: 3306 (container) → 3306 (host)
