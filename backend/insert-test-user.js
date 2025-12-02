import mysql from 'mysql2/promise';

async function insertTestUser() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 10530,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const query = `
      INSERT INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      'Usuário Teste',
      'teste@example.com',
      '$2b$10$RNoM5x2pA6wVhoFi2ox4Te7etuB1KAKR3cikdgGzFhyyGGt87Y0US',
      'ADMIN'
    ];

    const [result] = await connection.execute(query, values);
    
    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('Email: teste@example.com');
    console.log('Senha: Teste123!');
    console.log('Role: ADMIN');

    // Verificar se foi criado
    const [rows] = await connection.execute(
      'SELECT id, nome, email, role FROM usuarios WHERE email = ?',
      ['teste@example.com']
    );
    
    console.log('\n✅ Verificação:');
    console.log(rows);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await connection.end();
  }
}

insertTestUser();
