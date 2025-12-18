# ⚡ Guia Rápido - Sistema SECTI

## 🚀 Primeira Vez? Leia Isto

### **Instalação Rápida (Windows)**

1. **Instale Docker Desktop:**
   - https://www.docker.com/products/docker-desktop
   - Execute o instalador
   - Reinicie o PC

2. **Configure inicialização automática:**
   - Abra Docker Desktop
   - Settings → General
   - Marque "Start Docker Desktop when you log in"

3. **Inicie o Sistema:**
   - Clique duas vezes em: `INICIAR_SISTEMA.bat`
   - Aguarde 15-20 segundos
   - Browser abrirá automaticamente

4. **Faça Login:**
   ```
   Email: teste@example.com
   Senha: Teste123!
   ```

---

## 📊 Arquivos Importantes

| Arquivo | O Que Faz |
|---------|-----------|
| `INICIAR_SISTEMA.bat` | ▶️ Inicia tudo |
| `PARAR_SISTEMA.bat` | ⏸️ Para sem perder dados |
| `RESETAR_SISTEMA.bat` | 🔴 Deleta tudo e começa do zero |
| `docker-compose.yml` | ⚙️ Configuração dos containers |
| `.dockerignore` | 📦 O que não copiar para container |

---

## 🌐 Links

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| API Docs | http://localhost:5000/api-docs |
| MySQL | localhost:3306 |

---

## 💻 Comandos PowerShell/CMD

```bash
# Ver status
docker compose ps

# Ver logs do backend
docker compose logs -f back

# Parar tudo
docker compose stop

# Reiniciar tudo
docker compose restart

# Deletar tudo (CUIDADO!)
docker compose down -v
```

---

## ✅ Checklist de Primeira Vez

- [ ] Docker Desktop instalado
- [ ] Inicialização automática configurada
- [ ] `INICIAR_SISTEMA.bat` executado com sucesso
- [ ] Frontend carrega em http://localhost:3000
- [ ] Login funciona (teste@example.com / Teste123!)
- [ ] Atalho criado na Área de Trabalho

---

## 🔑 Credenciais Padrão

```
Email:  teste@example.com
Senha:  Teste123!
```

---

## 🆘 Erro?

1. **Docker não inicia?**
   - Reinicie Docker Desktop

2. **Porta em uso?**
   - Execute: `netstat -ano | findstr :3000`
   - Finalize o processo

3. **Tela branca/não carrega?**
   - Aguarde 30 segundos
   - Atualize (F5)

4. **Login não funciona?**
   - Execute: `RESETAR_SISTEMA.bat`

---

## 📝 Próximas Vezes

1. Clique no atalho de Iniciar
2. Aguarde 15 segundos
3. Sistema está pronto! ✅

---

**Dúvidas?** Veja `CHECKLIST_DEPLOY.md` para guia completo.
