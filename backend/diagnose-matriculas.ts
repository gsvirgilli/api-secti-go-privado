import { sequelize } from './src/config/database.ts';
import Student from './src/models/Student.ts';
import Turma from './src/models/Turma.ts';
import Matricula from './src/models/Matricula.ts';

async function diagnose() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // 1. Contar alunos
    const totalAlunos = await Student.count();
    console.log(`\n📊 Total de alunos: ${totalAlunos}`);

    // 2. Alunos com turma_id preenchido
    const alunosComTurma = await Student.count({
      where: sequelize.where(
        sequelize.col('turma_id'),
        sequelize.Op.not,
        null
      ),
    });
    console.log(`👥 Alunos com turma_id: ${alunosComTurma}`);
    console.log(`❌ Alunos SEM turma_id: ${totalAlunos - alunosComTurma}`);

    // 3. Ver alguns alunos
    const alunos = await Student.findAll({
      attributes: ['id', 'nome', 'email', 'turma_id'],
      limit: 5,
    });
    console.log('\n📝 Primeiros 5 alunos:');
    alunos.forEach((a) => {
      console.log(`  - ${a.nome} (turma_id: ${a.turma_id || 'NULL'})`);
    });

    // 4. Contar turmas
    const totalTurmas = await Turma.count();
    console.log(`\n🎓 Total de turmas: ${totalTurmas}`);

    // 5. Ver algumas turmas
    const turmas = await Turma.findAll({
      attributes: ['id', 'nome', 'codigo'],
      limit: 3,
    });
    console.log('\n📚 Primeiras 3 turmas:');
    turmas.forEach((t) => {
      console.log(`  - ${t.nome} (ID: ${t.id})`);
    });

    // 6. Matriculas
    const totalMatriculas = await Matricula.count().catch(() => 0);
    console.log(`\n📋 Total de registros na tabela matriculas: ${totalMatriculas}`);

    // 7. Se tem matriculas, mostrar algumas
    if (totalMatriculas > 0) {
      const matriculas = await Matricula.findAll({
        attributes: ['id', 'aluno_id', 'turma_id'],
        limit: 5,
      });
      console.log('\n🔗 Primeiras 5 matrículas:');
      matriculas.forEach((m) => {
        console.log(`  - Aluno ${m.aluno_id} -> Turma ${m.turma_id}`);
      });
    }

    console.log('\n✅ Diagnóstico completo!');
  } catch (error) {
    console.error('❌ Erro:', error instanceof Error ? error.message : error);
  } finally {
    await sequelize.close();
  }
}

diagnose();
