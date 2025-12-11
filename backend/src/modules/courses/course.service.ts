import Course, { CourseAttributes, CourseCreationAttributes } from './course.model.js';
import Class from '../classes/class.model.js';
import Student from '../students/student.model.js';
import { AppError } from '../../utils/AppError.js';
import { Op } from 'sequelize';
import { 
  PaginatedResponse, 
  calculateOffset, 
  createPagination, 
  normalizePagination 
} from '../../utils/pagination.js';

export interface CourseFilters {
  nome?: string;
  carga_horaria_min?: number;
  carga_horaria_max?: number;
  status?: string;
  page?: number;
  limit?: number;
}

class CourseService {
  /**
   * Buscar todos os cursos com filtros opcionais e paginação
   * ✅ Otimizado: Skip COUNT para evitar timeout, use índices
   */
  async findAll(filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> {
    const whereClause: any = {};

    // Extrair parâmetros de paginação
    const { page, limit } = normalizePagination({
      page: filters.page,
      limit: filters.limit
    });

    // Filtro por nome (busca parcial)
    if (filters.nome) {
      whereClause.nome = {
        [Op.like]: `%${filters.nome}%`
      };
    }

    // Filtro por carga horária
    if (filters.carga_horaria_min || filters.carga_horaria_max) {
      whereClause.carga_horaria = {};
      
      if (filters.carga_horaria_min) {
        whereClause.carga_horaria[Op.gte] = filters.carga_horaria_min;
      }
      
      if (filters.carga_horaria_max) {
        whereClause.carga_horaria[Op.lte] = filters.carga_horaria_max;
      }
    }

    // Filtro por status
    if (filters.status) {
      whereClause.status = filters.status;
    }

    // ✅ Buscar cursos com paginação - sem COUNT para melhor performance
    const data = await Course.findAll({
      where: whereClause,
      attributes: ['id', 'nome', 'carga_horaria', 'descricao', 'nivel', 'status', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Class,
          as: 'turmas',
          attributes: ['id', 'nome', 'turno', 'vagas', 'status'],
          include: [
            {
              model: Student,
              as: 'alunos',
              attributes: ['id', 'nome', 'matricula', 'email', 'status'],
              required: false
            }
          ],
          required: false
        }
      ],
      order: [['nome', 'ASC']],
      limit: limit + 1, // Buscar +1 para saber se há próxima página
      offset: calculateOffset(page, limit),
      subQuery: false
    });

    // Verificar se tem próxima página
    const hasNextPage = data.length > limit;
    const courses = hasNextPage ? data.slice(0, limit) : data;

    return {
      data: courses,
      pagination: createPagination(page, limit, hasNextPage ? (page + 1) * limit + 1 : courses.length)
    };
  }

  /**
   * Buscar curso por ID com turmas e alunos
   */
  async findById(id: number): Promise<Course> {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Class,
          as: 'turmas',
          attributes: ['id', 'nome', 'turno', 'vagas', 'status'],
          include: [
            {
              model: Student,
              as: 'alunos',
              attributes: ['id', 'nome', 'matricula', 'email', 'status'],
              required: false
            }
          ],
          required: false
        }
      ]
    });
    
    if (!course) {
      throw new AppError('Curso não encontrado', 404);
    }
    
    return course;
  }

  /**
   * Buscar curso por nome (exato)
   */
  async findByName(nome: string): Promise<Course | null> {
    return await Course.findOne({
      where: { nome }
    });
  }

  /**
   * Criar novo curso
   */
  async create(courseData: CourseCreationAttributes): Promise<Course> {
    // Verificar se já existe curso com o mesmo nome
    const existingCourse = await this.findByName(courseData.nome);
    
    if (existingCourse) {
      throw new AppError('Já existe um curso com este nome', 409);
    }

    try {
      return await Course.create(courseData);
    } catch (error: any) {
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map((err: any) => err.message);
        throw new AppError(`Erro de validação: ${messages.join(', ')}`, 400);
      }
      throw new AppError('Erro interno do servidor', 500);
    }
  }

  /**
   * Atualizar curso
   */
  async update(id: number, courseData: Partial<CourseCreationAttributes>): Promise<Course> {
    const course = await this.findById(id);

    // Se está atualizando o nome, verificar se não existe outro curso com o mesmo nome
    if (courseData.nome && courseData.nome !== course.nome) {
      const existingCourse = await this.findByName(courseData.nome);
      
      if (existingCourse) {
        throw new AppError('Já existe um curso com este nome', 409);
      }
    }

    try {
      await course.update(courseData);
      return course;
    } catch (error: any) {
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map((err: any) => err.message);
        throw new AppError(`Erro de validação: ${messages.join(', ')}`, 400);
      }
      throw new AppError('Erro interno do servidor', 500);
    }
  }

  /**
   * Deletar curso
   */
  async delete(id: number): Promise<void> {
    const course = await this.findById(id);
    
    // Verificar se o curso tem turmas associadas
    const classCount = await Class.count({
      where: { id_curso: id }
    });
    
    if (classCount > 0) {
      throw new AppError(
        `Não é possível deletar o curso. Existem ${classCount} turma(s) associada(s) a este curso.`,
        400
      );
    }
    
    await course.destroy();
  }

  /**
   * Verificar se curso existe
   */
  async exists(id: number): Promise<boolean> {
    const count = await Course.count({
      where: { id }
    });
    
    return count > 0;
  }

  /**
   * Obter estatísticas dos cursos
   */
  async getStatistics() {
    const total = await Course.count();
    
    const avgCargaHoraria = await Course.findOne({
      attributes: [
        [Course.sequelize!.fn('AVG', Course.sequelize!.col('carga_horaria')), 'media']
      ],
      raw: true
    }) as any;

    const maxCargaHoraria = await Course.max('carga_horaria');
    const minCargaHoraria = await Course.min('carga_horaria');

    return {
      total,
      carga_horaria: {
        media: Math.round(avgCargaHoraria?.media || 0),
        maxima: maxCargaHoraria || 0,
        minima: minCargaHoraria || 0
      }
    };
  }

  /**
   * Buscar todos os cursos (endpoint público)
   * ✅ Retorna apenas informações básicas com columns limitadas
   */
  async findAllPublic() {
    const courses = await Course.findAll({
      attributes: ['id', 'nome', 'descricao', 'carga_horaria', 'nivel', 'status'],
      where: { status: 'ATIVO' }, // Apenas cursos ativos
      order: [['nome', 'ASC']],
      raw: true, // Evita overhead de instâncias Sequelize
      limit: 1000 // Limite para evitar carregar dados demais
    });

    return courses;
  }

  /**
   * Buscar curso por ID (endpoint público)
   * Retorna detalhes do curso
   */
  async findByIdPublic(id: number) {
    const course = await Course.findByPk(id, {
      attributes: ['id', 'nome', 'descricao', 'carga_horaria', 'nivel', 'status']
    });

    if (!course) {
      throw new AppError('Curso não encontrado', 404);
    }

    const courseData = course.toJSON() as any;

    return {
      id: courseData.id,
      nome: courseData.nome,
      descricao: courseData.descricao,
      carga_horaria: courseData.carga_horaria,
      nivel: courseData.nivel || 'INTERMEDIARIO'
    };
  }
}

export default new CourseService();