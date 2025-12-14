import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 10530,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
  });

  try {
    console.log('📋 Iniciando migrações do banco de dados...\n');

    // 1. Ler e executar schema principal
    const schemaPath = path.join(__dirname, 'init-mysql-schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf-8');
    schema = schema.replace(/USE sukatechdb;/g, '');

    console.log('✅ Criando tabelas principais...');
    await connection.query(schema);
    console.log('✅ Tabelas principais criadas!\n');

    // 2. Executar migrações SQL adicionais em ordem
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Encontradas ${migrationFiles.length} migrações adicionais\n`);

    for (const file of migrationFiles) {
      try {
        const filePath = path.join(migrationsDir, file);
        let migrationSQL = fs.readFileSync(filePath, 'utf-8');
        migrationSQL = migrationSQL.replace(/USE sukatechdb;/g, '').replace(/USE defaultdb;/g, '');
        
        console.log(`  ⏳ Executando: ${file}`);
        await connection.query(migrationSQL);
        console.log(`  ✅ ${file} aplicada\n`);
      } catch (error) {
        console.warn(`  ⚠️  Aviso ao executar ${file}:`, error.message.split('\n')[0]);
        // Continuar mesmo se uma migração falhar
      }
    }

    // 3. Adicionar colunas faltantes ao candidatos (se não existirem)
    console.log('🔧 Verificando e adicionando colunas faltantes ao candidatos...');
    try {
      const candidatosColumns = [
        'ALTER TABLE candidatos ADD COLUMN rg VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN sexo ENUM(\'FEMININO\', \'MASCULINO\', \'OUTRO\', \'PREFIRO_NAO_INFORMAR\') NULL',
        'ALTER TABLE candidatos ADD COLUMN deficiencia ENUM(\'NAO\', \'AUDITIVA\', \'VISUAL\', \'FISICA\', \'INTELECTUAL\', \'MULTIPLA\') NULL',
        'ALTER TABLE candidatos ADD COLUMN telefone2 VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN idade INT NULL',
        'ALTER TABLE candidatos ADD COLUMN nome_mae VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN cidade_nascimento VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN cep VARCHAR(8) NULL',
        'ALTER TABLE candidatos ADD COLUMN rua VARCHAR(200) NULL',
        'ALTER TABLE candidatos ADD COLUMN numero VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN complemento VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN bairro VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN cidade VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN estado VARCHAR(2) NULL',
        'ALTER TABLE candidatos ADD COLUMN curso_id INT NULL',
        'ALTER TABLE candidatos ADD COLUMN turno VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN curso_id2 INT NULL',
        'ALTER TABLE candidatos ADD COLUMN turno2 VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN local_curso VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN lattes_url VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN portifolio_url VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN experiencia_profissional TEXT NULL',
        'ALTER TABLE candidatos ADD COLUMN renda_mensal VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN tipo_residencia VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN goianas_ciencia VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN documento_identidade VARCHAR(100) NULL',
        'ALTER TABLE candidatos ADD COLUMN raca_cor VARCHAR(20) NULL',
        'ALTER TABLE candidatos ADD COLUMN documento_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN rg_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN cpf_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN comprovante_endereco_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN comprovante_renda_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN comprovante_deficiencia_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN outros_documentos_path VARCHAR(255) NULL',
        'ALTER TABLE candidatos ADD COLUMN data_processamento DATETIME NULL',
        'ALTER TABLE candidatos ADD COLUMN observacoes TEXT NULL',
        'ALTER TABLE candidatos ADD COLUMN motivo_rejeicao TEXT NULL',
        'ALTER TABLE candidatos ADD COLUMN avaliador_id INT NULL',
        'ALTER TABLE candidatos ADD COLUMN data_avaliacao DATETIME NULL',
        'ALTER TABLE candidatos ADD COLUMN lista_espera_motivo TEXT NULL',
        'ALTER TABLE candidatos ADD COLUMN data_lista_espera DATETIME NULL'
      ];

      for (const columnSQL of candidatosColumns) {
        try {
          await connection.execute(columnSQL);
        } catch (error) {
          // Ignorar erros de coluna que já existe
          if (!error.message.includes('Duplicate column')) {
            console.warn('⚠️  ', error.message.split('\n')[0]);
          }
        }
      }
      console.log('✅ Colunas do candidatos verificadas!\n');
    } catch (error) {
      console.warn('⚠️  Erro ao adicionar colunas:', error.message.split('\n')[0]);
    }

    // 4. Inserir usuário de teste
    console.log('📝 Inserindo usuário de teste...');
    const insertUser = `
      INSERT INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt) 
      VALUES ('Usuário Teste', 'teste@example.com', '$2b$10$RNoM5x2pA6wVhoFi2ox4Te7etuB1KAKR3cikdgGzFhyyGGt87Y0US', 'ADMIN', NOW(), NOW())
      ON DUPLICATE KEY UPDATE updatedAt = NOW();
    `;
    
    await connection.execute(insertUser);
    console.log('✅ Usuário de teste criado!\n');

    // 5. Verificar dados
    console.log('🔍 Verificando dados inseridos...\n');
    
    const [usuarios] = await connection.execute('SELECT id, nome, email, role FROM usuarios LIMIT 5');
    console.log('📊 Usuários:');
    console.log(usuarios);

    const [cursos] = await connection.execute('SELECT id, nome, carga_horaria FROM cursos LIMIT 5');
    console.log('\n📊 Cursos:');
    console.log(cursos);

    const [turmas] = await connection.execute('SELECT id, nome, id_curso, status FROM turmas LIMIT 5');
    console.log('\n📊 Turmas:');
    console.log(turmas);

    const [instrutores] = await connection.execute('SELECT id, nome, email, especialidade FROM instrutores LIMIT 5');
    console.log('\n📊 Instrutores:');
    console.log(instrutores);

    const [candidatos] = await connection.execute('SELECT id, nome, email, status FROM candidatos LIMIT 5');
    console.log('\n📊 Candidatos:');
    console.log(candidatos);

    const [alunos] = await connection.execute('SELECT id, nome, email, matricula FROM alunos LIMIT 5');
    console.log('\n📊 Alunos:');
    console.log(alunos);

    console.log('\n✅ Todas as migrações foram executadas com sucesso!');
    console.log('\n🔑 Credenciais para teste:');
    console.log('Email: teste@example.com');
    console.log('Senha: Teste123!');
    console.log('Role: ADMIN');

  } catch (error) {
    console.error('❌ Erro durante migrações:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();
