import { Request, Response } from 'express';
import CourseService, { CourseFilters } from './course.service.js';
import { AppError } from '../../utils/AppError.js';

class CourseController {
  /**
   * Listar todos os cursos
   * GET /api/courses
   */
  async index(req: Request, res: Response) {
    try {
      const filters: CourseFilters = {};

      if (req.query.nome) {
        filters.nome = req.query.nome as string;
      }

      if (req.query.carga_horaria_min) {
        filters.carga_horaria_min = Number(req.query.carga_horaria_min);
      }

      if (req.query.carga_horaria_max) {
        filters.carga_horaria_max = Number(req.query.carga_horaria_max);
      }

      // Adicionar suporte a paginação
      if (req.query.page) {
        filters.page = Number(req.query.page);
      }

      if (req.query.limit) {
        filters.limit = Number(req.query.limit);
      }

      const courses = await CourseService.findAll(filters);

      res.json({
        success: true,
        data: courses,
        message: 'Cursos listados com sucesso'
      });
    } catch (error) {
      throw new AppError('Erro ao listar cursos', 500);
    }
  }

  /**
   * Buscar curso por ID
   * GET /api/courses/:id
   */
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const courseId = Number(id);

      if (isNaN(courseId)) {
        throw new AppError('ID do curso deve ser um número', 400);
      }

      const course = await CourseService.findById(courseId);

      res.json({
        success: true,
        data: course,
        message: 'Curso encontrado com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar curso', 500);
    }
  }

  /**
   * Criar novo curso
   * POST /api/courses
   */
  async store(req: Request, res: Response) {
    try {
      const { nome, carga_horaria, descricao } = req.body;

      // Validação básica
      if (!nome || !carga_horaria) {
        throw new AppError('Nome e carga horária são obrigatórios', 400);
      }

      const courseData = {
        nome: nome.trim(),
        carga_horaria: Number(carga_horaria),
        descricao: descricao?.trim() || undefined
      };

      const course = await CourseService.create(courseData);

      res.status(201).json({
        success: true,
        data: course,
        message: 'Curso criado com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao criar curso', 500);
    }
  }

  /**
   * Atualizar curso
   * PUT /api/courses/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const courseId = Number(id);

      if (isNaN(courseId)) {
        throw new AppError('ID do curso deve ser um número', 400);
      }

      const { nome, carga_horaria, descricao, nivel, status } = req.body;

      const updateData: any = {};

      if (nome !== undefined) {
        updateData.nome = nome.trim();
      }

      if (carga_horaria !== undefined) {
        updateData.carga_horaria = Number(carga_horaria);
      }

      if (descricao !== undefined) {
        updateData.descricao = descricao?.trim() || null;
      }

      if (nivel !== undefined) {
        updateData.nivel = nivel;
      }

      if (status !== undefined) {
        updateData.status = status;
      }

      // Verificar se há dados para atualizar
      if (Object.keys(updateData).length === 0) {
        throw new AppError('Nenhum dado fornecido para atualização', 400);
      }

      const course = await CourseService.update(courseId, updateData);

      res.json({
        success: true,
        data: course,
        message: 'Curso atualizado com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao atualizar curso', 500);
    }
  }

  /**
   * Deletar curso
   * DELETE /api/courses/:id
   */
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const courseId = Number(id);

      if (isNaN(courseId)) {
        throw new AppError('ID do curso deve ser um número', 400);
      }

      await CourseService.delete(courseId);

      res.json({
        success: true,
        message: 'Curso deletado com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao deletar curso', 500);
    }
  }

  /**
   * Obter estatísticas dos cursos
   * GET /api/courses/statistics
   */
  async statistics(req: Request, res: Response) {
    try {
      const stats = await CourseService.getStatistics();

      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas obtidas com sucesso'
      });
    } catch (error) {
      throw new AppError('Erro ao obter estatísticas', 500);
    }
  }

  /**
   * Listar todos os cursos (endpoint público)
   * GET /api/courses/public
   */
  async indexPublic(req: Request, res: Response) {
    try {
      const courses = await CourseService.findAllPublic();

      res.json({
        message: 'Cursos disponíveis',
        data: courses
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao listar cursos', 500);
    }
  }

  /**
   * Buscar curso por ID com turmas disponíveis (endpoint público)
   * GET /api/courses/:id/public
   */
  async showPublic(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const courseId = Number(id);

      if (isNaN(courseId)) {
        throw new AppError('ID do curso deve ser um número', 400);
      }

      const course = await CourseService.findByIdPublic(courseId);

      res.json({
        message: 'Curso encontrado',
        data: course
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar curso', 500);
    }
  }
}

export default new CourseController();