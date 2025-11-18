import { Request, Response, NextFunction } from 'express';
import AttendanceService from './attendance.service.js';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  bulkAttendanceSchema,
  attendanceFiltersSchema
} from './attendance.validator.js';
import { z,ZodError } from 'zod';

/**
 * Controller de Presenças
 * Gerencia requisições HTTP relacionadas a presenças
 */
class AttendanceController {
  /**
   * Lista todas as presenças com filtros opcionais
   * GET /api/attendances
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = attendanceFiltersSchema.parse(req.query);
      
      const attendances = await AttendanceService.list(filters);
      
      return res.status(200).json(attendances);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }
      next(error);
    }
  }

  /**
   * Busca uma presença por ID
   * GET /api/attendances/:id
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const attendance = await AttendanceService.findById(Number(id));
      
      return res.status(200).json(attendance);
    } catch (error) {
      if (error instanceof Error && error.message === 'Registro de presença não encontrado') {
        return res.status(404).json({
          error: 'Registro de presença não encontrado'
        });
      }
      next(error);
    }
  }

  /**
   * Registra uma presença individual
   * POST /api/attendances
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createAttendanceSchema.parse(req.body);
      
      const attendance = await AttendanceService.create(data as any);
      
      return res.status(201).json({
        message: 'Presença registrada com sucesso',
        data: attendance
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Aluno não encontrado') {
          return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        if (error.message === 'Turma não encontrada') {
          return res.status(404).json({ error: 'Turma não encontrada' });
        }
        if (error.message === 'Aluno não está matriculado nesta turma') {
          return res.status(400).json({ error: 'Aluno não está matriculado nesta turma' });
        }
        if (error.message.includes('Já existe registro de presença')) {
          return res.status(409).json({ error: error.message });
        }
      }

      next(error);
    }
  }

  /**
   * Registra presenças em lote para uma turma
   * POST /api/attendances/bulk
   */
  async createBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const data = bulkAttendanceSchema.parse(req.body);
      
      const attendances = await AttendanceService.createBulk(data as any);
      
      return res.status(201).json({
        message: 'Presenças registradas com sucesso',
        total: attendances.length,
        data: attendances
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message.includes('não encontrado') || error.message.includes('não está matriculado')) {
          return res.status(400).json({ error: error.message });
        }
      }

      next(error);
    }
  }

  /**
   * Atualiza o status de uma presença
   * PATCH /api/attendances/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = updateAttendanceSchema.parse(req.body);
      
      const attendance = await AttendanceService.update(Number(id), status);
      
      return res.status(200).json({
        message: 'Presença atualizada com sucesso',
        data: attendance
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error && error.message === 'Registro de presença não encontrado') {
        return res.status(404).json({
          error: 'Registro de presença não encontrado'
        });
      }

      next(error);
    }
  }

  /**
   * Remove um registro de presença
   * DELETE /api/attendances/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const result = await AttendanceService.delete(Number(id));
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Registro de presença não encontrado') {
        return res.status(404).json({
          error: 'Registro de presença não encontrado'
        });
      }
      next(error);
    }
  }

  /**
   * Obtém estatísticas de presença de um aluno em uma turma
   * GET /api/attendances/stats/:id_aluno/:id_turma
   */
  async getStudentStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_aluno, id_turma } = req.params;
      
      const stats = await AttendanceService.getStudentStats(
        Number(id_aluno),
        Number(id_turma)
      );
      
      return res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém relatório de presenças de uma turma em uma data específica
   * GET /api/attendances/report/:id_turma/:data
   */
  async getClassReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_turma, data } = req.params;
      
      const report = await AttendanceService.getClassReport(
        Number(id_turma),
        new Date(data)
      );
      
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
