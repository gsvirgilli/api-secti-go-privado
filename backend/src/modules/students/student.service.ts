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
 * Interface para dados de criação de aluno
 */
export interface CreateStudentData {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string | null;
  data_nascimento?: string | null;
  endereco?: string | null;
  id_curso?: number | null;
  id_turma?: number | null;
  status?: 'ativo' | 'trancado' | 'concluido' | 'desistente';
}

/**
 * Interface para dados de atualização de aluno
 */
interface UpdateStudentData {
  nome?: string;
  email?: string;
  telefone?: string;
  turma_id?: number | null;
  status?: 'ativo' | 'trancado' | 'concluido' | 'desistente';
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

    // Importar Class para o include
    const Class = (await import('../classes/class.model.js')).default;
    const Curso = (await import('../courses/course.model.js')).default;

    // Buscar alunos com paginação
    const data = await Student.findAll({
      where,
      include: [
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nome']
            }
          ]
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
   * Cria um novo aluno
   */
  async create(data: CreateStudentData) {
    // Limpar CPF
    const cleanCPF = data.cpf.replace(/\D/g, '');
    
    // Verificar se CPF já existe
    const existingStudent = await Student.findOne({ where: { cpf: cleanCPF } });
    if (existingStudent) {
      throw new Error('CPF já cadastrado');
    }
    
    // Verificar se email já existe
    const existingEmail = await Student.findOne({ where: { email: data.email.toLowerCase() } });
    if (existingEmail) {
      throw new Error('Email já cadastrado');
    }
    
    // Gerar matrícula única
    const year = new Date().getFullYear();
    const count = await Student.count();
    const matricula = `${year}${String(count + 1).padStart(6, '0')}`;
    
    // Converter data_nascimento se fornecida
    let parsedDate = null;
    if (data.data_nascimento) {
      if (data.data_nascimento.includes('/')) {
        const parts = data.data_nascimento.split('/');
        
        // Detectar formato: se o primeiro número > 12, é DD/MM/YYYY, senão pode ser MM/DD/YYYY
        if (parts.length === 3) {
          const firstNum = parseInt(parts[0]);
          const secondNum = parseInt(parts[1]);
          
          let day, month, year;
          
          if (firstNum > 12) {
            // Formato DD/MM/YYYY
            [day, month, year] = parts;
          } else if (secondNum > 12) {
            // Formato MM/DD/YYYY
            [month, day, year] = parts;
          } else {
            // Ambíguo, assumir MM/DD/YYYY (padrão americano do input date)
            [month, day, year] = parts;
          }
          
          parsedDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
          
          // Validar se a data é válida
          if (isNaN(parsedDate.getTime())) {
            parsedDate = null;
          }
        }
      } else {
        // Formato ISO ou outro
        parsedDate = new Date(data.data_nascimento);
        if (isNaN(parsedDate.getTime())) {
          parsedDate = null;
        }
      }
    }
    
    // Criar aluno
    const student = await Student.create({
      matricula,
      cpf: cleanCPF,
      nome: data.nome,
      email: data.email.toLowerCase(),
      telefone: data.telefone || null,
      data_nascimento: parsedDate,
      endereco: data.endereco || null,
      turma_id: data.id_turma || null,
      status: data.status || 'ativo',
      candidato_id: null,
      usuario_id: null
    });
    
    return student;
  }

  /**
   * Busca um aluno por ID
   */
  async findById(id: number) {
    // Importar Class para o include
    const Class = (await import('../classes/class.model.js')).default;
    const Curso = (await import('../courses/course.model.js')).default;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: Class,
          as: 'turma',
          attributes: ['id', 'nome', 'turno'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nome']
            }
          ]
        }
      ]
    });

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
   * Transfere um aluno para lista de espera
   * Remove o aluno e retorna o candidato para status lista_espera
   * 
   * Regras:
   * - Aluno DEVE ter candidato_id (veio de aprovação)
   * - Aluno DEVE ter turma_id (está matriculado em turma)
   * - Ao transferir: candidato volta para lista_espera SEM turma (aguardando nova vaga)
   * - Preserva o turno da turma do aluno no candidato
   */
  async transferToWaitingList(id: number, motivo?: string) {
    const student = await Student.findByPk(id);

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // Validar que aluno tem candidato vinculado (foi aprovado de candidatura)
    if (!student.candidato_id) {
      throw new Error('Este aluno não possui candidatura vinculada e não pode ser transferido para lista de espera');
    }

    // Validar que aluno está matriculado em uma turma
    // Se não tem turma, não deveria estar como aluno
    if (!student.turma_id) {
      throw new Error('Este aluno não está vinculado a nenhuma turma. Alunos sem turma devem estar na lista de espera como candidatos');
    }

    const Candidate = (await import('../Candidates/candidate.model.js')).default;
    const Class = (await import('../classes/class.model.js')).default;
    
    const candidate = await Candidate.findByPk(student.candidato_id);
    if (!candidate) {
      throw new Error('Candidatura vinculada não encontrada');
    }

    // Buscar a turma do aluno para obter o turno
    const studentClass = await Class.findByPk(student.turma_id);
    if (!studentClass) {
      throw new Error('Turma do aluno não encontrada');
    }

    // Mapear turno da turma para o formato do candidato
    const turnoMapeado = {
      'MANHA': 'MATUTINO',
      'TARDE': 'VESPERTINO', 
      'NOITE': 'NOTURNO',
      'INTEGRAL': 'MATUTINO' // fallback para integral
    }[studentClass.turno] || studentClass.turno;

    // Atualizar candidato para lista de espera
    // Preserva o turno da turma atual e remove turma_id para que possa ser reavaliado
    await candidate.update({ 
      status: 'lista_espera',
      turno: turnoMapeado, // Preserva o turno da turma atual (mapeado)
      turma_id: null  // Candidato fica sem turma específica, aguardando nova vaga
    });

    // Remover o aluno (libera vaga na turma)
    await student.destroy();

    return {
      message: 'Aluno transferido para lista de espera com sucesso',
      candidate,
      motivo
    };
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
