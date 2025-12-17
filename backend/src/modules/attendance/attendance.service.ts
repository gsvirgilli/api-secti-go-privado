import Attendance from './attendance.model.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import Enrollment from '../enrollments/enrollment.model.js';
import { sequelize } from '../../config/database.js';
import { Op } from 'sequelize';

/**
 * Interface para filtros de presença
 */
interface AttendanceFilters {
  id_aluno?: number;
  id_turma?: number;
  data_inicio?: Date;
  data_fim?: Date;
  status?: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
}

/**
 * Interface para dados de criação de presença
 */
interface CreateAttendanceData {
  id_aluno: number;
  id_turma: number;
  data_chamada: Date;
  status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
}

/**
 * Interface para registro em lote
 */
interface BulkAttendanceData {
  id_turma: number;
  data_chamada: Date;
  attendances: Array<{
    id_aluno: number;
    status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
    motivo_justificacao?: string;
    id_usuario?: number;
  }>;
}

/**
 * Service de Presenças
 * Gerencia registro de presença, faltas e justificativas
 */
class AttendanceService {
  /**
   * Lista presenças com filtros opcionais (com paginação)
   */
  async list(filters: AttendanceFilters & { page?: number; limit?: number } = {}) {
    const where: any = {};

    // Filtro por aluno
    if (filters.id_aluno) {
      where.id_aluno = filters.id_aluno;
    }

    // Filtro por turma
    if (filters.id_turma) {
      where.id_turma = filters.id_turma;
    }

    // Filtro por período
    if (filters.data_inicio || filters.data_fim) {
      where.data_chamada = {};
      if (filters.data_inicio) {
        where.data_chamada[Op.gte] = filters.data_inicio;
      }
      if (filters.data_fim) {
        where.data_chamada[Op.lte] = filters.data_fim;
      }
    }

    // Filtro por status
    if (filters.status) {
      where.status = filters.status;
    }

    // Paginação simples (padrão: 50 registros)
    const limit = Math.min(filters.limit || 50, 100);
    const page = Math.max(filters.page || 1, 1);
    const offset = (page - 1) * limit;

    // Skip includes para performance, retornar apenas IDs
    const attendances = await Attendance.findAll({
      where,
      attributes: ['id', 'idAluno', 'idTurma', 'dataChamada', 'status', 'motivoJustificacao', 'idUsuario', 'createdAt', 'updatedAt'],
      order: [['dataChamada', 'DESC'], ['idAluno', 'ASC']],
      limit,
      offset
    });

    return attendances;
  }

  /**
   * Busca uma presença específica por ID
   */
  async findById(id: number) {
    const attendance = await Attendance.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'email', 'matricula']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno']
        }
      ]
    });

    if (!attendance) {
      throw new Error('Registro de presença não encontrado');
    }

    return attendance;
  }

  /**
   * Registra uma presença individual
   */
  async create(data: CreateAttendanceData) {
    // Validar se o aluno existe
    const student = await Student.findByPk(data.id_aluno);
    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // Validar se a turma existe
    const turma = await Class.findByPk(data.id_turma);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Validar se o aluno está matriculado na turma
    // Aceita DUAS formas de matrícula:
    // 1. Campo turma_id direto no Student
    // 2. Registro na tabela Enrollment (matriculas)
    let isEnrolled = false;

    // Opção 1: Verificar se student tem turma_id que bate
    if (student.turma_id === data.id_turma) {
      isEnrolled = true;
    }

    // Opção 2: Verificar na tabela de matrículas
    if (!isEnrolled) {
      const enrollment = await Enrollment.findOne({
        where: {
          id_aluno: data.id_aluno,
          id_turma: data.id_turma
        }
      });
      if (enrollment) {
        isEnrolled = true;
      }
    }

    if (!isEnrolled) {
      throw new Error('Aluno não está matriculado nesta turma');
    }

    // Verificar se já existe presença para essa data
    const existingAttendance = await Attendance.findOne({
      where: {
        id_aluno: data.id_aluno,
        id_turma: data.id_turma,
        data_chamada: data.data_chamada
      }
    });

    if (existingAttendance) {
      throw new Error('Já existe registro de presença para este aluno nesta data');
    }

    // Criar o registro de presença
    const attendance = await Attendance.create(data as any);

    // Retornar com dados completos
    return await this.findById(attendance.id);
  }

  /**
   * Registra presenças em lote para uma turma
   */
  async createBulk(data: BulkAttendanceData) {
    const transaction = await sequelize.transaction();

    try {
      console.log('📊 createBulk data received:', JSON.stringify(data, null, 2));
      
      // Validar se a turma existe
      const turma = await Class.findByPk(data.id_turma, { transaction });
      if (!turma) {
        throw new Error('Turma não encontrada');
      }

      const createdAttendances = [];

      for (const attendance of data.attendances) {
        // Validar se o aluno existe
        const student = await Student.findByPk(attendance.id_aluno, { transaction });
        if (!student) {
          throw new Error(`Aluno ID ${attendance.id_aluno} não encontrado`);
        }

        // Validar se o aluno está matriculado
        // Aceita DUAS formas de matrícula:
        // 1. Campo turma_id direto no Student
        // 2. Registro na tabela Enrollment (matriculas)
        let isEnrolled = false;

        // Opção 1: Verificar se student tem turma_id que bate
        if (student.turma_id === data.id_turma) {
          isEnrolled = true;
        }

        // Opção 2: Verificar na tabela de matrículas
        if (!isEnrolled) {
          const enrollment = await Enrollment.findOne({
            where: {
              id_aluno: attendance.id_aluno,
              id_turma: data.id_turma
            },
            transaction
          });
          if (enrollment) {
            isEnrolled = true;
          }
        }

        if (!isEnrolled) {
          throw new Error(`Aluno ${student.nome} não está matriculado nesta turma`);
        }

        // Verificar se já existe presença
        const existing = await Attendance.findOne({
          where: {
            id_aluno: attendance.id_aluno,
            id_turma: data.id_turma,
            data_chamada: data.data_chamada
          },
          transaction
        });

        if (existing) {
          // Atualizar se já existe
          await existing.update({
            status: attendance.status,
            motivo_justificacao: attendance.motivo_justificacao || null,
            id_usuario: attendance.id_usuario || null
          }, { transaction });
          createdAttendances.push(existing);
        } else {
          // Criar novo registro
          const newAttendance = await Attendance.create({
            id_aluno: attendance.id_aluno,
            id_turma: data.id_turma,
            data_chamada: data.data_chamada,
            status: attendance.status,
            motivo_justificacao: attendance.motivo_justificacao || null,
            id_usuario: attendance.id_usuario || null
          }, { transaction });
          createdAttendances.push(newAttendance);
        }
      }

      await transaction.commit();

      // Retornar apenas os registros criados (sem includes pesados)
      return createdAttendances.slice(0, 50).map(att => ({
        id: att.id,
        id_aluno: att.id_aluno,
        id_turma: att.id_turma,
        data_chamada: att.data_chamada,
        status: att.status,
        motivo_justificacao: att.motivo_justificacao,
        id_usuario: att.id_usuario,
        createdAt: att.createdAt,
        updatedAt: att.updatedAt
      }));
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Atualiza o status de uma presença
   */
  async update(id: number, status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO') {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      throw new Error('Registro de presença não encontrado');
    }

    await attendance.update({ status });

    return await this.findById(id);
  }

  /**
   * Remove um registro de presença
   */
  async delete(id: number) {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      throw new Error('Registro de presença não encontrado');
    }

    await attendance.destroy();

    return { message: 'Registro de presença removido com sucesso' };
  }

  /**
   * Obtém estatísticas de presença de um aluno em uma turma
   */
  async getStudentStats(id_aluno: number, id_turma: number) {
    const attendances = await Attendance.findAll({
      where: { idAluno: id_aluno, idTurma: id_turma }
    });

    const total = attendances.length;
    const presente = attendances.filter(a => a.status === 'PRESENTE').length;
    const ausente = attendances.filter(a => a.status === 'AUSENTE').length;
    const justificado = attendances.filter(a => a.status === 'JUSTIFICADO').length;

    const percentualPresenca = total > 0 ? (presente / total) * 100 : 0;

    return {
      total,
      presente,
      ausente,
      justificado,
      percentualPresenca: Math.round(percentualPresenca * 100) / 100
    };
  }

  /**
   * Obtém relatório de presenças de uma turma em uma data específica
   */
  async getClassReport(id_turma: number, data_chamada: Date) {
    // Buscar todos os alunos matriculados na turma
    const enrollments = await Enrollment.findAll({
      where: { idTurma: id_turma },
      include: [{
        model: Student,
        as: 'aluno',
        attributes: ['id', 'nome', 'email', 'matricula']
      }]
    });

    // Buscar presenças da data
    const attendances = await Attendance.findAll({
      where: {
        id_turma,
        data_chamada
      }
    });

    // Mapear presenças por aluno
    const attendanceMap = new Map(
      attendances.map(a => [a.id_aluno, a.status])
    );

    // Gerar relatório
    const report = enrollments.map(enrollment => ({
      aluno: (enrollment as any).aluno,
      status: attendanceMap.get(enrollment.id_aluno) || 'NAO_REGISTRADO'
    }));

    const stats = {
      total: enrollments.length,
      presente: attendances.filter(a => a.status === 'PRESENTE').length,
      ausente: attendances.filter(a => a.status === 'AUSENTE').length,
      justificado: attendances.filter(a => a.status === 'JUSTIFICADO').length,
      naoRegistrado: enrollments.length - attendances.length
    };

    return {
      data_chamada,
      turma: await Class.findByPk(id_turma, {
        attributes: ['id', 'nome', 'turno']
      }),
      stats,
      alunos: report
    };
  }
}

export default new AttendanceService();
