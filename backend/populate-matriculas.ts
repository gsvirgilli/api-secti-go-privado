/**
 * Script para popular matrículas dos alunos existentes que não têm matrícula
 */

import Student from './src/modules/students/student.model';
import { sequelize } from './src/config/database';
import { Op } from 'sequelize';

async function generateMatricula(index: number): Promise<string> {
  const year = new Date().getFullYear();
  const sequence = (index + 1).toString().padStart(4, '0');
  return `${year}${sequence}`;
}

async function populateMatriculas() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado!');

    console.log('\n📝 Buscando alunos sem matrícula...');
    const studentsWithoutMatricula = await Student.findAll({
      where: {
        matricula: null
      },
      order: [['id', 'ASC']]
    });

    if (studentsWithoutMatricula.length === 0) {
      console.log('✅ Todos os alunos já possuem matrícula!');
      process.exit(0);
    }

    console.log(`📊 Encontrados ${studentsWithoutMatricula.length} alunos sem matrícula`);
    
    // Buscar o último número de matrícula existente
    const lastStudent = await Student.findOne({
      where: {
        matricula: {
          [Op.ne]: null
        }
      },
      order: [['matricula', 'DESC']]
    });

    let startIndex = 0;
    if (lastStudent?.matricula) {
      // Extrair o número sequencial da última matrícula (ex: 20250001 -> 1)
      const lastSequence = parseInt(lastStudent.matricula.slice(-4));
      startIndex = lastSequence;
      console.log(`📌 Última matrícula encontrada: ${lastStudent.matricula} (sequência: ${lastSequence})`);
    }

    console.log('\n🔄 Populando matrículas...');
    for (let i = 0; i < studentsWithoutMatricula.length; i++) {
      const student = studentsWithoutMatricula[i];
      const matricula = await generateMatricula(startIndex + i);
      
      await student.update({ matricula });
      console.log(`  ✅ ${student.nome} -> ${matricula}`);
    }

    console.log('\n✅ Matrículas populadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular matrículas:', error);
    process.exit(1);
  }
}

populateMatriculas();
