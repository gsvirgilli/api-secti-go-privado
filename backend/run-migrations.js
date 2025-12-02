import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

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

    // Ler arquivo de criação de tabelas
    const schemaPath = path.join(process.cwd(), 'init-mysql-schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Remover a linha USE sukatechdb pois já estamos no defaultdb
    schema = schema.replace(/USE sukatechdb;/g, '');

    // Executar schema
    console.log('✅ Criando tabelas...');
    await connection.query(schema);
    console.log('✅ Tabelas criadas com sucesso!\n');

    // Inserir usuário de teste
    console.log('📝 Inserindo usuário de teste...');
    const insertUser = `
      INSERT INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt) 
      VALUES ('Usuário Teste', 'teste@example.com', '$2b$10$RNoM5x2pA6wVhoFi2ox4Te7etuB1KAKR3cikdgGzFhyyGGt87Y0US', 'ADMIN', NOW(), NOW())
      ON DUPLICATE KEY UPDATE updatedAt = NOW();
    `;
    
    await connection.execute(insertUser);
    console.log('✅ Usuário de teste criado!\n');

    // Verificar dados
    console.log('🔍 Verificando dados inseridos...\n');
    
    const [usuarios] = await connection.execute('SELECT id, nome, email, role FROM usuarios LIMIT 5');
    console.log('📊 Usuários:');
    console.log(usuarios);

    const [cursos] = await connection.execute('SELECT id, nome, carga_horaria FROM cursos LIMIT 5');
    console.log('\n📊 Cursos:');
    console.log(cursos);

    console.log('\n✅ Migrações executadas com sucesso!');
    console.log('\n🔑 Credenciais para teste:');
    console.log('Email: teste@example.com');
    console.log('Senha: Teste123!');
    console.log('Role: ADMIN');

  } catch (error) {
    console.error('❌ Erro durante migrações:', error);
  } finally {
    await connection.end();
  }
}

runMigrations();
