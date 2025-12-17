import Class from './class.model.js';
import Curso from '../courses/course.model.js';
import Enrollment from '../enrollments/enrollment.model.js';
import Student from '../students/student.model.js';
import Instructor from '../instructors/instructor.model.js';
import InstructorClass from '../instructor_classes/instructor_class.model.js';
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
export interface CreateClassData {
  nome: string;
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL';
  data_inicio?: Date | null;
  data_fim?: Date | null;
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
  status?: 'ATIVA' | 'PLANEJADA' | 'ENCERRADA' | 'CANCELADA';
}

/**
 * Service de Turmas
 * Contém toda a lógica de negócio relacionada a turmas
 */
class ClassService {
  /**
   * Calcula o status automático da turma baseado nas datas
   * Planejada: ainda não começou (data_inicio no futuro ou nula)
   * Ativa: está entre data_inicio e data_fim
   * Encerrada: passou da data_fim
   * Cancelada: mantém se já foi definida como cancelada
   */
  private calculateAutoStatus(
    data_inicio: Date | null | undefined,
    data_fim: Date | null | undefined,
    currentStatus?: string
  ): 'PLANEJADA' | 'ATIVA' | 'ENCERRADA' | 'CANCELADA' {
    // Se status é cancelada, manter cancelada
    if (currentStatus === 'CANCELADA') {
      return 'CANCELADA';
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Se não tem datas, retorna PLANEJADA
    if (!data_inicio || !data_fim) {
      return 'PLANEJADA';
    }

    const dataInicio = new Date(data_inicio);
    const dataFim = new Date(data_fim);
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(0, 0, 0, 0);

    // Se hoje é antes de data_inicio → Planejada
    if (hoje < dataInicio) {
      return 'PLANEJADA';
    }

    // Se hoje é entre data_inicio e data_fim (inclusive) → Ativa
    if (hoje >= dataInicio && hoje <= dataFim) {
      return 'ATIVA';
    }

    // Se hoje é depois de data_fim → Encerrada
    if (hoje > dataFim) {
      return 'ENCERRADA';
    }

    return 'PLANEJADA';
  }

  /**
   * Lista todas as turmas com filtros opcionais e paginação
   * ✅ Otimizado: Skip COUNT, use índices, eager loading
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

    // ✅ Buscar turmas com paginação - skip COUNT
    const turmas = await Class.findAll({
      where,
      attributes: ['id', 'nome', 'turno', 'data_inicio', 'data_fim', 'id_curso', 'vagas', 'status', 'createdAt'],
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nome', 'carga_horaria'],
          required: false
        },
        {
          model: Student,
          as: 'alunos',
          attributes: ['id', 'nome', 'matricula', 'email', 'status'],
          required: false
        },
        {
          model: Instructor,
          as: 'instrutores',
          attributes: ['id', 'nome', 'email', 'especialidade'],
          required: false,
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit + 1, // +1 para verificar próxima página
      offset: calculateOffset(page, limit),
      subQuery: false
    });

    // Verificar se há próxima página
    const hasNextPage = turmas.length > limit;
    const classes = hasNextPage ? turmas.slice(0, limit) : turmas;

    // Retornar resposta paginada
    return {
      data: classes,
      pagination: createPagination(page, limit, hasNextPage ? (page + 1) * limit + 1 : classes.length)
    };
  }

  /**
   * Busca uma turma por ID com alunos matriculados
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
          model: Instructor,
          as: 'instrutores',
          attributes: ['id', 'nome', 'email', 'especialidade'],
          through: { attributes: [] }
        }
      ]
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Buscar alunos dessa turma especificamente
    const alunos = await Student.findAll({
      where: { turma_id: id },
      attributes: ['id', 'matricula', 'nome', 'email', 'status', 'telefone', 'turma_id'],
      order: [['nome', 'ASC']]
    });

    // Converter para JSON e adicionar alunos
    const turmaData = turma.toJSON() as any;
    turmaData.alunos = alunos;

    return turmaData;
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

    // Calcular status automático baseado nas datas
    const autoStatus = this.calculateAutoStatus(data.data_inicio, data.data_fim, data.status);

    // Criar turma com status automático calculado
    const turma = await Class.create({
      ...data,
      status: autoStatus
    } as any);

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

    // Se está tentando ativar a turma, verificar se tem instrutor
    if (data.status === 'ATIVA') {
      const instrutoresCount = await InstructorClass.count({ where: { id_turma: id } });
      if (instrutoresCount === 0) {
        throw new Error('Turma ativa deve ter pelo menos um instrutor cadastrado');
      }
    }

    // Calcular status automático baseado nas datas (se não foi explicitamente cancelada)
    // Se o usuário enviou um status específico, usar esse (permitir override)
    let finalStatus = data.status;
    if (!data.status) {
      // Calcular automático apenas se não foi especificado um status
      finalStatus = this.calculateAutoStatus(dataInicio, dataFim, turma.status);
    } else if (data.status !== 'CANCELADA') {
      // Se enviou um status mas não é cancelada, ainda assim calcular baseado nas datas
      // para garantir consistência
      finalStatus = this.calculateAutoStatus(dataInicio, dataFim, data.status);
    }
    // Se é CANCELADA, mantém CANCELADA

    // Atualizar turma com status calculado
    await turma.update({
      ...data,
      status: finalStatus
    });

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

    // Verificar se existem matrículas ou alunos vinculados à turma
    const enrollmentCount = await Enrollment.count({ where: { id_turma: id } });
    const studentCount = await Student.count({ where: { turma_id: id } });

    if (enrollmentCount > 0 || studentCount > 0) {
      throw new Error('Não é possível deletar turma com alunos/matrículas vinculadas. Remova as matrículas ou mova os alunos antes de excluir.');
    }

    // Remover associações de instrutores antes de deletar a turma
    await InstructorClass.destroy({ where: { id_turma: id } });

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
  async updateStatus(id: number, status: 'ATIVA' | 'PLANEJADA' | 'ENCERRADA' | 'CANCELADA') {
    const turma = await this.findById(id);
    const statusAnterior = turma.status;

    // Validações específicas por tipo de transição
    if (status === 'ENCERRADA') {
      // Pode encerrar turma ATIVA ou PLANEJADA
      if (turma.status !== 'ATIVA' && turma.status !== 'PLANEJADA') {
        throw new Error('Apenas turmas ATIVAS ou PLANEJADAS podem ser encerradas');
      }
    }

    if (status === 'CANCELADA') {
      // Pode cancelar turma ATIVA ou PLANEJADA
      if (turma.status !== 'ATIVA' && turma.status !== 'PLANEJADA') {
        throw new Error('Apenas turmas ATIVAS podem ser canceladas');
      }
    }

    if (status === 'ATIVA') {
      // Pode reativar turma CANCELADA (mas não ENCERRADA)
      if (turma.status === 'ENCERRADA') {
        throw new Error('Turmas ENCERRADAS não podem ser reativadas');
      }
      // Validar se tem instrutor ao ativar
      const instrutoresCount = await InstructorClass.count({ where: { id_turma: id } });
      if (instrutoresCount === 0) {
        throw new Error('Turma ativa deve ter pelo menos um instrutor cadastrado');
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

  /**
   * Associa um instrutor a uma turma
   */
  async addInstructor(classId: number, instructorId: number) {
    try {
      const turma = await Class.findByPk(classId);
      if (!turma) {
        throw new Error('Turma não encontrada');
      }

      const instructor = await Instructor.findByPk(instructorId);
      if (!instructor) {
        throw new Error('Instrutor não encontrado');
      }

      // Verificar se já está associado
      const existingAssociation = await InstructorClass.findOne({
        where: {
          id_turma: classId,
          id_instrutor: instructorId
        }
      });

      if (existingAssociation) {
        throw new Error('Este instrutor já está associado a esta turma');
      }

      // @ts-ignore - Sequelize association method (addInstrutores é gerado automaticamente pelo belongsToMany)
      await turma.addInstrutores(instructor);

      // Retornar turma atualizada com instrutores
      return await this.findById(classId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erro ao associar instrutor: ${error}`);
    }
  }

  /**
   * Remove um instrutor de uma turma
   */
  async removeInstructor(classId: number, instructorId: number) {
    const turma = await this.findById(classId);

    // @ts-ignore - Sequelize association method (removeInstrutores é gerado automaticamente pelo belongsToMany)
    await turma.removeInstrutores(instructorId);

    return true;
  }
}

export default new ClassService();
