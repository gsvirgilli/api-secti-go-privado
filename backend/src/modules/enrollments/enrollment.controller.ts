import { Request, Response } from 'express';
import EnrollmentService from './enrollment.service.js';
import { ZodError } from 'zod';

/**
 * Controller de Matrículas
 * Responsável por lidar com requisições HTTP relacionadas a matrículas
 */
class EnrollmentController {
  /**
   * Lista todas as matrículas com filtros opcionais
   * GET /api/enrollments
   */
  async list(req: Request, res: Response) {
    try {
      const filters = req.query;
      const enrollments = await EnrollmentService.list(filters);
      
      return res.status(200).json(enrollments);
    } catch (error) {
      console.error('Erro ao listar matrículas:', error);
      return res.status(500).json({
        error: 'Erro ao listar matrículas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Busca uma matrícula específica
   * GET /api/enrollments/:id_aluno/:id_turma
   */
  async findOne(req: Request, res: Response) {
    try {
      const { id_aluno, id_turma } = req.params;
      
      const enrollment = await EnrollmentService.findOne(
        Number(id_aluno),
        Number(id_turma)
      );
      
      return res.status(200).json(enrollment);
    } catch (error) {
      if (error instanceof Error && error.message === 'Matrícula não encontrada') {
        return res.status(404).json({
          error: 'Matrícula não encontrada'
        });
      }

      console.error('Erro ao buscar matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao buscar matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Busca todas as matrículas de um aluno
   * GET /api/enrollments/student/:id_aluno
   */
  async findByStudent(req: Request, res: Response) {
    try {
      const { id_aluno } = req.params;
      
      const enrollments = await EnrollmentService.findByStudent(Number(id_aluno));
      
      return res.status(200).json(enrollments);
    } catch (error) {
      console.error('Erro ao buscar matrículas do aluno:', error);
      return res.status(500).json({
        error: 'Erro ao buscar matrículas do aluno',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Busca todas as matrículas de uma turma
   * GET /api/enrollments/class/:id_turma
   */
  async findByClass(req: Request, res: Response) {
    try {
      const { id_turma } = req.params;
      
      const enrollments = await EnrollmentService.findByClass(Number(id_turma));
      
      return res.status(200).json(enrollments);
    } catch (error) {
      console.error('Erro ao buscar matrículas da turma:', error);
      return res.status(500).json({
        error: 'Erro ao buscar matrículas da turma',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Cria uma nova matrícula
   * POST /api/enrollments
   */
  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      
      const enrollment = await EnrollmentService.create(data);
      
      return res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Aluno não encontrado') {
          return res.status(404).json({ error: error.message });
        }

        if (error.message === 'Turma não encontrada') {
          return res.status(404).json({ error: error.message });
        }

        if (error.message === 'Aluno já está matriculado nesta turma') {
          return res.status(409).json({ error: error.message });
        }

        if (error.message.includes('já possui matrícula ativa')) {
          return res.status(409).json({ error: error.message });
        }
      }

      console.error('Erro ao criar matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao criar matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Atualiza uma matrícula
   * PUT /api/enrollments/:id_aluno/:id_turma
   */
  async update(req: Request, res: Response) {
    try {
      const { id_aluno, id_turma } = req.params;
      const data = req.body;
      
      const enrollment = await EnrollmentService.update(
        Number(id_aluno),
        Number(id_turma),
        data
      );
      
      return res.status(200).json(enrollment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error && error.message === 'Matrícula não encontrada') {
        return res.status(404).json({
          error: 'Matrícula não encontrada'
        });
      }

      console.error('Erro ao atualizar matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Cancela uma matrícula
   * POST /api/enrollments/:id_aluno/:id_turma/cancel
   */
  async cancel(req: Request, res: Response) {
    try {
      const { id_aluno, id_turma } = req.params;
      
      const enrollment = await EnrollmentService.cancel(
        Number(id_aluno),
        Number(id_turma)
      );
      
      return res.status(200).json(enrollment);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Matrícula não encontrada') {
          return res.status(404).json({ error: error.message });
        }

        if (error.message === 'Matrícula já está cancelada') {
          return res.status(400).json({ error: error.message });
        }
      }

      console.error('Erro ao cancelar matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao cancelar matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Reativa uma matrícula trancada
   * PUT /api/enrollments/:id_aluno/:id_turma/reactivate
   */
  async reactivate(req: Request, res: Response) {
    try {
      const { id_aluno, id_turma } = req.params;
      
      const enrollment = await EnrollmentService.reactivate(
        Number(id_aluno),
        Number(id_turma)
      );
      
      return res.status(200).json(enrollment);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Matrícula não encontrada') {
          return res.status(404).json({ error: error.message });
        }

        if (error.message.includes('não está trancada')) {
          return res.status(400).json({ error: error.message });
        }
      }

      console.error('Erro ao reativar matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao reativar matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Transfere aluno para outra turma
   * POST /api/enrollments/:id_aluno/:id_turma/transfer
   */
  async transfer(req: Request, res: Response) {
    try {
      const { id_aluno, id_turma } = req.params;
      const { id_nova_turma } = req.body;
      
      const result = await EnrollmentService.transfer(
        Number(id_aluno),
        Number(id_turma),
        id_nova_turma
      );
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          return res.status(404).json({ error: error.message });
        }

        if (error.message.includes('não podem ser transferidas') ||
            error.message.includes('já possui matrícula')) {
          return res.status(400).json({ error: error.message });
        }
      }

      console.error('Erro ao transferir matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao transferir matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Deleta uma matrícula
   * DELETE /api/enrollments/:id_aluno/:id_turma
   */
  async delete(req: Request, res: Response) {
    try {
      const { id_aluno, id_turma } = req.params;
      
      const result = await EnrollmentService.delete(
        Number(id_aluno),
        Number(id_turma)
      );
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Matrícula não encontrada') {
        return res.status(404).json({
          error: 'Matrícula não encontrada'
        });
      }

      console.error('Erro ao deletar matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao deletar matrícula',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Retorna estatísticas de matrículas
   * GET /api/enrollments/statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await EnrollmentService.getStatistics();
      
      return res.status(200).json(statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}

export default new EnrollmentController();
