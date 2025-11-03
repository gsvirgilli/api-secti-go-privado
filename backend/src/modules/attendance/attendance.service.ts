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
  }>;
}

/**
 * Service de Presenças
 * Gerencia registro de presença, faltas e justificativas
 */
class AttendanceService {
  /**
   * Lista presenças com filtros opcionais
   */
  async list(filters: AttendanceFilters = {}) {
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

    const attendances = await Attendance.findAll({
      where,
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
      ],
      order: [['data_chamada', 'DESC'], ['id_aluno', 'ASC']]
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
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno: data.id_aluno,
        id_turma: data.id_turma
      }
    });

    if (!enrollment) {
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
        const enrollment = await Enrollment.findOne({
          where: {
            id_aluno: attendance.id_aluno,
            id_turma: data.id_turma
          },
          transaction
        });

        if (!enrollment) {
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
          await existing.update({ status: attendance.status }, { transaction });
          createdAttendances.push(existing);
        } else {
          // Criar novo registro
          const newAttendance = await Attendance.create({
            id_aluno: attendance.id_aluno,
            id_turma: data.id_turma,
            data_chamada: data.data_chamada,
            status: attendance.status
          }, { transaction });
          createdAttendances.push(newAttendance);
        }
      }

      await transaction.commit();

      // Retornar registros criados com dados completos
      return await this.list({
        id_turma: data.id_turma,
        data_inicio: data.data_chamada,
        data_fim: data.data_chamada
      });
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
      where: { id_aluno, id_turma }
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
      where: { id_turma },
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
