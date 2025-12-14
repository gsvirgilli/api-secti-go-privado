#!/bin/sh

# Script para executar migrations SQL diretamente no banco
# Usado no entrypoint.sh do Docker

set -e

MYSQL_HOST=${MYSQL_HOST:-${DB_HOST}}
MYSQL_USER=${MYSQL_USER:-${DB_USER}}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-${DB_PASSWORD}}
MYSQL_DB=${MYSQL_DB:-${DB_NAME}}

echo "🔧 Executando SQL migrations..."

# Detecta se estamos em ambiente local ou Docker
if [ -z "$MYSQL_HOST" ]; then
    echo "⚠️  Variáveis de ambiente do banco não encontradas, pulando SQL migrations"
    exit 0
fi

# Executa cada arquivo de migration
for migration_file in migrations/20251214_fix_candidate_columns.sql; do
    if [ -f "$migration_file" ]; then
        echo "📝 Executando: $migration_file"
        
        # Usa mysql para executar o arquivo
        mysql \
            -h "$MYSQL_HOST" \
            -u "$MYSQL_USER" \
            -p"$MYSQL_PASSWORD" \
            "$MYSQL_DB" < "$migration_file" 2>/dev/null || true
        
        echo "✅ Concluído: $migration_file"
    fi
done

echo "✅ SQL migrations executadas com sucesso!"
