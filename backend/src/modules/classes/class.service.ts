import Class from './class.model.js';
import Curso from '../courses/course.model.js';
import { Op } from 'sequelize';

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
   * Lista todas as turmas com filtros opcionais
   */
  async list(filters: ClassFilters = {}) {
    const where: any = {};

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

    const turmas = await Class.findAll({
      where,
      include: [{
        model: Curso,
        as: 'curso',
        attributes: ['id', 'nome', 'carga_horaria']
      }],
      order: [['createdAt', 'DESC']]
    });

    return turmas;
  }

  /**
   * Busca uma turma por ID
   */
  async findById(id: number) {
    const turma = await Class.findByPk(id, {
      include: [{
        model: Curso,
        as: 'curso',
        attributes: ['id', 'nome', 'carga_horaria', 'descricao']
      }]
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
    const total = await Class.count();
    
    const porTurno = await Class.findAll({
      attributes: [
        'turno',
        [Class.sequelize!.fn('COUNT', Class.sequelize!.col('id')), 'quantidade']
      ],
      group: ['turno']
    });

    const porCurso = await Class.findAll({
      attributes: [
        'id_curso',
        [Class.sequelize!.fn('COUNT', Class.sequelize!.col('id')), 'quantidade']
      ],
      include: [{
        model: Curso,
        as: 'curso',
        attributes: ['nome']
      }],
      group: ['id_curso', 'curso.id']
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
      porTurno,
      porCurso
    };
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
}

export default new ClassService();
