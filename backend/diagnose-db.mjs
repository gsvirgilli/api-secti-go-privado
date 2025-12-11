import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'secti_db',
});

try {
  // 1. Total de alunos
  const [alunos] = await connection.query('SELECT COUNT(*) as total FROM alunos');
  console.log(`📊 Total de alunos: ${alunos[0].total}`);

  // 2. Alunos com turma_id
  const [comTurma] = await connection.query('SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NOT NULL');
  const [semTurma] = await connection.query('SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NULL');
  console.log(`👥 Com turma_id: ${comTurma[0].total}`);
  console.log(`❌ Sem turma_id: ${semTurma[0].total}`);

  // 3. Mostrar alguns alunos
  const [alguns] = await connection.query(
    'SELECT id, nome, email, turma_id FROM alunos LIMIT 5'
  );
  console.log('\n📝 Primeiros 5 alunos:');
  alguns.forEach(a => {
    console.log(`  - ${a.nome} (turma_id: ${a.turma_id || 'NULL'})`);
  });

  // 4. Total de turmas
  const [turmas] = await connection.query('SELECT COUNT(*) as total FROM turmas');
  console.log(`\n🎓 Total de turmas: ${turmas[0].total}`);

  // 5. Algumas turmas
  const [turmasAmostra] = await connection.query(
    'SELECT id, nome, codigo FROM turmas LIMIT 3'
  );
  console.log('\n📚 Primeiras 3 turmas:');
  turmasAmostra.forEach(t => {
    console.log(`  - ${t.nome} (ID: ${t.id})`);
  });

  // 6. Verificar tabela matriculas
  try {
    const [matriculas] = await connection.query('SELECT COUNT(*) as total FROM matriculas');
    console.log(`\n📋 Total de registros na tabela matriculas: ${matriculas[0].total}`);
    
    if (matriculas[0].total > 0) {
      const [amostra] = await connection.query(
        'SELECT id, aluno_id, turma_id FROM matriculas LIMIT 5'
      );
      console.log('\n🔗 Primeiras 5 matrículas:');
      amostra.forEach(m => {
        console.log(`  - Aluno ${m.aluno_id} -> Turma ${m.turma_id}`);
      });
    }
  } catch (e) {
    console.log('\n⚠️ Tabela matriculas não existe ou está vazia');
  }

  console.log('\n✅ Diagnóstico completo!');
} catch (error) {
  console.error('❌ Erro:', error);
} finally {
  await connection.end();
}
