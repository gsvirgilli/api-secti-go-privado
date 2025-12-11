#!/bin/bash
# Script para investigar o problema de alunos não aparecerem nas turmas

# Você precisa ajustar essas variáveis com suas credenciais
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-sukatechdb}"

echo "🔍 DIAGNÓSTICO DE SINCRONIZAÇÃO DE ALUNOS E TURMAS"
echo "=================================================="
echo ""

# 1. Total de dados
echo "📊 CONTAGEM TOTAL:"
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" <<EOF
SELECT 'Total de Alunos' as info, COUNT(*) as quantidade FROM alunos;
SELECT 'Alunos com turma_id NOT NULL' as info, COUNT(*) as quantidade FROM alunos WHERE turma_id IS NOT NULL;
SELECT 'Alunos com turma_id NULL' as info, COUNT(*) as quantidade FROM alunos WHERE turma_id IS NULL;
SELECT 'Total de Turmas' as info, COUNT(*) as quantidade FROM turmas;
SELECT 'Total de Matrículas' as info, COUNT(*) as quantidade FROM matriculas;
EOF

echo ""
echo "👤 DETALHES DOS ALUNOS:"
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" <<EOF
SELECT id, nome, turma_id, status FROM alunos ORDER BY id;
EOF

echo ""
echo "🏫 TURMAS EXISTENTES:"
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" <<EOF
SELECT id, nome FROM turmas ORDER BY id;
EOF

echo ""
echo "📋 MATRÍCULAS:"
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" <<EOF
SELECT id_aluno, id_turma, status FROM matriculas ORDER BY id_aluno;
EOF

echo ""
echo "🔗 VERIFICAÇÃO: Alunos por turma_id (esperado encontrar 6 alunos):"
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" <<EOF
SELECT turma_id, COUNT(*) as quantidade FROM alunos WHERE turma_id IS NOT NULL GROUP BY turma_id;
EOF

echo ""
echo "⚠️ PROBLEMAS POTENCIAIS: Alunos com turma_id que não existe:"
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" <<EOF
SELECT a.id, a.nome, a.turma_id FROM alunos a
LEFT JOIN turmas t ON a.turma_id = t.id
WHERE a.turma_id IS NOT NULL AND t.id IS NULL;
EOF
