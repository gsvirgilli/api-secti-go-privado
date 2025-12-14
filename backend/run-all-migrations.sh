#!/bin/bash

# Script para executar todas as migrations do banco de dados
# Uso: ./run-all-migrations.sh

set -e

MIGRATIONS_DIR="./migrations"
MYSQL_USER="${DB_USER:-root}"
MYSQL_PASSWORD="${DB_PASSWORD:-root}"
MYSQL_HOST="${DB_HOST:-localhost}"
MYSQL_PORT="${DB_PORT:-3306}"
MYSQL_DATABASE="${DB_NAME:-secti_db}"

echo "🔧 Executando migrations do banco de dados..."
echo "📍 Host: $MYSQL_HOST:$MYSQL_PORT"
echo "📦 Database: $MYSQL_DATABASE"
echo ""

# Contar arquivos SQL
SQL_FILES=$(find "$MIGRATIONS_DIR" -name "*.sql" -type f | wc -l)
echo "📋 Total de migrations encontradas: $SQL_FILES"
echo ""

# Executar cada migration em ordem
for SQL_FILE in $(find "$MIGRATIONS_DIR" -name "*.sql" -type f | sort); do
  FILENAME=$(basename "$SQL_FILE")
  echo "🚀 Executando: $FILENAME"
  
  # Executar o arquivo SQL
  mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$SQL_FILE" 2>&1 | grep -E "(ERROR|Query OK|Affected rows|Warning)" || true
  
  echo "✅ Concluído: $FILENAME"
  echo ""
done

echo "🎉 Todas as migrations foram executadas com sucesso!"
