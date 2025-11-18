import { Request, Response } from 'express';
import ClassService from './class.service.js';
import { 
  createClassSchema, 
  updateClassSchema, 
  listClassFiltersSchema,
  updateClassStatusSchema
} from './class.validator.js';
import { ZodError } from 'zod';
import type { CreateClassData } from './class.types.js';

/**
 * Controller de Turmas
 * Responsável por lidar com requisições HTTP relacionadas a turmas
 */
class ClassController {
  /**
   * Lista todas as turmas com filtros opcionais
   * GET /api/classes
   */
  async list(req: Request, res: Response) {
    try {
      // Validar query params
      const filters = listClassFiltersSchema.parse(req.query);
      
      const turmas = await ClassService.list(filters);
      
      return res.status(200).json(turmas);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      console.error('Erro ao listar turmas:', error);
      return res.status(500).json({
        error: 'Erro ao listar turmas'
      });
    }
  }

  /**
   * Busca uma turma por ID
   * GET /api/classes/:id
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const turma = await ClassService.findById(Number(id));
      
      return res.status(200).json(turma);
    } catch (error) {
      if (error instanceof Error && error.message === 'Turma não encontrada') {
        return res.status(404).json({
          error: 'Turma não encontrada'
        });
      }

      console.error('Erro ao buscar turma:', error);
      return res.status(500).json({
        error: 'Erro ao buscar turma'
      });
    }
  }

  /**
   * Cria uma nova turma
   * POST /api/classes
   */
  async create(req: Request, res: Response) {
    try {
      // Validar dados
      const data = createClassSchema.parse(req.body) as CreateClassData;
      
      const turma = await ClassService.create(data);
      
      return res.status(201).json(turma);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Curso não encontrado') {
          return res.status(404).json({
            error: 'Curso não encontrado'
          });
        }

        if (error.message.includes('Data de fim')) {
          return res.status(400).json({
            error: error.message
          });
        }
      }

      console.error('Erro ao criar turma:', error);
      return res.status(500).json({
        error: 'Erro ao criar turma'
      });
    }
  }

  /**
   * Atualiza uma turma existente
   * PUT /api/classes/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Validar dados
      const data = updateClassSchema.parse(req.body);
      
      const turma = await ClassService.update(Number(id), data);
      
      return res.status(200).json(turma);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Turma não encontrada') {
          return res.status(404).json({
            error: 'Turma não encontrada'
          });
        }

        if (error.message === 'Curso não encontrado') {
          return res.status(404).json({
            error: 'Curso não encontrado'
          });
        }

        if (error.message.includes('Data de fim')) {
          return res.status(400).json({
            error: error.message
          });
        }
      }

      console.error('Erro ao atualizar turma:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar turma'
      });
    }
  }

  /**
   * Deleta uma turma
   * DELETE /api/classes/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await ClassService.delete(Number(id));
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Turma não encontrada') {
          return res.status(404).json({ error: 'Turma não encontrada' });
        }

        // Mensagem específica de negócio (vínculos) -> 400 Bad Request
        if (error.message.includes('Não é possível deletar turma')) {
          return res.status(400).json({ error: error.message });
        }
      }

      console.error('Erro ao deletar turma:', error);
      return res.status(500).json({ error: 'Erro ao deletar turma' });
    }
  }

  /**
   * Retorna estatísticas de turmas
   * GET /api/classes/statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await ClassService.getStatistics();
      
      return res.status(200).json(statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas'
      });
    }
  }

  /**
   * Verifica conflito de horário
   * POST /api/classes/check-conflict
   */
  async checkConflict(req: Request, res: Response) {
    try {
      const data = createClassSchema.parse(req.body);
      const { excludeId } = req.query;
      
      const hasConflict = await ClassService.checkConflict(
        data,
        excludeId ? Number(excludeId) : undefined
      );
      
      return res.status(200).json({
        hasConflict
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      console.error('Erro ao verificar conflito:', error);
      return res.status(500).json({
        error: 'Erro ao verificar conflito'
      });
    }
  }

  /**
   * Altera o status de uma turma
   * PATCH /api/classes/:id/status
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateClassStatusSchema.parse(req.body);
      
      const turma = await ClassService.updateStatus(Number(id), data.status);
      
      return res.status(200).json(turma);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message
        });
      }

      console.error('Erro ao atualizar status da turma:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar status da turma'
      });
    }
  }

  /**
   * Associa um instrutor a uma turma
   * POST /api/classes/:id/instructors/:instructorId
   */
  async addInstructor(req: Request, res: Response) {
    try {
      const { id, instructorId } = req.params;
      
      const result = await ClassService.addInstructor(Number(id), Number(instructorId));
      
      return res.status(200).json({
        success: true,
        message: 'Instrutor associado com sucesso',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message
        });
      }

      console.error('Erro ao associar instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao associar instrutor'
      });
    }
  }

  /**
   * Remove um instrutor de uma turma
   * DELETE /api/classes/:id/instructors/:instructorId
   */
  async removeInstructor(req: Request, res: Response) {
    try {
      const { id, instructorId } = req.params;
      
      await ClassService.removeInstructor(Number(id), Number(instructorId));
      
      return res.status(200).json({
        success: true,
        message: 'Instrutor removido com sucesso'
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message
        });
      }

      console.error('Erro ao remover instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao remover instrutor'
      });
    }
  }
}

export default new ClassController();
