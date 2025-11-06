import { sequelize } from '../config/database.js';
import '../modules/users/user.model.js';
import '../modules/courses/course.model.js';
import '../modules/classes/class.model.js';
import '../modules/Candidates/candidate.model.js';
import '../modules/students/student.model.js';
import '../modules/instructors/instructor.model.js';
import '../modules/instructor_classes/instructor_class.model.js';
import '../modules/enrollments/enrollment.model.js';

async function syncDatabase() {
  try {
    console.log('🔄 Sincronizando banco de dados...');
    
    // Força a recriação das tabelas (use com cuidado!)
    // Em produção, use migrations
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Banco de dados sincronizado com sucesso!');
    console.log('📋 Tabelas criadas/atualizadas:');
    console.log('  - usuarios');
    console.log('  - cursos');
    console.log('  - turmas');
    console.log('  - candidatos');
    console.log('  - alunos');
    console.log('  - instrutores');
    console.log('  - instrutor_turma (relacionamento)');
    console.log('  - matriculas');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
    process.exit(1);
  }
}

syncDatabase();
