import Instructor from './instructor.model.js';
import InstructorClass from '../instructor_classes/instructor_class.model.js';
import Class from '../classes/class.model.js';
import Course from '../courses/course.model.js';
import { Op } from 'sequelize';
import { AppError } from '../../utils/AppError.js';
import { 
  PaginatedResponse, 
  calculateOffset, 
  createPagination, 
  normalizePagination 
} from '../../utils/pagination.js';

/**
 * Interface para filtros de instrutores
 */
interface InstructorFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  especialidade?: string;
  page?: number;
  limit?: number;
}

/**
 * Interface para dados de criação de instrutor
 */
interface CreateInstructorData {
  cpf: string;
  nome: string;
  email: string;
  especialidade?: string | null;
}

/**
 * Interface para dados de atualização de instrutor
 */
interface UpdateInstructorData {
  cpf?: string;
  nome?: string;
  email?: string;
  endereco?: string | null;
  data_nascimento?: string | null;
  especialidade?: string | null;
  experiencia?: string | null;
  status?: string | null;
}

/**
 * Service de Instrutores
 * Contém toda a lógica de negócio relacionada a instrutores
 */
class InstructorService {
  /**
   * Lista todos os instrutores com filtros opcionais e paginação
   */
  async list(filters: InstructorFilters = {}): Promise<PaginatedResponse<Instructor>> {
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

    // Filtro por especialidade
    if (filters.especialidade) {
      where.especialidade = {
        [Op.like]: `%${filters.especialidade}%`
      };
    }

    // Buscar total de registros
    const total = await Instructor.count({ where });

    // Buscar instrutores com paginação e incluir turmas associadas
    const data = await Instructor.findAll({
      where,
      include: [
        {
          model: Class,
          as: 'turmas',
          through: { attributes: [] }, // Não incluir atributos da tabela de junção
          attributes: ['id', 'nome', 'status'],
          include: [
            {
              model: Course,
              as: 'curso',
              attributes: ['id', 'nome']
            }
          ]
        }
      ],
      order: [['nome', 'ASC']],
      limit,
      offset: calculateOffset(page, limit)
    });

    return {
      data,
      pagination: createPagination(page, limit, total)
    };
  }

  /**
   * Busca um instrutor por ID
   */
  async findById(id: number) {
    const instructor = await Instructor.findByPk(id);

    if (!instructor) {
      throw new AppError('Instrutor não encontrado', 404);
    }

    return instructor;
  }

  /**
   * Busca instrutor por CPF
   */
  async findByCPF(cpf: string) {
    const cleanCPF = cpf.replace(/\D/g, '');
    
    const instructor = await Instructor.findOne({ 
      where: { cpf: cleanCPF } 
    });
    
    if (!instructor) {
      throw new AppError('Instrutor não encontrado', 404);
    }

    return instructor;
  }

  /**
   * Busca instrutor por email
   */
  async findByEmail(email: string) {
    const instructor = await Instructor.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (!instructor) {
      throw new AppError('Instrutor não encontrado', 404);
    }

    return instructor;
  }

  /**
   * Cria um novo instrutor
   */
  async create(data: CreateInstructorData) {
    // Valida CPF único
    const cleanCPF = data.cpf.replace(/\D/g, '');
    const existingByCPF = await Instructor.findOne({ 
      where: { cpf: cleanCPF } 
    });

    if (existingByCPF) {
      throw new AppError('Já existe um instrutor cadastrado com este CPF', 400);
    }

    // Valida email único
    const existingByEmail = await Instructor.findOne({ 
      where: { email: data.email.toLowerCase() } 
    });

    if (existingByEmail) {
      throw new AppError('Já existe um instrutor cadastrado com este email', 400);
    }

    // Cria o instrutor
    const instructor = await Instructor.create({
      cpf: cleanCPF,
      nome: data.nome,
      email: data.email.toLowerCase(),
      especialidade: data.especialidade || null
    });

    return instructor;
  }

  /**
   * Atualiza um instrutor
   */
  async update(id: number, data: UpdateInstructorData) {
    const instructor = await this.findById(id);

    // Se está atualizando o email, verifica se já não existe
    if (data.email) {
      const existingByEmail = await Instructor.findOne({ 
        where: { 
          email: data.email.toLowerCase(),
          id: { [Op.ne]: id }
        } 
      });

      if (existingByEmail) {
        throw new AppError('Já existe um instrutor cadastrado com este email', 400);
      }
    }

    // Atualiza apenas os campos fornecidos
    if (data.cpf !== undefined) instructor.cpf = data.cpf;
    if (data.nome !== undefined) instructor.nome = data.nome;
    if (data.email !== undefined) instructor.email = data.email.toLowerCase();
    if (data.endereco !== undefined) instructor.endereco = data.endereco;
    if (data.data_nascimento !== undefined) instructor.data_nascimento = data.data_nascimento;
    if (data.especialidade !== undefined) instructor.especialidade = data.especialidade;
    if (data.experiencia !== undefined) instructor.experiencia = data.experiencia;
    if (data.status !== undefined) instructor.status = data.status;

    await instructor.save();

    return instructor;
  }

  /**
   * Deleta um instrutor
   */
  async delete(id: number) {
    const instructor = await this.findById(id);

    // Verifica se o instrutor possui turmas associadas
    const classCount = await InstructorClass.count({ 
      where: { id_instrutor: id } 
    });

    if (classCount > 0) {
      throw new AppError(
        `Não é possível deletar o instrutor. Existem ${classCount} turma(s) associada(s) a este instrutor.`,
        400
      );
    }

    await instructor.destroy();
  }

  /**
   * Lista todas as turmas de um instrutor
   */
  async getClasses(id: number) {
    await this.findById(id); // Valida se o instrutor existe

    const instructorClasses = await InstructorClass.findAll({
      where: { id_instrutor: id },
      include: [
        {
          model: Class,
          as: 'turma',
          include: [
            {
              model: Course,
              as: 'curso',
              attributes: ['id', 'nome', 'descricao']
            }
          ]
        }
      ]
    });

    return instructorClasses.map(ic => ic.get({ plain: true }));
  }

  /**
   * Atribui um instrutor a uma turma
   */
  async assignToClass(instructorId: number, classId: number) {
    // Valida se o instrutor existe
    await this.findById(instructorId);

    // Valida se a turma existe
    const classExists = await Class.findByPk(classId);
    if (!classExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    // Verifica se já existe a associação
    const existingAssociation = await InstructorClass.findOne({
      where: {
        id_instrutor: instructorId,
        id_turma: classId
      }
    });

    if (existingAssociation) {
      throw new AppError('Instrutor já está atribuído a esta turma', 400);
    }

    // Cria a associação
    const instructorClass = await InstructorClass.create({
      id_instrutor: instructorId,
      id_turma: classId
    });

    return instructorClass;
  }

  /**
   * Desatribui um instrutor de uma turma
   */
  async unassignFromClass(instructorId: number, classId: number) {
    // Valida se o instrutor existe
    await this.findById(instructorId);

    // Busca a associação
    const association = await InstructorClass.findOne({
      where: {
        id_instrutor: instructorId,
        id_turma: classId
      }
    });

    if (!association) {
      throw new AppError('Instrutor não está atribuído a esta turma', 404);
    }

    // Remove a associação
    await association.destroy();
  }

  /**
   * Retorna estatísticas dos instrutores
   */
  async getStatistics() {
    const totalInstructors = await Instructor.count();
    
    const instructorsWithClasses = await InstructorClass.findAll({
      attributes: ['id_instrutor'],
      group: ['id_instrutor']
    });

    const totalWithClasses = instructorsWithClasses.length;
    const totalWithoutClasses = totalInstructors - totalWithClasses;

    // Instrutor com mais turmas
    const classCountByInstructor = await InstructorClass.findAll({
      attributes: [
        'id_instrutor',
        [InstructorClass.sequelize!.fn('COUNT', InstructorClass.sequelize!.col('id_turma')), 'total']
      ],
      group: ['id_instrutor'],
      order: [[InstructorClass.sequelize!.literal('total'), 'DESC']],
      limit: 1,
      raw: true
    });

    let mostActiveInstructor = null;
    if (classCountByInstructor.length > 0) {
      const instructorId = (classCountByInstructor[0] as any).id_instrutor;
      const instructor = await Instructor.findByPk(instructorId);
      mostActiveInstructor = {
        id: instructor!.id,
        nome: instructor!.nome,
        totalTurmas: (classCountByInstructor[0] as any).total
      };
    }

    return {
      totalInstructors,
      totalWithClasses,
      totalWithoutClasses,
      mostActiveInstructor
    };
  }
}

export default new InstructorService();
