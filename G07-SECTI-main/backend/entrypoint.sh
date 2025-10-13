#!/bin/sh

# O script espera um pouco para garantir que o banco de dados esteja totalmente pronto
# mesmo depois do healthcheck passar. É uma camada extra de segurança.
echo "Waiting for database to be ready..."
sleep 5

# Executa as migrations do Sequelize
echo "Running database migrations..."
npx sequelize-cli db:migrate

# A linha mais importante!
# O comando 'exec "$@"' executa o comando que foi passado para o container.
# No nosso caso, o comando será "npm run dev".
# Isso garante que, depois de rodar a migration, o servidor da API seja iniciado.
exec "$@"