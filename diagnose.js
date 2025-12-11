#!/usr/bin/env node

const mysql = require('mysql2/promise');

async function diagnose() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'sukatech_user',
      password: 'sukatech_password',
      database: 'sukatechdb'
    });

    console.log('✅ Conectado ao banco de dados\n');

    // 1. Total de alunos
    const [alunos] = await conn.query('SELECT COUNT(*) as total FROM alunos');
    console.log(`📊 Total de Alunos: ${alunos[0].total}`);

    // 2. Alunos com turma_id
    const [comTurma] = await conn.query('SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NOT NULL');
    console.log(`👥 Alunos COM turma_id: ${comTurma[0].total}`);

    // 3. Alunos SEM turma_id
    const [semTurma] = await conn.query('SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NULL');
    console.log(`❌ Alunos SEM turma_id: ${semTurma[0].total}\n`);

    // 4. Listar todos os alunos com suas turmas
    const [studentList] = await conn.query(`
      SELECT 
        a.id,
        a.nome,
        a.matricula,
        a.turma_id,
        t.nome as turma_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      ORDER BY a.id
    `);
    
    console.log('📋 ALUNOS DETALHADO:');
    studentList.forEach(s => {
      const turma = s.turma_nome ? `${s.turma_nome} (ID: ${s.turma_id})` : 'SEM TURMA';
      console.log(`  - ${s.id}: ${s.nome} | Matrícula: ${s.matricula} | ${turma}`);
    });

    // 5. Total de turmas
    const [turmas] = await conn.query('SELECT COUNT(*) as total FROM turmas');
    console.log(`\n🎓 Total de Turmas: ${turmas[0].total}`);

    // 6. Turmas com contagem de alunos
    const [classesList] = await conn.query(`
      SELECT 
        t.id,
        t.nome,
        COUNT(a.id) as qtd_alunos
      FROM turmas t
      LEFT JOIN alunos a ON t.id = a.turma_id
      GROUP BY t.id, t.nome
      ORDER BY t.id
    `);

    console.log('\n📚 TURMAS COM ALUNOS:');
    classesList.forEach(c => {
      console.log(`  - ${c.id}: ${c.nome} (${c.qtd_alunos} alunos)`);
    });

    // 7. Verificar tabela matriculas
    try {
      const [matriculas] = await conn.query('SELECT COUNT(*) as total FROM matriculas');
      console.log(`\n📋 Total de registros na tabela matriculas: ${matriculas[0].total}`);
    } catch (e) {
      console.log('\n⚠️ Tabela matriculas não existe');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (conn) await conn.end();
  }
}

diagnose();
