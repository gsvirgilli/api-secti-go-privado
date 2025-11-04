import Class from './class.model.js';
import Curso from '../courses/course.model.js';
import Enrollment from '../enrollments/enrollment.model.js';
import Student from '../students/student.model.js';
import { Op } from 'sequelize';
import NotificationService from '../notifications/notification.service.js';
import { 
  PaginationParams, 
  PaginatedResponse, 
  calculateOffset, 
  createPagination, 
  normalizePagination 
} from '../../utils/pagination.js';

/**
 * Interface para filtros de turmas
 */
interface ClassFilters {
  nome?: string;
  turno?: string;
  id_curso?: number;
  data_inicio_min?: Date;
  data_inicio_max?: Date;
  data_fim_min?: Date;
  data_fim_max?: Date;
  status?: 'ATIVA' | 'ENCERRADA' | 'CANCELADA';
  page?: number;
  limit?: number;
}

/**
 * Interface para dados de criação de turma
 */
interface CreateClassData {
  nome: string;
  turno: string;
  data_inicio?: Date;
  data_fim?: Date;
  id_curso: number;
  vagas: number;
  status?: 'ATIVA' | 'ENCERRADA' | 'CANCELADA';
}

/**
 * Interface para dados de atualização de turma
 */
interface UpdateClassData {
  nome?: string;
  turno?: string;
  data_inicio?: Date;
  data_fim?: Date;
  id_curso?: number;
}

/**
 * Service de Turmas
 * Contém toda a lógica de negócio relacionada a turmas
 */
class ClassService {
  /**
   * Lista todas as turmas com filtros opcionais e paginação
   */
  async list(filters: ClassFilters = {}): Promise<PaginatedResponse<any>> {
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

    // Filtro por turno
    if (filters.turno) {
      where.turno = filters.turno;
    }

    // Filtro por curso
    if (filters.id_curso) {
      where.id_curso = filters.id_curso;
    }

    // Filtro por data de início (intervalo)
    if (filters.data_inicio_min || filters.data_inicio_max) {
      where.data_inicio = {};
      if (filters.data_inicio_min) {
        where.data_inicio[Op.gte] = filters.data_inicio_min;
      }
      if (filters.data_inicio_max) {
        where.data_inicio[Op.lte] = filters.data_inicio_max;
      }
    }

    // Filtro por data de fim (intervalo)
    if (filters.data_fim_min || filters.data_fim_max) {
      where.data_fim = {};
      if (filters.data_fim_min) {
        where.data_fim[Op.gte] = filters.data_fim_min;
      }
      if (filters.data_fim_max) {
        where.data_fim[Op.lte] = filters.data_fim_max;
      }
    }

    // Filtro por status
    if (filters.status) {
      where.status = filters.status;
    }

    // Buscar total de registros (para paginação)
    const total = await Class.count({ where });

    // Buscar turmas com paginação
    const turmas = await Class.findAll({
      where,
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nome', 'carga_horaria']
        },
        {
          model: Student,
          as: 'alunos',
          attributes: ['id', 'matricula', 'nome', 'email', 'status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: calculateOffset(page, limit)
    });

    // Retornar resposta paginada
    return {
      data: turmas,
      pagination: createPagination(page, limit, total)
    };
  }

  /**
   * Busca uma turma por ID
   */
  async findById(id: number) {
    const turma = await Class.findByPk(id, {
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nome', 'carga_horaria', 'descricao']
        },
        {
          model: Student,
          as: 'alunos',
          attributes: ['id', 'matricula', 'nome', 'email', 'status', 'telefone']
        }
      ]
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    return turma;
  }

  /**
   * Cria uma nova turma
   */
  async create(data: CreateClassData) {
    // Validar se o curso existe
    const curso = await Curso.findByPk(data.id_curso);
    if (!curso) {
      throw new Error('Curso não encontrado');
    }

    // Validar datas
    if (data.data_inicio && data.data_fim) {
      if (new Date(data.data_fim) <= new Date(data.data_inicio)) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
    }

    // Criar turma
    const turma = await Class.create(data as any);

    // Retornar com informações do curso
    return await this.findById(turma.id);
  }

  /**
   * Atualiza uma turma existente
   */
  async update(id: number, data: UpdateClassData) {
    const turma = await Class.findByPk(id);

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Se está atualizando o curso, validar se existe
    if (data.id_curso) {
      const curso = await Curso.findByPk(data.id_curso);
      if (!curso) {
        throw new Error('Curso não encontrado');
      }
    }

    // Validar datas se ambas forem fornecidas ou atualizadas
    const dataInicio = data.data_inicio || turma.data_inicio;
    const dataFim = data.data_fim || turma.data_fim;

    if (dataInicio && dataFim) {
      if (new Date(dataFim) <= new Date(dataInicio)) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
    }

    // Atualizar turma
    await turma.update(data);

    // Retornar com informações do curso
    return await this.findById(turma.id);
  }

  /**
   * Deleta uma turma
   */
  async delete(id: number) {
    const turma = await Class.findByPk(id);

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    await turma.destroy();

    return { message: 'Turma deletada com sucesso' };
  }

  /**
   * Retorna estatísticas de turmas
   */
  async getStatistics() {
    try {
      const total = await Class.count();
      
      const porTurno = await Class.findAll({
        attributes: [
          'turno',
          [Class.sequelize!.fn('COUNT', Class.sequelize!.col('id')), 'quantidade']
        ],
        group: ['turno'],
        raw: true
      });

      // Turmas ativas (que ainda não terminaram)
      const ativas = await Class.count({
        where: {
          [Op.or]: [
            { data_fim: null },
            { data_fim: { [Op.gte]: new Date() } }
          ]
        }
      });

      // Turmas encerradas
      const encerradas = await Class.count({
        where: {
          data_fim: { [Op.lt]: new Date() }
        }
      });

      return {
        total,
        ativas,
        encerradas,
        porTurno
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de classes:', error);
      throw error;
    }
  }

  /**
   * Verifica se há conflito de horário para uma turma
   */
  async checkConflict(data: CreateClassData | UpdateClassData, excludeId?: number) {
    if (!data.data_inicio || !data.data_fim || !data.turno) {
      return false;
    }

    const where: any = {
      turno: data.turno,
      [Op.or]: [
        {
          // Nova turma começa durante uma turma existente
          data_inicio: {
            [Op.lte]: data.data_inicio
          },
          data_fim: {
            [Op.gte]: data.data_inicio
          }
        },
        {
          // Nova turma termina durante uma turma existente
          data_inicio: {
            [Op.lte]: data.data_fim
          },
          data_fim: {
            [Op.gte]: data.data_fim
          }
        },
        {
          // Nova turma engloba completamente uma turma existente
          data_inicio: {
            [Op.gte]: data.data_inicio
          },
          data_fim: {
            [Op.lte]: data.data_fim
          }
        }
      ]
    };

    // Se estiver atualizando, excluir a própria turma da verificação
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const conflitos = await Class.findAll({ where });

    return conflitos.length > 0;
  }

  /**
   * Altera o status de uma turma
   */
  async updateStatus(id: number, status: 'ATIVA' | 'ENCERRADA' | 'CANCELADA') {
    const turma = await this.findById(id);
    const statusAnterior = turma.status;

    // Validações específicas por tipo de transição
    if (status === 'ENCERRADA') {
      // Pode encerrar turma ATIVA
      if (turma.status !== 'ATIVA') {
        throw new Error('Apenas turmas ATIVAS podem ser encerradas');
      }
    }

    if (status === 'CANCELADA') {
      // Pode cancelar turma ATIVA
      if (turma.status !== 'ATIVA') {
        throw new Error('Apenas turmas ATIVAS podem ser canceladas');
      }
    }

    if (status === 'ATIVA') {
      // Pode reativar turma CANCELADA (mas não ENCERRADA)
      if (turma.status === 'ENCERRADA') {
        throw new Error('Turmas ENCERRADAS não podem ser reativadas');
      }
    }

    turma.status = status;
    await turma.save();

    // Se a turma foi ENCERRADA ou CANCELADA, notificar os alunos matriculados
    if ((status === 'ENCERRADA' || status === 'CANCELADA') && statusAnterior === 'ATIVA') {
      // Buscar alunos matriculados na turma
      const enrollments = await Enrollment.findAll({
        where: {
          id_turma: id,
          status: { [Op.ne]: 'Cancelado' } // Apenas matrículas ativas
        },
        include: [{
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'email']
        }]
      });

      // Extrair emails dos alunos
      const alunosEmails = enrollments
        .map((enrollment: any) => enrollment.aluno?.email)
        .filter((email: string | undefined) => email !== undefined) as string[];

      // Enviar notificações (não aguarda para não bloquear)
      if (alunosEmails.length > 0) {
        if (status === 'ENCERRADA') {
          NotificationService.sendClassEnded(
            {
              nome: turma.nome,
              turno: turma.turno,
              dataInicio: turma.data_inicio,
              dataFim: turma.data_fim
            },
            alunosEmails
          ).catch(err => console.error('Erro ao enviar emails de turma encerrada:', err));
        } else if (status === 'CANCELADA') {
          NotificationService.sendClassCancelled(
            {
              nome: turma.nome,
              turno: turma.turno,
              dataInicio: turma.data_inicio,
              dataFim: turma.data_fim
            },
            alunosEmails
          ).catch(err => console.error('Erro ao enviar emails de turma cancelada:', err));
        }
      }
    }

    return turma;
  }

  /**
   * Valida se a turma está ativa e com vagas disponíveis
   */
  async validateForEnrollment(id: number): Promise<{ valid: boolean; message?: string }> {
    const turma = await this.findById(id);

    // Verifica se turma está ativa
    if (turma.status !== 'ATIVA') {
      return {
        valid: false,
        message: `Não é possível matricular em turma ${turma.status}`
      };
    }

    // Verifica se há vagas disponíveis
    if (turma.vagas <= 0) {
      return {
        valid: false,
        message: 'Turma não possui vagas disponíveis'
      };
    }

    return { valid: true };
  }
}

export default new ClassService();
