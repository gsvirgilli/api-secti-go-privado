import { sequelize } from './backend/src/config/database.js';
import Student from './backend/src/modules/students/student.model.js';
import Class from './backend/src/modules/classes/class.model.js';
import Enrollment from './backend/src/modules/enrollments/enrollment.model.js';

async function check() {
  try {
    console.log('🔍 DIAGNÓSTICO DE MATRÍCULAS\n');
    
    // Contar alunos
    const totalStudents = await Student.count();
    console.log(`📊 Total de alunos: ${totalStudents}`);
    
    // Alunos com turma_id preenchido
    const studentsWithTurmaId = await Student.findAll({
      where: { turma_id: { [require('sequelize').Op.ne]: null } },
      attributes: ['id', 'nome', 'turma_id']
    });
    console.log(`\n✅ Alunos com turma_id preenchido: ${studentsWithTurmaId.length}`);
    studentsWithTurmaId.forEach(s => {
      console.log(`   - ${s.toJSON().nome} → turma ${s.toJSON().turma_id}`);
    });
    
    // Contar turmas
    const totalClasses = await Class.count();
    console.log(`\n📊 Total de turmas: ${totalClasses}`);
    
    // Contar matrículas na tabela matriculas
    const totalEnrollments = await Enrollment.count();
    console.log(`\n📊 Total de matrículas (tabela matriculas): ${totalEnrollments}`);
    
    if (totalEnrollments > 0) {
      const enrollments = await Enrollment.findAll({
        include: [
          { model: Student, as: 'aluno', attributes: ['nome'] },
          { model: Class, as: 'turma', attributes: ['nome'] }
        ]
      });
      console.log('\nMatrículas encontradas:');
      enrollments.forEach(e => {
        const data = e.toJSON() as any;
        console.log(`   - ${data.aluno?.nome} → ${data.turma?.nome}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('RESUMO:');
    console.log(`- ${studentsWithTurmaId.length}/${totalStudents} alunos com turma_id`);
    console.log(`- ${totalEnrollments} matrículas na tabela`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
}

check();
