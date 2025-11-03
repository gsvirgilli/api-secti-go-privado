# 📧 Sistema de Notificações por Email

## 📋 Visão Geral

O sistema SECTI possui um módulo completo de notificações por email que envia mensagens automáticas aos usuários em eventos importantes como:

- ✅ Confirmação de matrícula
- ❌ Cancelamento de matrícula
- 📢 Turma encerrada
- ⚠️ Turma cancelada

## 🎨 Recursos

- **Templates HTML Responsivos**: Emails com design profissional e responsivo
- **Retry Automático**: Sistema tenta reenviar até 3 vezes em caso de falha
- **Pool de Conexões**: Otimização para envio em massa
- **Rate Limiting**: Controle de taxa de envio
- **Logs Detalhados**: Acompanhamento de todos os envios
- **Graceful Degradation**: Sistema continua funcionando mesmo sem configuração de email

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env`:

```env
# Configurações de Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-aplicativo
SMTP_FROM_EMAIL=noreply@secti.com
SMTP_FROM_NAME=SECTI - Sistema de Cursos
```

### 2. Configuração com Gmail

Para usar o Gmail como servidor SMTP:

1. **Habilitar verificação em duas etapas**
   - Acesse: https://myaccount.google.com/security
   - Ative "Verificação em duas etapas"

2. **Gerar senha de aplicativo**
   - Acesse: https://myaccount.google.com/apppasswords
   - Crie uma senha de aplicativo para "Mail"
   - Use essa senha no `SMTP_PASS`

3. **Configurar variáveis**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop  # Senha de aplicativo gerada
   ```

### 3. Outros Provedores

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@outlook.com
SMTP_PASS=sua-senha
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=sua-api-key-sendgrid
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua-senha-mailgun
```

## 🚀 Usando o Sistema

### Importar o Serviço

```typescript
import NotificationService from './modules/notifications/notification.service.js';
```

### Exemplos de Uso

#### 1. Email de Confirmação de Matrícula

```typescript
await NotificationService.sendEnrollmentConfirmation({
  alunoNome: 'João Silva',
  alunoEmail: 'joao@example.com',
  turmaNome: 'Turma Python 2025-1',
  turno: 'MANHA',
  dataInicio: new Date('2025-01-15'),
  dataFim: new Date('2025-06-30')
});
```

#### 2. Email de Cancelamento de Matrícula

```typescript
await NotificationService.sendEnrollmentCancellation({
  alunoNome: 'João Silva',
  alunoEmail: 'joao@example.com',
  turmaNome: 'Turma Python 2025-1',
  turno: 'MANHA',
  dataInicio: new Date('2025-01-15'),
  dataFim: new Date('2025-06-30')
});
```

#### 3. Email de Turma Encerrada (para múltiplos alunos)

```typescript
await NotificationService.sendClassEnded(
  {
    nome: 'Turma Python 2025-1',
    turno: 'MANHA',
    dataInicio: new Date('2025-01-15'),
    dataFim: new Date('2025-06-30')
  },
  ['aluno1@example.com', 'aluno2@example.com', 'aluno3@example.com']
);
```

#### 4. Email de Turma Cancelada (para múltiplos alunos)

```typescript
await NotificationService.sendClassCancelled(
  {
    nome: 'Turma Python 2025-1',
    turno: 'MANHA',
    motivo: 'Falta de quórum'
  },
  ['aluno1@example.com', 'aluno2@example.com']
);
```

#### 5. Email de Teste

```typescript
await NotificationService.sendTestEmail('seu-email@example.com');
```

## 🎯 Integração Automática

O sistema já está integrado automaticamente em:

### 1. **EnrollmentService**
- Envia email ao criar matrícula
- Envia email ao cancelar matrícula

### 2. **ClassService**
- Envia email aos alunos ao encerrar turma
- Envia email aos alunos ao cancelar turma

## 🧪 Testando o Sistema

### 1. Teste de Conexão

Ao iniciar o servidor, o sistema automaticamente testa a conexão SMTP:

```
✅ Servidor de email conectado com sucesso
```

Ou, se não configurado:

```
⚠️  Variáveis de email não configuradas
⚠️  O sistema de notificações por email não funcionará.
```

### 2. Teste Manual

Use o método de teste para enviar um email de teste:

```bash
# Endpoint de teste (a ser implementado)
curl -X POST http://localhost:3333/api/notifications/test \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@example.com"}'
```

### 3. Teste de Matrícula

Crie uma matrícula e verifique se o aluno recebe o email:

```bash
curl -X POST http://localhost:3333/api/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_aluno": 1,
    "id_turma": 1
  }'
```

## 📊 Logs

O sistema registra todos os eventos de email:

```
✅ Email enviado com sucesso: Matrícula confirmada para aluno@example.com
   Message ID: <abc123@gmail.com>
```

```
❌ Erro ao enviar email para aluno@example.com: Error: Connection timeout
🔄 Tentando reenviar (tentativa 1/3)...
```

```
📧 Email não enviado (sistema não configurado): Matrícula confirmada para aluno@example.com
```

## 🛡️ Segurança

### Boas Práticas

1. **Nunca commite credenciais**
   - Mantenha `.env` no `.gitignore`
   - Use variáveis de ambiente em produção

2. **Use senhas de aplicativo**
   - Não use sua senha pessoal
   - Gere senhas específicas para a aplicação

3. **Configure rate limiting**
   - O sistema já possui rate limiting configurado
   - Máximo 10 emails por segundo

4. **Monitore os envios**
   - Acompanhe os logs regularmente
   - Configure alertas para falhas

## 🔧 Troubleshooting

### Problema: "Invalid login" com Gmail

**Solução:**
1. Verifique se a verificação em 2 etapas está ativada
2. Use senha de aplicativo, não sua senha normal
3. Verifique se "Acesso a apps menos seguros" está permitido (não recomendado)

### Problema: "Connection timeout"

**Solução:**
1. Verifique sua conexão com a internet
2. Tente outra porta (587 ou 465)
3. Configure `SMTP_SECURE=true` para porta 465

### Problema: "Too many recipients"

**Solução:**
1. Divida os envios em lotes menores
2. Aumente o `maxMessages` na configuração
3. Use um serviço SMTP profissional (SendGrid, Mailgun)

### Problema: Emails caindo no spam

**Solução:**
1. Configure SPF, DKIM e DMARC no seu domínio
2. Use um domínio profissional no `SMTP_FROM_EMAIL`
3. Evite palavras que acionam filtros de spam
4. Use um serviço SMTP profissional

## 📚 Arquitetura

```
src/
├── config/
│   └── email.ts              # Configuração do Nodemailer
├── modules/
│   └── notifications/
│       └── notification.service.ts  # Serviço de notificações
├── modules/enrollments/
│   └── enrollment.service.ts        # Integrado com notificações
└── modules/classes/
    └── class.service.ts             # Integrado com notificações
```

## 🎨 Templates de Email

Todos os emails seguem um template base responsivo com:

- **Header**: Logo e nome do sistema com gradiente roxo
- **Content**: Conteúdo específico de cada tipo de notificação
- **Info Boxes**: Caixas com informações estruturadas
- **Alerts**: Alertas coloridos (success, warning, danger, info)
- **Footer**: Informações do sistema e disclaimer

### Cores do Template

- **Primary**: #667eea (Roxo)
- **Secondary**: #764ba2 (Roxo escuro)
- **Success**: #28a745 (Verde)
- **Warning**: #ffc107 (Amarelo)
- **Danger**: #dc3545 (Vermelho)
- **Info**: #17a2b8 (Azul)

## 📝 Licença

© 2025 SECTI - Sistema de Cursos. Todos os direitos reservados.
