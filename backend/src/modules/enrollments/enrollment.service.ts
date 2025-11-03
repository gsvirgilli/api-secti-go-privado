import Enrollment from './enrollment.model.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import { Op } from 'sequelize';

/**
 * Interface para filtros de matrículas
 */
interface EnrollmentFilters {
  id_aluno?: number;
  id_turma?: number;
  status?: string;
}

/**
 * Interface para dados de criação de matrícula
 */
interface CreateEnrollmentData {
  id_aluno: number;
  id_turma: number;
  status?: 'ativo' | 'trancado' | 'concluido' | 'cancelado';
}

/**
 * Interface para dados de atualização de matrícula
 */
interface UpdateEnrollmentData {
  status?: 'ativo' | 'trancado' | 'concluido' | 'cancelado';
}

/**
 * Service de Matrículas
 * Contém toda a lógica de negócio relacionada a matrículas
 */
class EnrollmentService {
  /**
   * Lista todas as matrículas com filtros opcionais
   */
  async list(filters: EnrollmentFilters = {}) {
    const where: any = {};

    if (filters.id_aluno) {
      where.id_aluno = filters.id_aluno;
    }

    if (filters.id_turma) {
      where.id_turma = filters.id_turma;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const enrollments = await Enrollment.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'matricula', 'cpf', 'email']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'data_inicio', 'data_fim']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return enrollments;
  }

  /**
   * Busca uma matrícula específica
   */
  async findOne(id_aluno: number, id_turma: number) {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma
      },
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'matricula', 'cpf', 'email', 'turma_id']
        },
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'data_inicio', 'data_fim', 'id_curso']
        }
      ]
    });

    if (!enrollment) {
      throw new Error('Matrícula não encontrada');
    }

    return enrollment;
  }

  /**
   * Busca todas as matrículas de um aluno
   */
  async findByStudent(id_aluno: number) {
    const enrollments = await Enrollment.findAll({
      where: { id_aluno },
      include: [
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno', 'data_inicio', 'data_fim']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return enrollments;
  }

  /**
   * Busca todas as matrículas de uma turma
   */
  async findByClass(id_turma: number) {
    const enrollments = await Enrollment.findAll({
      where: { id_turma },
      include: [
        {
          model: Student,
          as: 'aluno',
          attributes: ['id', 'nome', 'matricula', 'cpf', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return enrollments;
  }

  /**
   * Cria uma nova matrícula
   */
  async create(data: CreateEnrollmentData) {
    // Verificar se aluno existe
    const student = await Student.findByPk(data.id_aluno);
    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // Verificar se turma existe
    const classEntity = await Class.findByPk(data.id_turma);
    if (!classEntity) {
      throw new Error('Turma não encontrada');
    }

    // Verificar se já existe matrícula ativa
    const existingEnrollment = await Enrollment.findOne({
      where: {
        id_aluno: data.id_aluno,
        id_turma: data.id_turma
      }
    });

    if (existingEnrollment) {
      throw new Error('Aluno já está matriculado nesta turma');
    }

    // Verificar se aluno já tem matrícula ativa em outra turma
    const activeEnrollment = await Enrollment.findOne({
      where: {
        id_aluno: data.id_aluno,
        status: 'ativo'
      }
    });

    if (activeEnrollment && activeEnrollment.id_turma !== data.id_turma) {
      throw new Error('Aluno já possui matrícula ativa em outra turma. Cancele ou transfira antes de criar nova matrícula.');
    }

    // Criar matrícula
    const enrollment = await Enrollment.create({
      id_aluno: data.id_aluno,
      id_turma: data.id_turma,
      status: data.status || 'ativo'
    } as any);

    // Atualizar turma_id no aluno
    await student.update({ turma_id: data.id_turma });

    return await this.findOne(enrollment.id_aluno, enrollment.id_turma);
  }

  /**
   * Atualiza uma matrícula
   */
  async update(id_aluno: number, id_turma: number, data: UpdateEnrollmentData) {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma
      }
    });

    if (!enrollment) {
      throw new Error('Matrícula não encontrada');
    }

    await enrollment.update(data);

    return await this.findOne(id_aluno, id_turma);
  }

  /**
   * Cancela uma matrícula
   */
  async cancel(id_aluno: number, id_turma: number) {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma
      }
    });

    if (!enrollment) {
      throw new Error('Matrícula não encontrada');
    }

    if (enrollment.status === 'cancelado') {
      throw new Error('Matrícula já está cancelada');
    }

    await enrollment.update({ status: 'cancelado' });

    // Remover turma_id do aluno
    const student = await Student.findByPk(id_aluno);
    if (student && student.turma_id === id_turma) {
      await student.update({ turma_id: null });
    }

    return await this.findOne(id_aluno, id_turma);
  }

  /**
   * Reativa uma matrícula trancada
   */
  async reactivate(id_aluno: number, id_turma: number) {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma
      }
    });

    if (!enrollment) {
      throw new Error('Matrícula não encontrada');
    }

    if (enrollment.status !== 'trancado') {
      throw new Error('Apenas matrículas trancadas podem ser reativadas');
    }

    await enrollment.update({
      status: 'ativo',
      data_fim: null
    });

    return await this.findOne(id_aluno, id_turma);
  }

  /**
   * Transfere aluno para outra turma
   */
  async transfer(id_aluno: number, id_turma_atual: number, id_nova_turma: number) {
    // Verificar se matrícula atual existe
    const currentEnrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma: id_turma_atual
      }
    });

    if (!currentEnrollment) {
      throw new Error('Matrícula atual não encontrada');
    }

    if (currentEnrollment.status !== 'ativo') {
      throw new Error('Apenas matrículas ativas podem ser transferidas');
    }

    // Verificar se nova turma existe
    const newClass = await Class.findByPk(id_nova_turma);
    if (!newClass) {
      throw new Error('Nova turma não encontrada');
    }

    // Verificar se já existe matrícula na nova turma
    const existingNewEnrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma: id_nova_turma
      }
    });

    if (existingNewEnrollment) {
      throw new Error('Aluno já possui matrícula nesta turma');
    }

    // Cancelar matrícula atual
    await currentEnrollment.update({ status: 'cancelado' });

    // Criar nova matrícula
    const newEnrollment = await Enrollment.create({
      id_aluno,
      id_turma: id_nova_turma,
      status: 'ativo'
    } as any);

    // Atualizar turma_id no aluno
    const student = await Student.findByPk(id_aluno);
    if (student) {
      await student.update({ turma_id: id_nova_turma });
    }

    return {
      matricula_cancelada: await this.findOne(id_aluno, id_turma_atual),
      matricula_nova: await this.findOne(id_aluno, id_nova_turma),
      message: 'Transferência realizada com sucesso'
    };
  }

  /**
   * Deleta uma matrícula
   */
  async delete(id_aluno: number, id_turma: number) {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno,
        id_turma
      }
    });

    if (!enrollment) {
      throw new Error('Matrícula não encontrada');
    }

    // Remover turma_id do aluno se for a matrícula ativa
    if (enrollment.status === 'ativo') {
      const student = await Student.findByPk(id_aluno);
      if (student && student.turma_id === id_turma) {
        await student.update({ turma_id: null });
      }
    }

    await enrollment.destroy();

    return { message: 'Matrícula deletada com sucesso' };
  }

  /**
   * Retorna estatísticas de matrículas
   */
  async getStatistics() {
    const total = await Enrollment.count();

    const porStatus = await Enrollment.findAll({
      attributes: [
        'status',
        [Enrollment.sequelize!.fn('COUNT', Enrollment.sequelize!.col('id_aluno')), 'quantidade']
      ],
      group: ['status'],
      raw: true
    });

    const porTurma = await Enrollment.findAll({
      attributes: [
        'id_turma',
        [Enrollment.sequelize!.fn('COUNT', Enrollment.sequelize!.col('id_aluno')), 'quantidade']
      ],
      include: [{
        model: Class,
        as: 'turma',
        attributes: ['nome']
      }],
      group: ['Enrollment.id_turma', 'turma.id'],
      raw: false
    });

    return {
      total,
      porStatus,
      porTurma
    };
  }
}

export default new EnrollmentService();
