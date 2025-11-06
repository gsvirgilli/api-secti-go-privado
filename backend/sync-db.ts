import { sequelize } from './src/config/database.js';
import './src/modules/users/user.model.js';
import './src/modules/courses/course.model.js';
import './src/modules/classes/class.model.js';
import './src/modules/Candidates/candidate.model.js';
import './src/modules/students/student.model.js';
import './src/modules/instructors/instructor.model.js';
import './src/modules/instructor_classes/instructor_class.model.js';

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
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
    process.exit(1);
  }
}

syncDatabase();
