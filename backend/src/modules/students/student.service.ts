import Student from './student.model.js';
import { Op } from 'sequelize';
import { 
  PaginatedResponse, 
  calculateOffset, 
  createPagination, 
  normalizePagination 
} from '../../utils/pagination.js';

/**
 * Interface para filtros de alunos
 */
interface StudentFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  matricula?: string;
  page?: number;
  limit?: number;
}

/**
 * Interface para dados de atualização de aluno
 */
interface UpdateStudentData {
  nome?: string;
  email?: string;
  telefone?: string;
}

/**
 * Service de Alunos
 * Contém toda a lógica de negócio relacionada a alunos
 */
class StudentService {
  /**
   * Lista todos os alunos com filtros opcionais e paginação
   */
  async list(filters: StudentFilters = {}): Promise<PaginatedResponse<Student>> {
    const where: any = {};

    // Extrair parâmetros de paginação
    const { page, limit } = normalizePagination({
      page: filters.page,
      limit: filters.limit
    });

    // Filtro por nome (busca parcial, case-insensitive)
    if (filters.nome) {
      where.nome = {
        [Op.like]: `%${filters.nome}%`
      };
    }

    // Filtro por CPF
    if (filters.cpf) {
      where.cpf = filters.cpf.replace(/\D/g, '');
    }

    // Filtro por email
    if (filters.email) {
      where.email = {
        [Op.like]: `%${filters.email}%`
      };
    }

    // Filtro por matrícula
    if (filters.matricula) {
      where.matricula = {
        [Op.like]: `%${filters.matricula}%`
      };
    }

    // Buscar total de registros
    const total = await Student.count({ where });

    // Buscar alunos com paginação
    const data = await Student.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset: calculateOffset(page, limit)
    });

    return {
      data,
      pagination: createPagination(page, limit, total)
    };
  }

  /**
   * Busca um aluno por ID
   */
  async findById(id: number) {
    const student = await Student.findByPk(id);

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    return student;
  }

  /**
   * Busca aluno por CPF (via candidato)
   */
  async findByCPF(cpf: string) {
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Primeiro busca o candidato pelo CPF
    const { default: Candidate } = await import('../Candidates/candidate.model.js');
    const candidate = await Candidate.findOne({ where: { cpf: cleanCPF } });
    
    if (!candidate) {
      return null;
    }
    
    // Depois busca o aluno associado ao candidato
    return await Student.findOne({ where: { candidato_id: candidate.id } });
  }

  /**
   * Busca aluno por matrícula
   */
  async findByMatricula(matricula: string) {
    return await Student.findOne({ where: { matricula } });
  }

  /**
   * Atualiza um aluno existente
   */
  async update(id: number, data: UpdateStudentData) {
    const student = await Student.findByPk(id);

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // Atualizar aluno
    await student.update(data);

    return student;
  }

  /**
   * Deleta um aluno
   */
  async delete(id: number) {
    const student = await Student.findByPk(id);

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    await student.destroy();

    return { message: 'Aluno deletado com sucesso' };
  }

  /**
   * Retorna estatísticas de alunos
   */
  async getStatistics() {
    const total = await Student.count();
    
    return {
      total
    };
  }
}

export default new StudentService();
