/**
 * Arquivo centralizado para definir todas as associações entre modelos
 * Isso evita problemas de importação circular
 */

import Course from '../modules/courses/course.model.js';
import Class from '../modules/classes/class.model.js';
import Student from '../modules/students/student.model.js';
import Instructor from '../modules/instructors/instructor.model.js';
import Candidate from '../modules/Candidates/candidate.model.js';

/**
 * Define todas as associações entre modelos
 * Deve ser chamado após todos os modelos serem carregados
 */
export function setupAssociations() {
  // Curso → Turma (1:N)
  Course.hasMany(Class, {
    foreignKey: 'id_curso',
    as: 'turmas'
  });

  Class.belongsTo(Course, {
    foreignKey: 'id_curso',
    as: 'curso'
  });

  // Turma → Aluno (1:N)
  Class.hasMany(Student, {
    foreignKey: 'turma_id',
    as: 'alunos'
  });

  Student.belongsTo(Class, {
    foreignKey: 'turma_id',
    as: 'turma'
  });

  // Associação Turma ↔ Instrutor (N:M) já está definida em instructor_class.model.ts

  // Candidato → Curso (N:1) - 1ª opção
  Candidate.belongsTo(Course, {
    foreignKey: 'curso_id',
    as: 'curso'
  });

  // Candidato → Curso (N:1) - 2ª opção
  Candidate.belongsTo(Course, {
    foreignKey: 'curso_id2',
    as: 'curso2'
  });

  // Candidato → Turma (N:1) - já definida no modelo
  Candidate.belongsTo(Class, {
    foreignKey: 'turma_id',
    as: 'turma'
  });

  console.log('✅ Associações entre modelos configuradas com sucesso');
}
