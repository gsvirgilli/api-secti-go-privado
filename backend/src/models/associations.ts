/**
 * Arquivo centralizado para definir todas as associações entre modelos
 * Isso evita problemas de importação circular
 */

import Course from '../modules/courses/course.model.js';
import Class from '../modules/classes/class.model.js';
import Student from '../modules/students/student.model.js';
import Instructor from '../modules/instructors/instructor.model.js';
import Candidate from '../modules/Candidates/candidate.model.js';
import InstructorClass from '../modules/instructor_classes/instructor_class.model.js';
import { StudentCourse } from '../modules/students/student-course.model.js';

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

  // Associação Turma ↔ Instrutor (N:M)
  Instructor.belongsToMany(Class, {
    through: InstructorClass,
    foreignKey: 'id_instrutor',
    otherKey: 'id_turma',
    as: 'turmas_instrutor'
  });

  Class.belongsToMany(Instructor, {
    through: InstructorClass,
    foreignKey: 'id_turma',
    otherKey: 'id_instrutor',
    as: 'instrutores'
  });

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

  // Aluno ↔ Curso (N:M) - através de StudentCourse
  Student.belongsToMany(Course, {
    through: StudentCourse,
    foreignKey: 'student_id',
    otherKey: 'course_id',
    as: 'cursos'
  });

  Course.belongsToMany(Student, {
    through: StudentCourse,
    foreignKey: 'course_id',
    otherKey: 'student_id',
    as: 'alunos_historico'
  });

  // StudentCourse associations
  StudentCourse.belongsTo(Student, {
    foreignKey: 'student_id',
    as: 'aluno'
  });

  StudentCourse.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'curso'
  });

  StudentCourse.belongsTo(Class, {
    foreignKey: 'turma_id',
    as: 'turma'
  });

  Student.hasMany(StudentCourse, {
    foreignKey: 'student_id',
    as: 'student_courses'
  });

  Course.hasMany(StudentCourse, {
    foreignKey: 'course_id',
    as: 'student_courses'
  });

  console.log('✅ Associações entre modelos configuradas com sucesso');
}
