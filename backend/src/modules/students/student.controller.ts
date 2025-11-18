import { Request, Response } from 'express';
import StudentService from './student.service.js';
import { createStudentSchema, updateStudentSchema, listStudentFiltersSchema } from './student.validator.js';
import { z } from 'zod/v4';
import type { CreateStudentData } from './student.types.js';

/**
 * Controller de Alunos
 * Responsável por lidar com requisições HTTP relacionadas a alunos
 */
class StudentController {
  /**
   * Lista todos os alunos com filtros opcionais
   * GET /api/students
   */
  async list(req: Request, res: Response) {
    try {
      const filters = listStudentFiltersSchema.parse(req.query);
      
      const students = await StudentService.list(filters);
      
      return res.status(200).json(students);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      console.error('Erro ao listar alunos:', error);
      return res.status(500).json({
        error: 'Erro ao listar alunos'
      });
    }
  }

  /**
   * Busca um aluno por ID
   * GET /api/students/:id
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const student = await StudentService.findById(Number(id));
      
      return res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error && error.message === 'Aluno não encontrado') {
        return res.status(404).json({
          error: 'Aluno não encontrado'
        });
      }

      console.error('Erro ao buscar aluno:', error);
      return res.status(500).json({
        error: 'Erro ao buscar aluno'
      });
    }
  }

  /**
   * Busca um aluno por CPF
   * GET /api/students/cpf/:cpf
   */
  async findByCPF(req: Request, res: Response) {
    try {
      const { cpf } = req.params;
      
      const student = await StudentService.findByCPF(cpf);
      
      if (!student) {
        return res.status(404).json({
          error: 'Aluno não encontrado'
        });
      }
      
      return res.status(200).json(student);
    } catch (error) {
      console.error('Erro ao buscar aluno por CPF:', error);
      return res.status(500).json({
        error: 'Erro ao buscar aluno por CPF'
      });
    }
  }

  /**
   * Busca um aluno por matrícula
   * GET /api/students/matricula/:matricula
   */
  async findByMatricula(req: Request, res: Response) {
    try {
      const { matricula } = req.params;
      
      const student = await StudentService.findByMatricula(matricula);
      
      if (!student) {
        return res.status(404).json({
          error: 'Aluno não encontrado'
        });
      }
      
      return res.status(200).json(student);
    } catch (error) {
      console.error('Erro ao buscar aluno por matrícula:', error);
      return res.status(500).json({
        error: 'Erro ao buscar aluno por matrícula'
      });
    }
  }

  /**
   * Cria um novo aluno
   * POST /api/students
   */
  async create(req: Request, res: Response) {
    try {
      const data = createStudentSchema.parse(req.body) as CreateStudentData;
      
      const student = await StudentService.create(data);
      
      return res.status(201).json({
        success: true,
        data: student,
        message: 'Aluno criado com sucesso'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error) {
        if (error.message === 'CPF já cadastrado' || error.message === 'Email já cadastrado') {
          return res.status(409).json({
            success: false,
            error: error.message
          });
        }
      }

      console.error('Erro ao criar aluno:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar aluno'
      });
    }
  }

  /**
   * Atualiza um aluno existente
   * PUT /api/students/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateStudentSchema.parse(req.body);
      
      const student = await StudentService.update(Number(id), data);
      
      return res.status(200).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues
        });
      }

      if (error instanceof Error && error.message === 'Aluno não encontrado') {
        return res.status(404).json({
          error: 'Aluno não encontrado'
        });
      }

      console.error('Erro ao atualizar aluno:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar aluno'
      });
    }
  }

  /**
   * Deleta um aluno
   * DELETE /api/students/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await StudentService.delete(Number(id));
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Aluno não encontrado') {
        return res.status(404).json({
          error: 'Aluno não encontrado'
        });
      }

      console.error('Erro ao deletar aluno:', error);
      return res.status(500).json({
        error: 'Erro ao deletar aluno'
      });
    }
  }

  /**
   * Transfere um aluno para lista de espera
   * POST /api/students/:id/transfer-to-waiting-list
   */
  async transferToWaitingList(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      
      const result = await StudentService.transferToWaitingList(Number(id), motivo);
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Aluno não encontrado') {
          return res.status(404).json({
            error: 'Aluno não encontrado'
          });
        }
        
        if (error.message.includes('não possui candidatura vinculada') || 
            error.message.includes('Candidatura vinculada não encontrada')) {
          return res.status(400).json({
            error: error.message
          });
        }
      }

      console.error('Erro ao transferir aluno para lista de espera:', error);
      return res.status(500).json({
        error: 'Erro ao transferir aluno para lista de espera'
      });
    }
  }

  /**
   * Retorna estatísticas de alunos
   * GET /api/students/statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const statistics = await StudentService.getStatistics();
      
      return res.status(200).json(statistics);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas'
      });
    }
  }
}

export default new StudentController();
