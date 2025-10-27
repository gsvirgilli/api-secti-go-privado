#!/bin/bash

# Token de autenticação (substitua pelo seu token válido)
TOKEN="SEU_TOKEN_AQUI"
API_URL="http://localhost:3333/api"

# TURMAS
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/classes" -o /dev/null -w "GET /classes: %{http_code}\n"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/classes/1" -o /dev/null -w "GET /classes/1: %{http_code}\n"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nome":"Turma Teste","turno":"MANHA","id_curso":1,"data_inicio":"2025-01-10","data_fim":"2025-03-10"}' \
  "$API_URL/classes" -o /dev/null -w "POST /classes: %{http_code}\n"
curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nome":"Turma Teste Atualizada"}' "$API_URL/classes/1" -o /dev/null -w "PUT /classes/1: %{http_code}\n"
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "$API_URL/classes/1" -o /dev/null -w "DELETE /classes/1: %{http_code}\n"

# ALUNOS
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/students" -o /dev/null -w "GET /students: %{http_code}\n"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/students/1" -o /dev/null -w "GET /students/1: %{http_code}\n"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"candidato_id":1,"usuario_id":2,"matricula":"2025001","turma_id":1,"status":"ativo"}' \
  "$API_URL/students" -o /dev/null -w "POST /students: %{http_code}\n"
curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"concluido"}' "$API_URL/students/1" -o /dev/null -w "PUT /students/1: %{http_code}\n"
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "$API_URL/students/1" -o /dev/null -w "DELETE /students/1: %{http_code}\n"

# CANDIDATOS
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/candidates" -o /dev/null -w "GET /candidates: %{http_code}\n"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/candidates/1" -o /dev/null -w "GET /candidates/1: %{http_code}\n"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nome":"Ana Costa","cpf":"98765432100","email":"ana.costa@exemplo.com","id_turma_desejada":1}' \
  "$API_URL/candidates" -o /dev/null -w "POST /candidates: %{http_code}\n"
curl -s -X POST -H "Authorization: Bearer $TOKEN" "$API_URL/candidates/1/approve" -o /dev/null -w "POST /candidates/1/approve: %{http_code}\n"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"motivo":"Documentação incompleta"}' "$API_URL/candidates/1/reject" -o /dev/null -w "POST /candidates/1/reject: %{http_code}\n"

# CURSOS
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/courses" -o /dev/null -w "GET /courses: %{http_code}\n"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/courses/1" -o /dev/null -w "GET /courses/1: %{http_code}\n"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nome":"Python","carga_horaria":60,"descricao":"Curso de Python básico"}' \
  "$API_URL/courses" -o /dev/null -w "POST /courses: %{http_code}\n"
curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"descricao":"Curso de Python avançado"}' "$API_URL/courses/1" -o /dev/null -w "PUT /courses/1: %{http_code}\n"
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "$API_URL/courses/1" -o /dev/null -w "DELETE /courses/1: %{http_code}\n"

echo "\nTestes manuais finalizados. Verifique os códigos de resposta acima."
