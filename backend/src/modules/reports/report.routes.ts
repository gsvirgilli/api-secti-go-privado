import { Router } from 'express';
import ReportController from './report.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Estatísticas do dashboard
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar
 *       - in: query
 *         name: id_curso
 *         schema:
 *           type: integer
 *         description: ID do curso para filtrar
 *       - in: query
 *         name: id_turma
 *         schema:
 *           type: integer
 *         description: ID da turma para filtrar
 *     responses:
 *       200:
 *         description: Estatísticas do dashboard
 *       401:
 *         description: Não autenticado
 */
router.get('/dashboard', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.getDashboardStats(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/students/pdf:
 *   get:
 *     summary: Gera relatório de alunos em PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_turma
 *         schema:
 *           type: integer
 *         description: ID da turma para filtrar alunos
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/students/pdf', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateStudentsPDF(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/students/excel:
 *   get:
 *     summary: Gera relatório de alunos em Excel
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_turma
 *         schema:
 *           type: integer
 *         description: ID da turma para filtrar alunos
 *     responses:
 *       200:
 *         description: Excel gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/students/excel', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateStudentsExcel(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/classes/pdf:
 *   get:
 *     summary: Gera relatório de turmas em PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_curso
 *         schema:
 *           type: integer
 *         description: ID do curso para filtrar turmas
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVA, ENCERRADA, CANCELADA]
 *         description: Status da turma
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/classes/pdf', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateClassesPDF(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/classes/excel:
 *   get:
 *     summary: Gera relatório de turmas em Excel
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_curso
 *         schema:
 *           type: integer
 *         description: ID do curso para filtrar turmas
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVA, ENCERRADA, CANCELADA]
 *         description: Status da turma
 *     responses:
 *       200:
 *         description: Excel gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/classes/excel', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateClassesExcel(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/attendance/pdf:
 *   get:
 *     summary: Gera relatório de frequência em PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_turma
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma (obrigatório)
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: ID da turma é obrigatório
 *       401:
 *         description: Não autenticado
 */
router.get('/attendance/pdf', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateAttendancePDF(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/attendance/excel:
 *   get:
 *     summary: Gera relatório de frequência em Excel
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_turma
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma (obrigatório)
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período
 *     responses:
 *       200:
 *         description: Excel gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: ID da turma é obrigatório
 *       401:
 *         description: Não autenticado
 */
router.get('/attendance/excel', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateAttendanceExcel(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/courses/pdf:
 *   get:
 *     summary: Gera relatório de cursos em PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/courses/pdf', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateCoursesPDF(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/instructors/pdf:
 *   get:
 *     summary: Gera relatório de instrutores em PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/instructors/pdf', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateInstructorsPDF(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/instructors/excel:
 *   get:
 *     summary: Gera relatório de instrutores em Excel
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autenticado
 */
router.get('/instructors/excel', isAuthenticated, async (req, res, next) => {
  try {
    await ReportController.generateInstructorsExcel(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
