import { Request, Response } from 'express';
import CandidateService from './candidate.service.js';
import {
  createCandidateSchema,
  updateCandidateSchema,
  listCandidateFiltersSchema,
  rejectCandidateSchema
} from './candidate.validator.js';
import { z } from 'zod';

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
      if (error instanceof z.ZodError) {
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
      // O middleware validateRequest já fez o parse
      const data = req.body;
      
      const candidate = await CandidateService.create(data);
      
      return res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
        error: 'Erro ao criar candidato',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
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
      // O middleware validateRequest já fez o parse
      const data = req.body;
      
      const candidate = await CandidateService.update(Number(id), data);
      
      return res.status(200).json(candidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
        error: 'Erro ao atualizar candidato',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
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
   * Aprova um candidato
   * POST /api/candidates/:id/approve
   * Body (opcional): { opcaoCurso: 1 | 2 }
   */
  async approve(req: Request, res: Response) {
    try {
  const { id } = req.params;
  // req.body may be undefined in some test setups; guard access
  const opcaoCurso = (req.body && (req.body as any).opcaoCurso) || undefined;
      
      const result = await CandidateService.approve(Number(id), opcaoCurso);
      
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

        if (error.message.includes('não há mais vagas')) {
          return res.status(400).json({
            error: error.message
          });
        }

        if (error.message.includes('turma disponível')) {
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
      // O middleware validateRequest já fez o parse
      const { motivo } = req.body;
      
      const result = await CandidateService.reject(Number(id), motivo);
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
        error: 'Erro ao rejeitar candidato',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
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

  /**
   * Cria uma candidatura pública (sem autenticação)
   * POST /api/candidates/public
   */
  async createPublic(req: Request, res: Response) {
    try {
      // Dados do formulário
      const data = req.body;
      
      // Arquivos enviados (se houver)
      const files = req.files;
      
      const candidate = await CandidateService.createPublic(data, files);
      
      return res.status(201).json({
        message: 'Candidatura enviada com sucesso',
        data: candidate
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        // Retornar a mensagem de erro completa do service
        // Isso inclui todas as validações: CPF, email, telefone, etc.
        const errorMessage = error.message;

        // Determinar o status code apropriado
        let statusCode = 500;

        if (errorMessage.includes('CPF inválido') || 
            errorMessage.includes('Verifique se digitou corretamente')) {
          statusCode = 400; // Bad Request
        } else if (
          errorMessage.includes('já possui uma inscrição') ||
          errorMessage.includes('já está cadastrado') ||
          errorMessage.includes('já foi aprovado') ||
          errorMessage.includes('Use um email diferente') ||
          errorMessage.includes('Use um telefone diferente')
        ) {
          statusCode = 409; // Conflict
        } else if (errorMessage.includes('não encontrado')) {
          statusCode = 404; // Not Found
        } else if (
          errorMessage.includes('não disponível') ||
          errorMessage.includes('não há vagas')
        ) {
          statusCode = 400; // Bad Request
        }

        return res.status(statusCode).json({
          error: errorMessage
        });
      }

      console.error('Erro ao criar candidatura pública:', error);
      return res.status(500).json({
        error: 'Erro ao processar candidatura. Tente novamente mais tarde.'
      });
    }
  }

  /**
   * Valida se CPF, email e telefone estão disponíveis
   * POST /api/candidates/validate
   */
  async validateUniqueFields(req: Request, res: Response) {
    try {
      const { cpf, email, telefone } = req.body;

      const result = await CandidateService.validateUniqueFields({
        cpf,
        email,
        telefone
      });

      if (!result.valid) {
        return res.status(409).json({
          valid: false,
          errors: result.errors
        });
      }

      return res.status(200).json({
        valid: true,
        message: 'Dados válidos'
      });
    } catch (error) {
      console.error('Erro ao validar campos únicos:', error);
      return res.status(500).json({
        error: 'Erro ao validar dados'
      });
    }
  }
}

export default new CandidateController();
