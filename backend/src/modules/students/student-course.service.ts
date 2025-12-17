import { StudentCourse } from './student-course.model.js';
import Student from './student.model.js';
import Course from '../courses/course.model.js';
import Class from '../classes/class.model.js';
import { AppError } from '../../utils/AppError.js';
import { Op } from 'sequelize';

export class StudentCourseService {
  /**
   * Adicionar um aluno a um curso
   */
  async addStudentToCourse(
    studentId: number,
    courseId: number,
    turmaId?: number
  ) {
    // Verificar se aluno e curso existem
    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new AppError('Curso não encontrado', 404);
    }

    // Verificar se turma existe (se fornecida)
    if (turmaId) {
      const turma = await Class.findByPk(turmaId);
      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }
    }

    // Verificar se já existe
    const existing = await StudentCourse.findOne({
      where: { student_id: studentId, course_id: courseId }
    });

    if (existing) {
      throw new AppError('Aluno já cadastrado neste curso', 400);
    }

    // Criar registro
    const studentCourse = await StudentCourse.create({
      student_id: studentId,
      course_id: courseId,
      turma_id: turmaId,
      status: 'Ativo',
      data_inicio: new Date()
    });

    return studentCourse;
  }

  /**
   * Remover aluno de um curso (marcar como desistente)
   */
  async dropStudentFromCourse(
    studentId: number,
    courseId: number,
    motivo?: string
  ) {
    const studentCourse = await StudentCourse.findOne({
      where: { student_id: studentId, course_id: courseId }
    });

    if (!studentCourse) {
      throw new AppError('Aluno não está cadastrado neste curso', 404);
    }

    // Marcar como desistente
    studentCourse.status = 'Desistente';
    studentCourse.motivo_desistencia = motivo || null;
    await studentCourse.save();

    return studentCourse;
  }

  /**
   * Marcar curso como concluído
   */
  async completeCourse(
    studentId: number,
    courseId: number
  ) {
    const studentCourse = await StudentCourse.findOne({
      where: { student_id: studentId, course_id: courseId }
    });

    if (!studentCourse) {
      throw new AppError('Aluno não está cadastrado neste curso', 404);
    }

    studentCourse.status = 'Concluído';
    studentCourse.data_conclusao = new Date();
    await studentCourse.save();

    return studentCourse;
  }

  /**
   * Obter todos os cursos de um aluno
   */
  async getStudentCourses(studentId: number) {
    const studentCourses = await StudentCourse.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Course,
          as: 'curso',
          attributes: ['id', 'nome', 'descricao', 'carga_horaria', 'nivel']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'data_inicio', 'data_fim']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return studentCourses;
  }

  /**
   * Obter histórico de cursos (concluídos e desistências)
   */
  async getStudentCourseHistory(studentId: number) {
    const history = await StudentCourse.findAll({
      where: {
        student_id: studentId,
        status: { [Op.in]: ['Concluído', 'Desistente'] }
      },
      include: [
        {
          model: Course,
          as: 'curso',
          attributes: ['id', 'nome', 'descricao', 'carga_horaria', 'nivel']
        }
      ],
      order: [['data_conclusao', 'DESC']]
    });

    return history;
  }

  /**
   * Calcular status automático do aluno baseado em seus cursos
   * Status geral é determinado pelo curso mais recente/importante
   */
  async calculateStudentStatus(studentId: number): Promise<'Ativo' | 'Concluído' | 'Desistente'> {
    const studentCourses = await StudentCourse.findAll({
      where: { student_id: studentId },
      order: [['createdAt', 'DESC']]
    });

    if (studentCourses.length === 0) {
      return 'Ativo'; // Padrão
    }

    // Prioridade: Ativo > Desistente > Concluído
    // Se tem algum curso ativo, está ativo
    const hasActive = studentCourses.some(sc => sc.status === 'Ativo');
    if (hasActive) return 'Ativo';

    // Se tem desistência, está desistente
    const hasDropped = studentCourses.some(sc => sc.status === 'Desistente');
    if (hasDropped) return 'Desistente';

    // Se tudo concluído, está concluído
    return 'Concluído';
  }

  /**
   * Obter informações completas de cursos do aluno para exibição
   */
  async getStudentCoursesWithStatus(studentId: number) {
    const currentCourses = await StudentCourse.findAll({
      where: {
        student_id: studentId,
        status: 'Ativo'
      },
      include: [
        {
          model: Course,
          as: 'curso',
          attributes: ['id', 'nome', 'descricao', 'carga_horaria', 'nivel']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'data_inicio', 'data_fim', 'status']
        }
      ]
    });

    const history = await this.getStudentCourseHistory(studentId);
    const overallStatus = await this.calculateStudentStatus(studentId);

    return {
      overall_status: overallStatus,
      current_courses: currentCourses,
      course_history: history
    };
  }
}

export default new StudentCourseService();
