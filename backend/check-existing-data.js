import sequelize from './src/config/database.js';
import Candidate from './src/modules/Candidates/candidate.model.js';
import Student from './src/modules/students/student.model.js';

console.log('🔍 Verificando dados existentes no banco...\n');

try {
  await sequelize.authenticate();
  
  // Buscar candidatos
  const candidatos = await Candidate.findAll({
    attributes: ['cpf', 'nome', 'email', 'telefone'],
    limit: 5
  });
  
  console.log('📋 CANDIDATOS CADASTRADOS:');
  candidatos.forEach(c => {
    console.log(`  CPF: ${c.cpf} | Nome: ${c.nome} | Email: ${c.email}`);
  });
  
  // Buscar alunos
  const alunos = await Student.findAll({
    attributes: ['cpf', 'nome', 'email', 'telefone'],
    limit: 5
  });
  
  console.log('\n👨‍🎓 ALUNOS CADASTRADOS:');
  alunos.forEach(a => {
    console.log(`  CPF: ${a.cpf} | Nome: ${a.nome} | Email: ${a.email}`);
  });
  
  process.exit(0);
} catch (error) {
  console.error('Erro:', error);
  process.exit(1);
}
