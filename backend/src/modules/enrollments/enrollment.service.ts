import Enrollment from './enrollment.model.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import Course from '../courses/course.model.js';
import { sequelize } from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import NotificationService from '../notifications/notification.service.js';
import { 
  PaginatedResponse, 
  calculateOffset, 
  createPagination, 
  normalizePagination 
} from '../../utils/pagination.js';

/**
 * Interface para dados de criação de matrícula
 */
interface CreateEnrollmentData {
  id_aluno: number;
  id_turma: number;
  status?: string;
}

/**
 * Interface para filtros de matrículas
 */
interface EnrollmentFilters {
  page?: number;
  limit?: number;
}

/**
 * Service de Matrículas
 * Contém toda a lógica de negócio relacionada a matrículas
 * Inclui gerenciamento automático de vagas das turmas
 */
class EnrollmentService {
  /**
   * Lista todas as matrículas com paginação
   */
  async list(filters: EnrollmentFilters = {}): Promise<PaginatedResponse<Enrollment>> {
    // Extrair parâmetros de paginação
    const { page, limit } = normalizePagination({
      page: filters.page,
      limit: filters.limit
    });

    // Buscar total de registros
    const total = await Enrollment.count();

    // Buscar matrículas com paginação
    const data = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'email', 'matricula']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'vagas']
        }
      ],
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
   * Busca uma matrícula específica
   */
  async findOne(id_aluno: number, id_turma: number) {
    const enrollment = await Enrollment.findOne({
      where: { id_aluno, id_turma },
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'email', 'matricula']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'vagas']
        }
      ]
    });

    if (!enrollment) {
      throw new AppError('Matrícula não encontrada', 404);
    }

    return enrollment;
  }

  /**
   * Cria uma nova matrícula
   * AUTOMATICAMENTE decrementa as vagas disponíveis da turma
   */
  async create(data: CreateEnrollmentData) {
    // Usar transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Verificar se o aluno existe
      const student = await Student.findByPk(data.id_aluno, { transaction });
      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Verificar se a turma existe
      const turma = await Class.findByPk(data.id_turma, { transaction });
      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Verificar se a turma está ativa
      if (turma.status !== 'ATIVA') {
        throw new AppError(`Não é possível matricular em turma ${turma.status}`, 400);
      }

      // Verificar se há vagas disponíveis
      if (turma.vagas <= 0) {
        throw new AppError('Não há vagas disponíveis nesta turma', 400);
      }

      // Verificar se já existe matrícula
      const existingEnrollment = await Enrollment.findOne({
        where: {
          id_aluno: data.id_aluno,
          id_turma: data.id_turma
        },
        transaction
      });

      if (existingEnrollment) {
        throw new AppError('Aluno já matriculado nesta turma', 409);
      }

      // Criar a matrícula
      const enrollment = await Enrollment.create({
        id_aluno: data.id_aluno,
        id_turma: data.id_turma,
        status: data.status || 'Cursando'
      }, { transaction });

      // DECREMENTAR as vagas da turma
      await turma.decrement('vagas', { by: 1, transaction });

      // Commit da transação
      await transaction.commit();

      // Retornar matrícula com dados completos
      const enrollmentWithDetails = await this.findOne(enrollment.id_aluno, enrollment.id_turma);

      // Enviar email de confirmação (não aguarda para não bloquear resposta)
      NotificationService.sendEnrollmentConfirmation({
        alunoNome: student.nome,
        alunoEmail: student.email,
        turmaNome: turma.nome,
        turno: turma.turno,
        dataInicio: turma.data_inicio,
        dataFim: turma.data_fim
      }).catch(err => console.error('Erro ao enviar email de confirmação:', err));

      return enrollmentWithDetails;
    } catch (error) {
      // Rollback em caso de erro
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Cancela uma matrícula (soft delete - altera status)
   * AUTOMATICAMENTE incrementa as vagas disponíveis da turma
   */
  async cancel(id_aluno: number, id_turma: number) {
    // Usar transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Buscar a matrícula
      const enrollment = await Enrollment.findOne({
        where: { id_aluno, id_turma },
        transaction
      });

      if (!enrollment) {
        throw new AppError('Matrícula não encontrada', 404);
      }

      // Verificar se já está cancelada
      if (enrollment.status === 'cancelado') {
        throw new AppError('Matrícula já está cancelada', 400);
      }

      // Buscar a turma
      const turma = await Class.findByPk(id_turma, { transaction });
      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Buscar dados do aluno para o email
      const student = await Student.findByPk(id_aluno, { transaction });
      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Atualizar status para Cancelado
      await enrollment.update({ status: 'Cancelado' }, { transaction });

      // INCREMENTAR as vagas da turma
      await turma.increment('vagas', { by: 1, transaction });

      // Commit da transação
      await transaction.commit();

      // Enviar email de cancelamento (não aguarda)
      NotificationService.sendEnrollmentCancellation({
        alunoNome: student.nome,
        alunoEmail: student.email,
        turmaNome: turma.nome,
        turno: turma.turno,
        dataInicio: turma.data_inicio,
        dataFim: turma.data_fim
      }).catch(err => console.error('Erro ao enviar email de cancelamento:', err));

      return {
        message: 'Matrícula cancelada com sucesso',
        enrollment: await this.findOne(id_aluno, id_turma)
      };
    } catch (error) {
      // Rollback em caso de erro
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Remove completamente uma matrícula (hard delete)
   * AUTOMATICAMENTE incrementa as vagas disponíveis da turma
   */
  async delete(id_aluno: number, id_turma: number) {
    // Usar transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Buscar a matrícula
      const enrollment = await Enrollment.findOne({
        where: { id_aluno, id_turma },
        transaction
      });

      if (!enrollment) {
        throw new AppError('Matrícula não encontrada', 404);
      }

      // Buscar a turma
      const turma = await Class.findByPk(id_turma, { transaction });
      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Deletar a matrícula
      await enrollment.destroy({ transaction });

      // INCREMENTAR as vagas da turma (apenas se a matrícula não estava cancelada)
      if (enrollment.status !== 'cancelado') {
        await turma.increment('vagas', { by: 1, transaction });
      }

      // Commit da transação
      await transaction.commit();

      return { message: 'Matrícula removida com sucesso' };
    } catch (error) {
      // Rollback em caso de erro
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Lista matrículas de um aluno específico
   */
  async listByStudent(id_aluno: number) {
    const enrollments = await Enrollment.findAll({
      where: { id_aluno },
      include: [
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'vagas', 'data_inicio', 'data_fim']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return enrollments;
  }

  /**
   * Lista matrículas de uma turma específica
   */
  async listByClass(id_turma: number) {
    const enrollments = await Enrollment.findAll({
      where: { id_turma },
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'email', 'matricula']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return enrollments;
  }
}

export default new EnrollmentService();
