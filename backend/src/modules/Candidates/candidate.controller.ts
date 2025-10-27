import { Request, Response } from 'express';
import CandidateService from './candidate.service.js';
import {
  createCandidateSchema,
  updateCandidateSchema,
  listCandidateFiltersSchema,
  rejectCandidateSchema
} from './candidate.validator.js';
import { ZodError } from 'zod';

/**
 * Controller de Candidatos
 * Responsável por lidar com requisições HTTP relacionadas a candidatos
 */
class CandidateController {
  /**
   * Lista todos os candidatos com filtros opcionais
   * GET /api/candidates
   */
  async list(req: Request, res: Response) {
    try {
      const filters = listCandidateFiltersSchema.parse(req.query);
      
      const candidates = await CandidateService.list(filters);
      
      return res.status(200).json(candidates);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      console.error('Erro ao listar candidatos:', error);
      return res.status(500).json({
        error: 'Erro ao listar candidatos'
      });
    }
  }

  /**
   * Busca um candidato por ID
   * GET /api/candidates/:id
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const candidate = await CandidateService.findById(Number(id));
      
      return res.status(200).json(candidate);
    } catch (error) {
      if (error instanceof Error && error.message === 'Candidato não encontrado') {
        return res.status(404).json({
          error: 'Candidato não encontrado'
        });
      }

      console.error('Erro ao buscar candidato:', error);
      return res.status(500).json({
        error: 'Erro ao buscar candidato'
      });
    }
  }

  /**
   * Cria um novo candidato
   * POST /api/candidates
   */
  async create(req: Request, res: Response) {
    try {
      // Parse apenas do body, sem wrapping
      const candidateSchema = createCandidateSchema.shape.body;
      const data = candidateSchema.parse(req.body);
      
      const candidate = await CandidateService.create(data);
      
      return res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'CPF inválido') {
          return res.status(400).json({
            error: 'CPF inválido'
          });
        }

        if (error.message === 'CPF já cadastrado como candidato' || 
            error.message === 'CPF já cadastrado como aluno') {
          return res.status(409).json({
            error: error.message
          });
        }

        if (error.message === 'Turma não encontrada') {
          return res.status(404).json({
            error: 'Turma não encontrada'
          });
        }
      }

      console.error('Erro ao criar candidato:', error);
      return res.status(500).json({
        error: 'Erro ao criar candidato'
      });
    }
  }

  /**
   * Atualiza um candidato existente
   * PUT /api/candidates/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateSchema = updateCandidateSchema.shape.body;
      const data = updateSchema.parse(req.body);
      
      const candidate = await CandidateService.update(Number(id), data);
      
      return res.status(200).json(candidate);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Candidato não encontrado') {
          return res.status(404).json({
            error: 'Candidato não encontrado'
          });
        }

        if (error.message === 'Não é possível alterar status de candidato aprovado') {
          return res.status(400).json({
            error: error.message
          });
        }

        if (error.message === 'Turma não encontrada') {
          return res.status(404).json({
            error: 'Turma não encontrada'
          });
        }
      }

      console.error('Erro ao atualizar candidato:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar candidato'
      });
    }
  }

  /**
   * Deleta um candidato
   * DELETE /api/candidates/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await CandidateService.delete(Number(id));
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Candidato não encontrado') {
          return res.status(404).json({
            error: 'Candidato não encontrado'
          });
        }

        if (error.message.includes('Não é possível deletar candidato aprovado')) {
          return res.status(400).json({
            error: error.message
          });
        }
      }

      console.error('Erro ao deletar candidato:', error);
      return res.status(500).json({
        error: 'Erro ao deletar candidato'
      });
    }
  }

  /**
   * Aprova candidato e converte em aluno
   * POST /api/candidates/:id/approve
   */
  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await CandidateService.approve(Number(id));
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Candidato não encontrado') {
          return res.status(404).json({
            error: 'Candidato não encontrado'
          });
        }

        if (error.message === 'Candidato já foi aprovado') {
          return res.status(400).json({
            error: error.message
          });
        }
      }

      console.error('Erro ao aprovar candidato:', error);
      return res.status(500).json({
        error: 'Erro ao aprovar candidato'
      });
    }
  }

  /**
   * Rejeita candidato
   * POST /api/candidates/:id/reject
   */
  async reject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rejectSchema = rejectCandidateSchema.shape.body;
      const data = rejectSchema.parse(req.body);
      
      const result = await CandidateService.reject(Number(id), data.motivo);
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Candidato não encontrado') {
          return res.status(404).json({
            error: 'Candidato não encontrado'
          });
        }

        if (error.message === 'Não é possível rejeitar candidato aprovado') {
          return res.status(400).json({
            error: error.message
          });
        }
      }

      console.error('Erro ao rejeitar candidato:', error);
      return res.status(500).json({
        error: 'Erro ao rejeitar candidato'
      });
    }
  }

  /**
   * Retorna estatísticas de candidatos
   * GET /api/candidates/statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await CandidateService.getStatistics();
      
      return res.status(200).json(statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas'
      });
    }
  }
}

export default new CandidateController();
