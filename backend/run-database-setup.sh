#!/bin/bash

# =====================================================
# SCRIPT DE EXECUÇÃO DOS SCRIPTS SQL
# Sistema SECTI - Gestão de Cursos e Alunos
# =====================================================

set -e  # Parar na primeira erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações do Banco de Dados
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="devuser"
DB_PASSWORD="devpass"
DB_NAME="defaultdb"

# Função para imprimir com cores
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar se MySQL está rodando
check_mysql() {
    print_info "Verificando conexão com MySQL..."
    
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" &> /dev/null; then
        print_success "MySQL está conectado!"
    else
        print_error "Não foi possível conectar ao MySQL"
        echo "Verifique se:"
        echo "  - MySQL está rodando: sudo service mysql start"
        echo "  - Credenciais estão corretas"
        echo "  - Host e porta estão corretos"
        exit 1
    fi
}

# Função para executar um script SQL
execute_sql() {
    local script_file=$1
    local description=$2
    
    if [ ! -f "$script_file" ]; then
        print_error "Arquivo não encontrado: $script_file"
        return 1
    fi
    
    print_info "Executando: $description..."
    
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$script_file" > /tmp/sql_output.log 2>&1; then
        print_success "$description concluída!"
        tail -20 /tmp/sql_output.log | grep "✅\|📊\|Total" || true
    else
        print_error "Erro ao executar: $description"
        cat /tmp/sql_output.log
        return 1
    fi
}

# Função para exibir menu
show_menu() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  SISTEMA SECTI - Setup DB${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo "1) Executar script completo (RECOMENDADO)"
    echo "2) Executar script com dados extras"
    echo "3) Executar ambos os scripts"
    echo "4) Verificar dados no banco"
    echo "5) Limpar e recriar tudo"
    echo "0) Sair"
    echo ""
    read -p "Escolha uma opção: " choice
}

# Função para verificar dados
verify_data() {
    print_info "Verificando dados no banco..."
    
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
SELECT '📊 RESUMO DOS DADOS' as Informacao;
SELECT 
  CONCAT('Usuários: ', COUNT(*)) FROM usuarios
  UNION ALL
  SELECT CONCAT('Cursos: ', COUNT(*)) FROM cursos
  UNION ALL
  SELECT CONCAT('Turmas: ', COUNT(*)) FROM turmas
  UNION ALL
  SELECT CONCAT('Alunos: ', COUNT(*)) FROM alunos
  UNION ALL
  SELECT CONCAT('Instrutores: ', COUNT(*)) FROM instrutores
  UNION ALL
  SELECT CONCAT('Candidatos: ', COUNT(*)) FROM candidatos
  UNION ALL
  SELECT CONCAT('Matrículas: ', COUNT(*)) FROM matriculas
  UNION ALL
  SELECT CONCAT('Frequências: ', COUNT(*)) FROM presencas;
EOF
}

# Função para limpar dados
clear_data() {
    print_warning "Você está prestes a limpar TODO o banco de dados!"
    read -p "Digite 'SIM' para confirmar: " confirmation
    
    if [ "$confirmation" = "SIM" ]; then
        print_info "Limpando banco de dados..."
        
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE SequelizeMeta;
TRUNCATE TABLE alunos;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE calendar_events;
TRUNCATE TABLE candidatos;
TRUNCATE TABLE cursos;
TRUNCATE TABLE instrutor_turma;
TRUNCATE TABLE instrutores;
TRUNCATE TABLE matriculas;
TRUNCATE TABLE notifications;
TRUNCATE TABLE password_reset_tokens;
TRUNCATE TABLE presencas;
TRUNCATE TABLE student_courses;
TRUNCATE TABLE turmas;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;
EOF
        
        print_success "Banco de dados foi limpo!"
    else
        print_warning "Operação cancelada"
    fi
}

# Main Script
main() {
    clear
    
    print_info "Bem-vindo ao script de setup do SECTI Database!"
    echo ""
    
    # Verificar MySQL
    check_mysql
    
    # Obter diretório do script
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    while true; do
        show_menu
        
        case $choice in
            1)
                execute_sql "$SCRIPT_DIR/setup-database-complete.sql" "Script Completo"
                ;;
            2)
                execute_sql "$SCRIPT_DIR/setup-database-extended.sql" "Script com Dados Extras"
                ;;
            3)
                execute_sql "$SCRIPT_DIR/setup-database-complete.sql" "Script Completo"
                echo ""
                execute_sql "$SCRIPT_DIR/setup-database-extended.sql" "Script com Dados Extras"
                ;;
            4)
                verify_data
                ;;
            5)
                clear_data
                echo ""
                execute_sql "$SCRIPT_DIR/setup-database-complete.sql" "Script Completo (Recriação)"
                ;;
            0)
                print_success "Saindo..."
                exit 0
                ;;
            *)
                print_error "Opção inválida!"
                ;;
        esac
        
        echo ""
        read -p "Pressione ENTER para continuar..."
    done
}

# Verificar se há argumentos de linha de comando
if [ $# -gt 0 ]; then
    case $1 in
        full)
            check_mysql
            SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
            execute_sql "$SCRIPT_DIR/setup-database-complete.sql" "Script Completo"
            exit 0
            ;;
        extended)
            check_mysql
            SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
            execute_sql "$SCRIPT_DIR/setup-database-extended.sql" "Script com Dados Extras"
            exit 0
            ;;
        all)
            check_mysql
            SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
            execute_sql "$SCRIPT_DIR/setup-database-complete.sql" "Script Completo"
            execute_sql "$SCRIPT_DIR/setup-database-extended.sql" "Script com Dados Extras"
            exit 0
            ;;
        verify)
            check_mysql
            verify_data
            exit 0
            ;;
        *)
            print_error "Argumento desconhecido: $1"
            echo "Uso: $0 [full|extended|all|verify]"
            exit 1
            ;;
    esac
else
    main
fi
