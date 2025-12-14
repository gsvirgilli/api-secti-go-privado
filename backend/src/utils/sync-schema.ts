import { sequelize } from '../config/database.js';
import Candidate from '../modules/Candidates/candidate.model.js';

/**
 * Script para sincronizar o schema do banco de dados com os modelos Sequelize
 * 
 * Uso:
 *   npm run sync-schema
 * 
 * Este script:
 * 1. Conecta ao banco de dados
 * 2. Verifica quais tabelas existem
 * 3. Sincroniza os modelos com o banco
 * 4. Mostra relatório de alterações
 */

async function syncSchema() {
  try {
    console.log('🔄 Sincronizando schema do banco de dados...\n');

    // Testar conexão
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida\n');

    // Obter informações do banco
    const queryInterface = sequelize.getQueryInterface();

    // Listar todas as tabelas
    const tables = await queryInterface.showAllTables();
    console.log(`📋 Tabelas existentes: ${tables.length}`);
    tables.forEach(table => console.log(`   - ${table}`));
    console.log('');

    // Verificar colunas da tabela de candidatos
    if (tables.includes('candidatos')) {
      const columns = await queryInterface.describeTable('candidatos');
      console.log(`📊 Colunas da tabela 'candidatos': ${Object.keys(columns).length}`);
      
      const missingColumns = [
        'curso_id2', 'turno2', 'local_curso', 'renda_mensal',
        'rg', 'sexo', 'deficiencia', 'raca_cor', 'tipo_residencia',
        'goianas_ciencia', 'menor_idade', 'nome_responsavel', 'cpf_responsavel'
      ];

      const missing = missingColumns.filter(col => !columns[col]);
      if (missing.length > 0) {
        console.log('\n⚠️  Colunas faltantes na tabela candidatos:');
        missing.forEach(col => console.log(`   ❌ ${col}`));
        console.log('\n📌 Execute a migration: migrations/20251214_fix_candidate_columns.sql');
      } else {
        console.log('✅ Todas as colunas necessárias estão presentes\n');
      }

      // Mostrar algumas colunas
      console.log('\n📋 Amostra de colunas:');
      Object.entries(columns).slice(0, 10).forEach(([name, info]) => {
        console.log(`   - ${name}: ${info.type}`);
      });
      console.log('   ...');
    } else {
      console.log('❌ Tabela candidatos não existe!');
    }

    // Sincronizar modelos (alter: true para fazer alterações)
    console.log('\n🔄 Sincronizando modelos Sequelize com banco...');
    await sequelize.sync({ alter: false }); // alter: false para apenas verificar
    console.log('✅ Sincronização concluída\n');

    console.log('💡 Dicas:');
    console.log('   - Se há colunas faltantes, execute: migrations/20251214_fix_candidate_columns.sql');
    console.log('   - Use: mysql -h host -u user -ppassword dbname < migration.sql');
    console.log('   - Ou use o painel do Render para executar SQL diretamente\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar schema:', error.message);
    console.error(error);
    process.exit(1);
  }
}

syncSchema();
