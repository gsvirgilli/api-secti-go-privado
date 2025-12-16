import sequelize from './backend/src/config/database.js';
import { Class, Enrollment, Student } from './backend/src/models/index.js';

(async () => {
  try {
    console.log('🔍 Investigando matrículas...\n');

    // Encontrar turma BD
    const turma = await Class.findOne({ 
      where: { nome: 'BD - Turma A' },
      raw: true
    });
    
    if (!turma) {
      console.log('❌ Turma não encontrada');
      process.exit(0);
    }

    console.log('✅ Turma encontrada:');
    console.log(`   ID: ${turma.id}, Nome: ${turma.nome}\n`);

    // Listar TODAS as matrículas (sem filtro) para ver se tem dados
    const todasMatriculas = await Enrollment.count();
    console.log(`📊 Total de matrículas no banco: ${todasMatriculas}\n`);

    // Contar matrículas para essa turma específica
    const count = await Enrollment.count({
      where: { id_turma: turma.id }
    });

    console.log(`📊 Matrículas para turma ID ${turma.id}: ${count}\n`);

    // Listar todas as matrículas da turma
    const matriculas = await Enrollment.findAll({
      where: { id_turma: turma.id },
      raw: true
    });

    console.log('📋 Matrículas listadas:', matriculas);

    // Ver quais turmas têm matrículas
    console.log('\n🔍 Turmas com matrículas:');
    const turmasComMatriculas = await sequelize.query(
      `SELECT DISTINCT t.id, t.nome, COUNT(m.id) as total_matriculas
       FROM turmas t
       LEFT JOIN matriculas m ON t.id = m.id_turma
       GROUP BY t.id, t.nome
       HAVING COUNT(m.id) > 0
       ORDER BY total_matriculas DESC`,
      { type: 'SELECT' }
    );
    
    console.log(turmasComMatriculas);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
})();
