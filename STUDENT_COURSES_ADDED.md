# ✅ Tabela student_courses Adicionada

## O que foi feito:

Adicionei a tabela **`student_courses`** ao arquivo `create-all-tables.sql`. Esta tabela estava faltando e causava os erros:
```
Table 'defaultdb.student_courses' doesn't exist
```

## Estrutura da Tabela Criada:

```sql
CREATE TABLE IF NOT EXISTS student_courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  turma_id INT,
  status ENUM('Ativo', 'Concluído', 'Desistente') NOT NULL DEFAULT 'Ativo',
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  motivo_desistencia VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  UNIQUE KEY unique_student_course (student_id, course_id),
  INDEX idx_student_courses_status (status),
  INDEX idx_student_courses_student (student_id)
);
```

## Próximos Passos:

### 1. No seu terminal (em um novo terminal/aba), execute:

```bash
# Limpar banco de dados
docker exec sukatech_mysql mysql -u sukatech_user -psukatech_password sukatechdb < ./backend/reset-database.sql

# Criar todas as tabelas com a nova tabela student_courses
docker exec sukatech_mysql mysql -u sukatech_user -psukatech_password sukatechdb < ./backend/create-all-tables.sql
```

### 2. Reiniciar o backend:

```bash
docker restart app_backend
```

### 3. Testar as APIs de student courses:

A aplicação agora conseguirá acessar a tabela `student_courses` sem erros!

## Resumo das Tabelas (14 total):

1. ✅ **usuarios** - Login e autenticação
2. ✅ **cursos** - Cursos disponíveis
3. ✅ **turmas** - Turmas (classes) de cursos
4. ✅ **instrutores** - Instrutores/professores
5. ✅ **instrutor_turma** - Relação many-to-many entre instrutores e turmas
6. ✅ **candidatos** - Candidatos ao processo seletivo
7. ✅ **alunos** - Alunos matriculados
8. ✅ **matriculas** - Matrículas (aluno em turma)
9. ✅ **student_courses** - ⭐ NOVA! - Cursos de cada aluno
10. ✅ **calendar_events** - Eventos do calendário
11. ✅ **presencas** - Frequência/presença em aulas
12. ✅ **audit_logs** - Logs de auditoria
13. ✅ **password_reset_tokens** - Tokens para reset de senha
14. ✅ **notifications** - Notificações do sistema
