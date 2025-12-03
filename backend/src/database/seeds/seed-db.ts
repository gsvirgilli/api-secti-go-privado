import { sequelize } from '../../config/database.js';
import '../../modules/users/user.model.js';
import '../../modules/courses/course.model.js';
import '../../modules/classes/class.model.js';
import '../../modules/Candidates/candidate.model.js';
import '../../modules/students/student.model.js';
import '../../modules/instructors/instructor.model.js';
import '../../modules/instructor_classes/instructor_class.model.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Populando banco de dados com dados iniciais...');
    
    const models = sequelize.models as any;

    // 1. Criar usuários
    console.log('👤 Criando usuários...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const instrutorPassword = await bcrypt.hash('instrutor123', 10);
    
    const [admin] = await models.User.findOrCreate({
      where: { email: 'admin@secti.com' },
      defaults: {
        nome: 'Admin Sistema',
        email: 'admin@secti.com',
        senha_hash: adminPassword,
        role: 'ADMIN'
      }
    });

    const [instrutor1] = await models.User.findOrCreate({
      where: { email: 'maria.silva@secti.com' },
      defaults: {
        nome: 'Maria Silva',
        email: 'maria.silva@secti.com',
        senha_hash: instrutorPassword,
        role: 'INSTRUTOR'
      }
    });

    const [instrutor2] = await models.User.findOrCreate({
      where: { email: 'joao.santos@secti.com' },
      defaults: {
        nome: 'João Santos',
        email: 'joao.santos@secti.com',
        senha_hash: instrutorPassword,
        role: 'INSTRUTOR'
      }
    });

    // 2. Criar instrutores
    console.log('👨‍🏫 Criando instrutores...');
    const [instrutorMaria] = await models.Instructor.findOrCreate({
      where: { cpf: '12345678901' },
      defaults: {
        cpf: '12345678901',
        nome: 'Maria Silva',
        email: 'maria.silva@secti.com',
        endereco: 'Rua das Flores, 123',
        data_nascimento: '1985-05-15',
        especialidade: 'Desenvolvimento Web',
        experiencia: '10 anos de experiência em programação',
        status: 'ATIVO'
      }
    });

    const [instrutorJoao] = await models.Instructor.findOrCreate({
      where: { cpf: '98765432100' },
      defaults: {
        cpf: '98765432100',
        nome: 'João Santos',
        email: 'joao.santos@secti.com',
        endereco: 'Av. Principal, 456',
        data_nascimento: '1990-08-22',
        especialidade: 'Banco de Dados',
        experiencia: '8 anos trabalhando com SQL e NoSQL',
        status: 'ATIVO'
      }
    });

    // 3. Criar cursos
    console.log('📚 Criando cursos...');
    const [cursoWeb] = await models.Course.findOrCreate({
      where: { nome: 'Desenvolvimento Web Full Stack' },
      defaults: {
        nome: 'Desenvolvimento Web Full Stack',
        carga_horaria: 160,
        descricao: 'Curso completo de desenvolvimento web com React, Node.js e MySQL',
        nivel: 'INTERMEDIARIO',
        status: 'ATIVO'
      }
    });

    const [cursoPython] = await models.Course.findOrCreate({
      where: { nome: 'Python para Ciência de Dados' },
      defaults: {
        nome: 'Python para Ciência de Dados',
        carga_horaria: 120,
        descricao: 'Aprenda Python aplicado a análise de dados e machine learning',
        nivel: 'INTERMEDIARIO',
        status: 'ATIVO'
      }
    });

    const [cursoMobile] = await models.Course.findOrCreate({
      where: { nome: 'Desenvolvimento Mobile com React Native' },
      defaults: {
        nome: 'Desenvolvimento Mobile com React Native',
        carga_horaria: 100,
        descricao: 'Crie aplicativos mobile para Android e iOS',
        nivel: 'AVANCADO',
        status: 'ATIVO'
      }
    });

    // 4. Criar turmas
    console.log('🎓 Criando turmas...');
    const [turmaWeb1] = await models.Class.findOrCreate({
      where: { nome: 'Turma Web 2025.1' },
      defaults: {
        nome: 'Turma Web 2025.1',
        turno: 'MANHA',
        data_inicio: new Date('2025-02-01'),
        data_fim: new Date('2025-06-30'),
        id_curso: cursoWeb.id,
        vagas: 30,
        status: 'ATIVA'
      }
    });

    const [turmaPython1] = await models.Class.findOrCreate({
      where: { nome: 'Turma Python 2025.1' },
      defaults: {
        nome: 'Turma Python 2025.1',
        turno: 'TARDE',
        data_inicio: new Date('2025-03-01'),
        data_fim: new Date('2025-06-30'),
        id_curso: cursoPython.id,
        vagas: 25,
        status: 'ATIVA'
      }
    });

    const [turmaMobile1] = await models.Class.findOrCreate({
      where: { nome: 'Turma Mobile 2025.2' },
      defaults: {
        nome: 'Turma Mobile 2025.2',
        turno: 'NOITE',
        data_inicio: new Date('2025-07-01'),
        data_fim: new Date('2025-10-31'),
        id_curso: cursoMobile.id,
        vagas: 20,
        status: 'PLANEJADA'
      }
    });

    // 5. Associar instrutores às turmas
    console.log('🔗 Associando instrutores às turmas...');
    await models.InstructorClass.findOrCreate({
      where: {
        id_instrutor: instrutorMaria.id,
        id_turma: turmaWeb1.id
      }
    });

    await models.InstructorClass.findOrCreate({
      where: {
        id_instrutor: instrutorJoao.id,
        id_turma: turmaPython1.id
      }
    });

    await models.InstructorClass.findOrCreate({
      where: {
        id_instrutor: instrutorMaria.id,
        id_turma: turmaMobile1.id
      }
    });

    // 6. Criar candidatos
    console.log('📝 Criando candidatos...');
    const [candidato1] = await models.Candidate.findOrCreate({
      where: { cpf: '11122233344' },
      defaults: {
        nome: 'Ana Costa',
        cpf: '11122233344',
        email: 'ana.costa@email.com',
        telefone: '11987654321',
        data_nascimento: new Date('2000-03-15'),
        id_turma_desejada: turmaWeb1.id,
        turma_id: turmaWeb1.id,
        status: 'APROVADO'
      }
    });

    const [candidato2] = await models.Candidate.findOrCreate({
      where: { cpf: '22233344455' },
      defaults: {
        nome: 'Carlos Oliveira',
        cpf: '22233344455',
        email: 'carlos.oliveira@email.com',
        telefone: '11976543210',
        data_nascimento: new Date('1998-07-20'),
        id_turma_desejada: turmaPython1.id,
        turma_id: turmaPython1.id,
        status: 'APROVADO'
      }
    });

    const [candidato3] = await models.Candidate.findOrCreate({
      where: { cpf: '33344455566' },
      defaults: {
        nome: 'Beatriz Santos',
        cpf: '33344455566',
        email: 'beatriz.santos@email.com',
        telefone: '11965432109',
        data_nascimento: new Date('2001-11-05'),
        id_turma_desejada: turmaWeb1.id,
        status: 'PENDENTE'
      }
    });

    // 7. Criar alunos (candidatos aprovados)
    console.log('🎒 Criando alunos...');
    await models.Student.findOrCreate({
      where: { cpf: '11122233344' },
      defaults: {
        candidato_id: candidato1.id,
        matricula: 'WEB2025001',
        cpf: '11122233344',
        nome: 'Ana Costa',
        email: 'ana.costa@email.com',
        telefone: '11987654321',
        data_nascimento: new Date('2000-03-15'),
        endereco: 'Rua A, 100 - Centro - São Paulo/SP',
        turma_id: turmaWeb1.id,
        status: 'ativo'
      }
    });

    await models.Student.findOrCreate({
      where: { cpf: '22233344455' },
      defaults: {
        candidato_id: candidato2.id,
        matricula: 'PY2025001',
        cpf: '22233344455',
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        telefone: '11976543210',
        data_nascimento: new Date('1998-07-20'),
        endereco: 'Rua B, 200 - Jardim - São Paulo/SP',
        turma_id: turmaPython1.id,
        status: 'ativo'
      }
    });

    console.log('\n✅ Banco de dados populado com sucesso!');
    console.log('📊 Resumo:');
    console.log(`  - ${await models.User.count()} usuários`);
    console.log(`  - ${await models.Instructor.count()} instrutores`);
    console.log(`  - ${await models.Course.count()} cursos`);
    console.log(`  - ${await models.Class.count()} turmas`);
    console.log(`  - ${await models.Candidate.count()} candidatos`);
    console.log(`  - ${await models.Student.count()} alunos`);
    console.log('\n🔐 Credenciais de acesso:');
    console.log('  Admin: admin@secti.com / admin123');
    console.log('  Instrutor: maria.silva@secti.com / instrutor123');
    console.log('  Instrutor: joao.santos@secti.com / instrutor123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
}

seedDatabase();
