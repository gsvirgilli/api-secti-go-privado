import { sequelize } from './src/config/database.js';
import './src/modules/auth/user.model.ts';
import './src/modules/courses/course.model.ts';
import './src/modules/classes/class.model.ts';
import './src/modules/Candidates/candidate.model.ts';
import './src/modules/students/student.model.ts';

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
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
    process.exit(1);
  }
}

syncDatabase();
