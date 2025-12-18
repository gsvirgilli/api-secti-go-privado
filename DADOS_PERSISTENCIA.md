# 📊 Resumo: Dados e Persistência no Docker

## ❓ A Pergunta

> Se eu for fazer isso em um computador novo, como eu faria? O banco de dados vai ser alterado, depois vai reiniciar alterado ou tem um padrão de dados que sempre vai inserir?

## ✅ Resposta Rápida

**Os dados SÃO PERMANENTES!**
- Uma vez inseridos, ficam para sempre em `./mysql_data/`
- Não há "reset automático"
- Você controla quando perder dados (só com `docker compose down -v`)

---

## 🔄 Fluxo de Dados

```
NOVO COMPUTADOR
    ↓
docker compose up --build -d
    ↓
Container MySQL inicia (volume vazio: ./mysql_data/ criado)
    ↓
Você executa: create-all-tables.sql
    ↓
Tabelas criadas ✅ (salvas em ./mysql_data/)
    ↓
Você executa: insert-dados.sql
    ↓
Dados inseridos ✅ (salvas em ./mysql_data/)
    ↓
docker compose down (containers param, dados PERMANECEM)
    ↓
docker compose up (containers retomam, dados PERMANECEM)
    ↓
❌ docker compose down -v (containers param E dados DELETADOS!)
```

---

## 📁 Estrutura de Persistência

```
api-secti-go-privado/
├── docker-compose.yml
├── backend/
├── frontend/
└── mysql_data/              ← AQUI ficam os dados!
    ├── defaultdb/           (seu banco)
    ├── mysql/               (banco do sistema)
    ├── performance_schema/
    └── ...
```

**Tamanho típico:** 50-200MB (depende de quantos dados)

---

## 🎯 Cenários de Uso

### **Cenário 1: Desenvolvimento Local**

```bash
# Dia 1
docker compose up -d
./setup-docker.sh
# ... desenvolve o dia todo ...
docker compose stop

# Dia 2 (próximo dia)
docker compose start  # Dados continuam lá!
# ... continua desenvolvendo ...
```

**Resultado:** Dados persistem entre sessões ✅

---

### **Cenário 2: Servidor Novo**

```bash
# Máquina 1 (seu PC)
docker compose up -d
./setup-docker.sh
# ... trabalha ...

# Máquina 2 (servidor novo)
git clone seu-repo
docker compose up -d
./setup-docker.sh  # Repete todo processo
# ... mesmo resultado! ✅
```

**Resultado:** Setup idêntico em qualquer máquina ✅

---

### **Cenário 3: Resetar Banco**

```bash
# Se precisar começar do zero
docker compose down -v        # ⚠️ DELETA mysql_data/
docker compose up -d
./setup-docker.sh
```

**Resultado:** Banco limpo, dados reinseridos ✅

---

## 📊 Comparativo

| Ação | Dados Persistem? | Containers Rodando? |
|------|:----------------:|:------------------:|
| `docker compose stop` | ✅ Sim | ❌ Não |
| `docker compose start` | ✅ Sim | ✅ Sim |
| `docker compose restart` | ✅ Sim | ✅ Sim |
| `docker compose down` | ✅ Sim | ❌ Não |
| `docker compose down -v` | ❌ Não | ❌ Não |
| Deletar `./mysql_data/` | ❌ Não | ✅ Sim (vazio) |
| Reiniciar PC | ✅ Sim | ❌ Não (mas containers iniciam se configurado) |

---

## 🔐 Garantia de Dados

### **Seus dados estão seguros em:**

```bash
./mysql_data/defaultdb/
```

**Você PODE:**
- ✅ Fazer backup: `cp -r ./mysql_data/ ./backup/`
- ✅ Restaurar: `rm -rf ./mysql_data/ && cp -r ./backup/ ./mysql_data/`
- ✅ Compartilhar: Enviar pasta para outra pessoa (mesmos dados)

**Você NÃO PODE (sem perder dados):**
- ❌ Deletar `./mysql_data/`
- ❌ Usar `docker compose down -v`
- ❌ Mudar driver de volume sem migração

---

## 💡 Dicas Importantes

### **1. Desenvolvimento é Seguro**
```bash
# Teste à vontade, dados não desaparecem
docker compose restart back
# Seus dados continuam lá ✅
```

### **2. Compartilhar Projeto**
```bash
# Enviar código
git push origin main

# NÃO precisa fazer backup do banco se:
# - Dados são gerados pelo script insert-dados.sql
# - Está no git
git add backend/insert-dados.sql
git commit -m "dados atualizados"
git push

# Quando clonar em outro PC:
git clone seu-repo
./setup-docker.sh  # Mesmo setup! ✅
```

### **3. Dados Confidenciais**
```bash
# Se tiver dados sensíveis em ./mysql_data/
# NÃO faça git add mysql_data/
# Já está no .gitignore? Verificar:
cat .gitignore | grep mysql_data
```

### **4. Performance**
```bash
# Se mysql_data/ fica muito grande:
docker exec app_mysql mysql -u devuser -pdevpass defaultdb -e "OPTIMIZE TABLE usuarios, cursos, turmas;"
```

---

## 🚀 Recomendação Final

**Para cada novo computador:**

```bash
git clone seu-repo
cd api-secti-go-privado
chmod +x setup-docker.sh
./setup-docker.sh

# Pronto! Tudo funciona igual ✅
```

**Comando para sempre rodar (no futuro):**

```bash
docker compose up -d   # Inicia (dados já estão lá)
docker compose logs -f back   # Ver o que está acontecendo
```

---

## ❓ FAQ Rápido

**P: Se desligar o PC, perco os dados?**  
R: Não, estão em `./mysql_data/` (HD)

**P: Posso mover a pasta de projeto?**  
R: Sim, leve junto com `mysql_data/`

**P: Como faço para outros testarem o mesmo banco?**  
R: Compartilhe `backend/insert-dados.sql`, não a pasta `mysql_data/`

**P: O banco fica vazio se eu não rodar o setup?**  
R: Sim, as tabelas são criadas por você (não é automático)

**P: Posso usar dados do production em dev?**  
R: Sim, copie o `mysql_data/` da produção (backup completo)
