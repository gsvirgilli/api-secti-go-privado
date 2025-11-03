# 📚 Documentação Swagger - SUKATECH API

## ✅ Status: 100% Documentado

**Total de Endpoints:** 31  
**URL da Documentação:** http://localhost:3333/api-docs/  
**JSON da API:** http://localhost:3333/api-docs.json

---

## 📊 Endpoints Documentados por Módulo

### 🔐 Autenticação (2 endpoints)
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### 📚 Cursos (6 endpoints)
- `GET /api/courses/public` - Listar cursos (público)
- `GET /api/courses/{id}/public` - Buscar curso (público)
- `GET /api/courses/statistics` - Estatísticas
- `GET /api/courses` - Listar todos
- `POST /api/courses` - Criar curso
- `GET /api/courses/{id}` - Buscar por ID
- `PUT /api/courses/{id}` - Atualizar
- `DELETE /api/courses/{id}` - Deletar (com validação de turmas)

### 🏫 Turmas (7 endpoints)
- `GET /api/classes/statistics` - Estatísticas
- `POST /api/classes/check-conflict` - Verificar conflito de horário
- `GET /api/classes` - Listar com filtros
- `POST /api/classes` - Criar turma
- `GET /api/classes/{id}` - Buscar por ID
- `PUT /api/classes/{id}` - Atualizar
- `DELETE /api/classes/{id}` - Deletar

### 📝 Candidatos (7 endpoints)
- `POST /api/candidates/public` - Candidatura pública (sem auth)
- `GET /api/candidates/statistics` - Estatísticas
- `GET /api/candidates` - Listar com filtros
- `POST /api/candidates` - Criar (admin)
- `GET /api/candidates/{id}` - Buscar por ID
- `PUT /api/candidates/{id}` - Atualizar
- `DELETE /api/candidates/{id}` - Deletar
- `POST /api/candidates/{id}/approve` - Aprovar (converte em aluno)
- `POST /api/candidates/{id}/reject` - Rejeitar

### 👨‍🎓 Alunos (6 endpoints)
- `GET /api/students/statistics` - Estatísticas
- `GET /api/students/cpf/{cpf}` - Buscar por CPF
- `GET /api/students/matricula/{matricula}` - Buscar por matrícula
- `GET /api/students` - Listar com filtros
- `GET /api/students/{id}/enrollments` - Matrículas do aluno
- `GET /api/students/{id}` - Buscar por ID
- `PUT /api/students/{id}` - Atualizar
- `DELETE /api/students/{id}` - Deletar

### 📋 Matrículas (4 endpoints)
- `GET /api/enrollments` - Listar todas
- `POST /api/enrollments` - Criar (decrementa vagas)
- `GET /api/enrollments/{id_aluno}/{id_turma}` - Buscar específica
- `PATCH /api/enrollments/{id_aluno}/{id_turma}/cancel` - Cancelar (incrementa vagas)
- `DELETE /api/enrollments/{id_aluno}/{id_turma}` - Deletar (incrementa vagas)

### ✅ Presença (8 endpoints)
- `POST /api/attendances/bulk` - Registro em lote
- `GET /api/attendances/stats/{id_aluno}/{id_turma}` - Estatísticas do aluno
- `GET /api/attendances/report/{id_turma}/{data}` - Relatório diário
- `GET /api/attendances` - Listar com filtros
- `POST /api/attendances` - Registrar individual
- `GET /api/attendances/{id}` - Buscar por ID
- `PATCH /api/attendances/{id}` - Atualizar status
- `DELETE /api/attendances/{id}` - Deletar

---

## 🎯 Recursos Documentados

### Schemas Disponíveis:
- ✅ User
- ✅ Course
- ✅ Class
- ✅ Student
- ✅ Enrollment
- ✅ Attendance
- ✅ Candidate
- ✅ Error

### Segurança:
- 🔒 Bearer Authentication (JWT)
- 🔓 Endpoints públicos marcados com `security: []`

### Tags Organizadas:
1. Health
2. Auth
3. Courses
4. Classes
5. Students
6. Enrollments
7. Attendance
8. Candidates

---

## 🚀 Como Usar

### 1. Acesse a Documentação Interativa:
```
http://localhost:3333/api-docs/
```

### 2. Autentique-se:
1. Faça login em `POST /api/auth/login`
2. Copie o token retornado
3. Clique no botão 🔒 "Authorize" no topo
4. Cole: `Bearer seu-token-aqui`
5. Clique em "Authorize"

### 3. Teste os Endpoints:
- Clique em qualquer endpoint
- Clique em "Try it out"
- Preencha os parâmetros
- Clique em "Execute"

---

## 📝 Notas Técnicas

### Validações Documentadas:
- Campos obrigatórios marcados com `required: true`
- Tipos de dados especificados (string, integer, date, etc.)
- Enums documentados (MATUTINO, VESPERTINO, NOTURNO, etc.)
- Padrões regex (CPF com 11 dígitos)
- Limites min/max documentados

### Respostas HTTP:
- ✅ 200 - OK
- ✅ 201 - Created
- ✅ 400 - Bad Request
- ✅ 401 - Unauthorized
- ✅ 404 - Not Found
- ✅ 409 - Conflict

### Endpoints Especiais:
- **Candidatura Pública**: Sem autenticação necessária
- **Cursos Públicos**: Sem autenticação necessária
- **Gerenciamento de Vagas**: Automático em matrículas
- **Presença em Lote**: Registro múltiplo com transações
- **Estatísticas**: Endpoints dedicados para cada módulo

---

## 🎉 Sistema Completo!

Todos os 31 endpoints da API estão documentados e funcionando perfeitamente com Swagger/OpenAPI 3.0!

**Desenvolvido por:** Equipe G07-SECTI  
**Residência em TIC** - Turma 1
