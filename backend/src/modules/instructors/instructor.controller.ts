import { Request, Response } from 'express';
import InstructorService from './instructor.service.js';
import { 
  createInstructorSchema, 
  updateInstructorSchema, 
  listInstructorFiltersSchema,
  assignInstructorToClassSchema
} from './instructor.validator.js';
import * as z from 'zod';
import { AppError } from '../../utils/AppError.js';
import type { CreateInstructorData } from './instructor.types.js';

/**
 * Controller de Instrutores
 * Responsável por lidar com requisições HTTP relacionadas a instrutores
 */
class InstructorController {
  /**
   * Lista todos os instrutores com filtros opcionais
   * GET /api/instructors
   */
  async list(req: Request, res: Response) {
    try {
      const filters = listInstructorFiltersSchema.parse(req.query);
      
      const instructors = await InstructorService.list(filters);
      
      return res.status(200).json(instructors);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      console.error('Erro ao listar instrutores:', error);
      return res.status(500).json({
        error: 'Erro ao listar instrutores'
      });
    }
  }

  /**
   * Busca um instrutor por ID
   * GET /api/instructors/:id
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const instructor = await InstructorService.findById(Number(id));
      
      return res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao buscar instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao buscar instrutor'
      });
    }
  }

  /**
   * Busca um instrutor por CPF
   * GET /api/instructors/cpf/:cpf
   */
  async findByCPF(req: Request, res: Response) {
    try {
      const { cpf } = req.params;
      
      const instructor = await InstructorService.findByCPF(cpf);
      
      return res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao buscar instrutor por CPF:', error);
      return res.status(500).json({
        error: 'Erro ao buscar instrutor'
      });
    }
  }

  /**
   * Busca um instrutor por email
   * GET /api/instructors/email/:email
   */
  async findByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      const instructor = await InstructorService.findByEmail(email);
      
      return res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao buscar instrutor por email:', error);
      return res.status(500).json({
        error: 'Erro ao buscar instrutor'
      });
    }
  }

  /**
   * Cria um novo instrutor
   * POST /api/instructors
   */
  async create(req: Request, res: Response) {
    try {
      const data = createInstructorSchema.parse(req.body) as CreateInstructorData;
      
      const instructor = await InstructorService.create(data);
      
      return res.status(201).json(instructor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao criar instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao criar instrutor'
      });
    }
  }

  /**
   * Atualiza um instrutor
   * PUT /api/instructors/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('🔄 PUT /api/instructors/:id - ID:', id);
      console.log('📥 Body recebido:', JSON.stringify(req.body, null, 2));
      
      const data = updateInstructorSchema.parse(req.body);
      console.log('✅ Dados validados:', JSON.stringify(data, null, 2));
      
      const instructor = await InstructorService.update(Number(id), data);
      console.log('✅ Instrutor atualizado:', JSON.stringify(instructor, null, 2));
      
      return res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Erro de validação:', JSON.stringify(error.issues, null, 2));
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof AppError) {
        console.error('❌ AppError:', error.message);
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('❌ Erro ao atualizar instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar instrutor'
      });
    }
  }

  /**
   * Deleta um instrutor
   * DELETE /api/instructors/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await InstructorService.delete(Number(id));
      
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao deletar instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao deletar instrutor'
      });
    }
  }

  /**
   * Lista todas as turmas de um instrutor
   * GET /api/instructors/:id/classes
   */
  async getClasses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const classes = await InstructorService.getClasses(Number(id));
      
      return res.status(200).json(classes);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao listar turmas do instrutor:', error);
      return res.status(500).json({
        error: 'Erro ao listar turmas'
      });
    }
  }

  /**
   * Atribui um instrutor a uma turma
   * POST /api/instructors/:id/classes
   */
  async assignToClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = assignInstructorToClassSchema.parse(req.body);
      
      const instructorClass = await InstructorService.assignToClass(
        Number(id), 
        data.id_turma
      );
      
      return res.status(201).json(instructorClass);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao atribuir instrutor à turma:', error);
      return res.status(500).json({
        error: 'Erro ao atribuir instrutor'
      });
    }
  }

  /**
   * Desatribui um instrutor de uma turma
   * DELETE /api/instructors/:id/classes/:classId
   */
  async unassignFromClass(req: Request, res: Response) {
    try {
      const { id, classId } = req.params;
      
      await InstructorService.unassignFromClass(Number(id), Number(classId));
      
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error('Erro ao desatribuir instrutor da turma:', error);
      return res.status(500).json({
        error: 'Erro ao desatribuir instrutor'
      });
    }
  }

  /**
   * Retorna estatísticas dos instrutores
   * GET /api/instructors/statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await InstructorService.getStatistics();
      
      return res.status(200).json(statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas'
      });
    }
  }
}

export default new InstructorController();
