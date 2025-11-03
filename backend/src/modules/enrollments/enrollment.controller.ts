import { Request, Response, NextFunction } from 'express';
import EnrollmentService from './enrollment.service.js';

/**
 * Controller de Matrículas
 * Gerencia as requisições HTTP relacionadas a matrículas
 */
class EnrollmentController {
  /**
   * Lista todas as matrículas
   * GET /api/enrollments
   */
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollments = await EnrollmentService.list();
      
      return res.status(200).json({
        message: 'Matrículas listadas com sucesso',
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca uma matrícula específica
   * GET /api/enrollments/:id_aluno/:id_turma
   */
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id_aluno = parseInt(req.params.id_aluno);
      const id_turma = parseInt(req.params.id_turma);

      if (isNaN(id_aluno) || isNaN(id_turma)) {
        return res.status(400).json({
          message: 'IDs devem ser números válidos'
        });
      }

      const enrollment = await EnrollmentService.findOne(id_aluno, id_turma);
      
      return res.status(200).json({
        message: 'Matrícula encontrada',
        data: enrollment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria uma nova matrícula
   * POST /api/enrollments
   * AUTOMATICAMENTE decrementa as vagas da turma
   */
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_aluno, id_turma, status } = req.body;

      if (!id_aluno || !id_turma) {
        return res.status(400).json({
          message: 'id_aluno e id_turma são obrigatórios'
        });
      }

      const enrollment = await EnrollmentService.create({
        id_aluno,
        id_turma,
        status
      });
      
      return res.status(201).json({
        message: 'Matrícula criada com sucesso e vaga decrementada',
        data: enrollment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancela uma matrícula (soft delete)
   * PATCH /api/enrollments/:id_aluno/:id_turma/cancel
   * AUTOMATICAMENTE incrementa as vagas da turma
   */
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const id_aluno = parseInt(req.params.id_aluno);
      const id_turma = parseInt(req.params.id_turma);

      if (isNaN(id_aluno) || isNaN(id_turma)) {
        return res.status(400).json({
          message: 'IDs devem ser números válidos'
        });
      }

      const result = await EnrollmentService.cancel(id_aluno, id_turma);
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove completamente uma matrícula (hard delete)
   * DELETE /api/enrollments/:id_aluno/:id_turma
   * AUTOMATICAMENTE incrementa as vagas da turma se não estava cancelada
   */
  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id_aluno = parseInt(req.params.id_aluno);
      const id_turma = parseInt(req.params.id_turma);

      if (isNaN(id_aluno) || isNaN(id_turma)) {
        return res.status(400).json({
          message: 'IDs devem ser números válidos'
        });
      }

      const result = await EnrollmentService.delete(id_aluno, id_turma);
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista matrículas de um aluno
   * GET /api/students/:id/enrollments
   */
  async listByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id_aluno = parseInt(req.params.id);

      if (isNaN(id_aluno)) {
        return res.status(400).json({
          message: 'ID do aluno deve ser um número válido'
        });
      }

      const enrollments = await EnrollmentService.listByStudent(id_aluno);
      
      return res.status(200).json({
        message: 'Matrículas do aluno listadas com sucesso',
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista matrículas de uma turma
   * GET /api/classes/:id/enrollments
   */
  async listByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const id_turma = parseInt(req.params.id);

      if (isNaN(id_turma)) {
        return res.status(400).json({
          message: 'ID da turma deve ser um número válido'
        });
      }

      const enrollments = await EnrollmentService.listByClass(id_turma);
      
      return res.status(200).json({
        message: 'Matrículas da turma listadas com sucesso',
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EnrollmentController();
