import type { Request, Response } from 'express';
import { StudentCourseService } from './student-course.service.js';
import { AppError } from '../../utils/AppError.js';

export class StudentCourseController {
  /**
   * Adicionar aluno a um curso
   * POST /api/students/:studentId/courses
   */
  async addStudentToCourse(req: Request, res: Response) {
    const { studentId } = req.params;
    const { courseId, turmaId } = req.body;

    if (!courseId) {
      throw new AppError('courseId é obrigatório', 400);
    }

    const result = await StudentCourseService.addStudentToCourse(
      parseInt(studentId),
      courseId,
      turmaId
    );

    return res.status(201).json({
      message: 'Aluno adicionado ao curso com sucesso',
      data: result
    });
  }

  /**
   * Remover aluno de um curso (marcar como desistente)
   * DELETE /api/students/:studentId/courses/:courseId
   */
  async dropStudentFromCourse(req: Request, res: Response) {
    const { studentId, courseId } = req.params;
    const { motivo } = req.body;

    const result = await StudentCourseService.dropStudentFromCourse(
      parseInt(studentId),
      parseInt(courseId),
      motivo
    );

    return res.json({
      message: 'Aluno removido do curso com sucesso',
      data: result
    });
  }

  /**
   * Marcar curso como concluído
   * PUT /api/students/:studentId/courses/:courseId/complete
   */
  async completeCourse(req: Request, res: Response) {
    const { studentId, courseId } = req.params;

    const result = await StudentCourseService.completeCourse(
      parseInt(studentId),
      parseInt(courseId)
    );

    return res.json({
      message: 'Curso marcado como concluído',
      data: result
    });
  }

  /**
   * Obter todos os cursos de um aluno
   * GET /api/students/:studentId/courses
   */
  async getStudentCourses(req: Request, res: Response) {
    const { studentId } = req.params;

    const courses = await StudentCourseService.getStudentCourses(
      parseInt(studentId)
    );

    return res.json({
      data: courses
    });
  }

  /**
   * Obter histórico de cursos do aluno
   * GET /api/students/:studentId/courses/history
   */
  async getStudentCourseHistory(req: Request, res: Response) {
    const { studentId } = req.params;

    const history = await StudentCourseService.getStudentCourseHistory(
      parseInt(studentId)
    );

    return res.json({
      data: history
    });
  }

  /**
   * Obter informações completas de cursos com status
   * GET /api/students/:studentId/courses-with-status
   */
  async getStudentCoursesWithStatus(req: Request, res: Response) {
    const { studentId } = req.params;

    const result = await StudentCourseService.getStudentCoursesWithStatus(
      parseInt(studentId)
    );

    return res.json({
      data: result
    });
  }
}

export default new StudentCourseController();
