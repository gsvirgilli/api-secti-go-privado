import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import StudentCourseController from './student-course.controller.js';

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const studentCourseRouter = Router({ mergeParams: true });

// Adicionar aluno a um curso
studentCourseRouter.post(
  '/',
  isAuthenticated,
  asyncHandler((req, res) => StudentCourseController.addStudentToCourse(req, res))
);

// Obter todos os cursos do aluno
studentCourseRouter.get(
  '/',
  isAuthenticated,
  asyncHandler((req, res) => StudentCourseController.getStudentCourses(req, res))
);

// Obter cursos com status
studentCourseRouter.get(
  '/with-status',
  isAuthenticated,
  asyncHandler((req, res) => StudentCourseController.getStudentCoursesWithStatus(req, res))
);

// Obter histórico de cursos
studentCourseRouter.get(
  '/history',
  isAuthenticated,
  asyncHandler((req, res) => StudentCourseController.getStudentCourseHistory(req, res))
);

// Marcar curso como concluído
studentCourseRouter.put(
  '/:courseId/complete',
  isAuthenticated,
  asyncHandler((req, res) => StudentCourseController.completeCourse(req, res))
);

// Remover aluno do curso (marcar como desistente)
studentCourseRouter.delete(
  '/:courseId',
  isAuthenticated,
  asyncHandler((req, res) => StudentCourseController.dropStudentFromCourse(req, res))
);

export default studentCourseRouter;
