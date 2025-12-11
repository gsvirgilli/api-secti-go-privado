import { sequelize } from './backend/src/config/database.js';
import Student from './backend/src/modules/students/student.model.js';
import Class from './backend/src/modules/classes/class.model.js';
import Enrollment from './backend/src/modules/enrollments/enrollment.model.js';
import { setupAssociations } from './backend/src/models/associations.js';

async function diagnose() {
  try {
    // Configurar associações
    setupAssociations();

    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados\n');

    // Verificar dados
    const totalStudents = await Student.count();
    const studentsWithTurmaId = await Student.count({ where: { turma_id: { [sequelize.Sequelize.Op.ne]: null } } });
    const totalEnrollments = await Enrollment.count();
    const totalClasses = await Class.count();

    console.log('📊 DIAGNÓSTICO DE DADOS:');
    console.log(`Total de Alunos: ${totalStudents}`);
    console.log(`Alunos com turma_id: ${studentsWithTurmaId}`);
    console.log(`Total de Matrículas: ${totalEnrollments}`);
    console.log(`Total de Turmas: ${totalClasses}\n`);

    // Listar todos os alunos
    console.log('📋 ALUNOS:');
    const students = await Student.findAll({
      attributes: ['id', 'nome', 'turma_id'],
      order: [['id', 'ASC']]
    });
    students.forEach(s => {
      const data = s.toJSON() as any;
      console.log(`  - ${data.id}: ${data.nome} (turma_id: ${data.turma_id || 'NULL'})`);
    });

    console.log('\n📋 TURMAS:');
    const classes = await Class.findAll({
      attributes: ['id', 'nome'],
      order: [['id', 'ASC']]
    });
    classes.forEach(c => {
      const data = c.toJSON() as any;
      console.log(`  - ${data.id}: ${data.nome}`);
    });

    console.log('\n📋 MATRÍCULAS:');
    const enrollments = await Enrollment.findAll({
      attributes: ['id_aluno', 'id_turma', 'status'],
      order: [['id_aluno', 'ASC']]
    });
    enrollments.forEach(e => {
      const data = e.toJSON() as any;
      console.log(`  - Aluno ${data.id_aluno} → Turma ${data.id_turma} (${data.status})`);
    });

    // Testar a query de turmas com alunos
    console.log('\n🔍 TURMAS COM ALUNOS (usando turma_id):');
    const classesWithStudents = await Class.findAll({
      include: [
        {
          model: Student,
          as: 'alunos',
          attributes: ['id', 'nome'],
          required: false
        }
      ],
      order: [['id', 'ASC']]
    });
    classesWithStudents.forEach(c => {
      const data = c.toJSON() as any;
      console.log(`  - ${data.nome}: ${data.alunos?.length || 0} alunos`);
      if (data.alunos?.length) {
        data.alunos.forEach((a: any) => {
          console.log(`    * ${a.nome}`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

diagnose();
