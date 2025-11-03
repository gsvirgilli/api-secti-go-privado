import Candidate from './candidate.model.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import User from '../users/user.model.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { 
  PaginatedResponse, 
  calculateOffset, 
  createPagination, 
  normalizePagination 
} from '../../utils/pagination.js';

/**
 * Interface para filtros de candidatos
 */
interface CandidateFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  status?: string;
  turma_id?: number; // Alterado de id_turma_desejada
  page?: number;
  limit?: number;
}

/**
 * Interface para dados de criação de candidato
 */
interface CreateCandidateData {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  status?: string;
  turma_id?: number; // Alterado de id_turma_desejada
}

/**
 * Interface para dados de atualização de candidato
 */
interface UpdateCandidateData {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: string;
  turma_id?: number; // Alterado de id_turma_desejada
}

/**
 * Service de Candidatos
 * Contém toda a lógica de negócio relacionada a candidatos
 */
class CandidateService {
  /**
   * Validar CPF (algoritmo simplificado)
   */
  private validateCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) {
      return false;
    }
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return false;
    }
    
    return true;
  }

  /**
   * Gerar matrícula única para aluno
   */
  private async generateMatricula(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await Student.count();
    const sequence = (count + 1).toString().padStart(4, '0');
    return `${year}${sequence}`;
  }

  /**
   * Lista todos os candidatos com filtros opcionais e paginação
   */
  async list(filters: CandidateFilters = {}): Promise<PaginatedResponse<Candidate>> {
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

    // Filtro por status
    if (filters.status) {
      where.status = filters.status;
    }

    // Filtro por turma desejada
    if (filters.turma_id) {
      where.turma_id = filters.turma_id;
    }

    // Buscar total de registros
    const total = await Candidate.count({ where });

    // Buscar candidatos com paginação
    const data = await Candidate.findAll({
      where,
      include: [{
        model: Class,
        as: 'turma',
        attributes: ['id', 'nome'],
        required: false
      }],
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
   * Busca um candidato por ID
   */
  async findById(id: number) {
    const candidate = await Candidate.findByPk(id, {
      include: [{
        model: Class,
        as: 'turma',
        attributes: ['id', 'nome']
      }]
    });

    if (!candidate) {
      throw new Error('Candidato não encontrado');
    }

    return candidate;
  }

  /**
   * Busca candidato por CPF
   */
  async findByCPF(cpf: string) {
    const cleanCPF = cpf.replace(/\D/g, '');
    return await Candidate.findOne({ where: { cpf: cleanCPF } });
  }

  /**
   * Cria um novo candidato
   */
  async create(data: CreateCandidateData) {
    // Validar CPF
    const cleanCPF = data.cpf.replace(/\D/g, '');
    
    if (!this.validateCPF(cleanCPF)) {
      throw new Error('CPF inválido');
    }

    // Verificar se CPF já existe
    const existingCandidate = await this.findByCPF(cleanCPF);
    if (existingCandidate) {
      throw new Error('CPF já cadastrado como candidato');
    }

    // Verificar se CPF já é aluno
    const existingStudent = await Student.findOne({ where: { cpf: cleanCPF } });
    if (existingStudent) {
      throw new Error('CPF já cadastrado como aluno');
    }

    // Verificar se turma desejada existe (se fornecida)
    if (data.turma_id) {
      const turma = await Class.findByPk(data.turma_id);
      if (!turma) {
        throw new Error('Turma não encontrada');
      }
    }

    // Criar candidato
    const candidate = await Candidate.create({
      ...data,
      cpf: cleanCPF
    } as any);

    // Retornar com informações da turma
    return await this.findById(candidate.id);
  }

  /**
   * Atualiza um candidato existente
   */
  async update(id: number, data: UpdateCandidateData) {
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      throw new Error('Candidato não encontrado');
    }

    // Não permitir alterar status aprovado para outro
    if (candidate.status === 'aprovado' && data.status && data.status !== 'aprovado') {
      throw new Error('Não é possível alterar status de candidato aprovado');
    }

    // Verificar se turma desejada existe (se fornecida)
    if (data.turma_id) {
      const turma = await Class.findByPk(data.turma_id);
      if (!turma) {
        throw new Error('Turma não encontrada');
      }
    }

    // Atualizar candidato
    await candidate.update(data);

    // Retornar com informações da turma
    return await this.findById(candidate.id);
  }

  /**
   * Deleta um candidato
   */
  async delete(id: number) {
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      throw new Error('Candidato não encontrado');
    }

    // Não permitir deletar candidato aprovado
    if (candidate.status === 'aprovado') {
      throw new Error('Não é possível deletar candidato aprovado. O aluno já foi criado.');
    }

    await candidate.destroy();

    return { message: 'Candidato deletado com sucesso' };
  }

  /**
   * Aprova candidato e converte em aluno
   */
  async approve(id: number) {
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      throw new Error('Candidato não encontrado');
    }

    if (candidate.status === 'aprovado') {
      throw new Error('Candidato já foi aprovado');
    }

    // Verificar se candidato tem turma
    if (!candidate.turma_id) {
      throw new Error('Candidato precisa ter uma turma desejada para ser aprovado');
    }

    try {
      // Gerar matrícula
      const matricula = await this.generateMatricula();

      // Verificar se já existe um usuário com esse email
      const existingUser = await User.findOne({ where: { email: candidate.email } });
      
      let usuario;
      if (existingUser) {
        // Se já existe, usar o usuário existente
        usuario = existingUser;
      } else {
        // Criar usuário para o aluno
        // Senha padrão será o CPF (deve ser alterada no primeiro acesso)
        const senhaTemporaria = candidate.cpf;
        const senhaHash = await bcrypt.hash(senhaTemporaria, 8);

        usuario = await User.create({
          nome: candidate.nome,
          email: candidate.email,
          senha_hash: senhaHash,
          role: 'ALUNO'
        } as any);
      }

      // Criar aluno com os campos obrigatórios
      const student = await Student.create({
        candidato_id: candidate.id,
        usuario_id: usuario.id,
        matricula,
        cpf: candidate.cpf,
        nome: candidate.nome,
        email: candidate.email,
        turma_id: candidate.turma_id,
        status: 'ativo'
      } as any);

      // Atualizar status do candidato
      await candidate.update({ status: 'aprovado' });

      return {
        candidate,
        student,
        usuario,
        message: 'Candidato aprovado e convertido em aluno com sucesso',
        senhaTemporaria: existingUser ? undefined : candidate.cpf
      };
    } catch (error) {
      console.error('Erro detalhado ao aprovar candidato:', error);
      throw error;
    }
  }

  /**
   * Rejeita candidato
   */
  async reject(id: number, motivo: string) {
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      throw new Error('Candidato não encontrado');
    }

    if (candidate.status === 'aprovado') {
      throw new Error('Não é possível rejeitar candidato aprovado');
    }

    await candidate.update({ status: 'reprovado' });

    return {
      candidate,
      message: `Candidato rejeitado: ${motivo}`
    };
  }

  /**
   * Retorna estatísticas de candidatos
   */
  async getStatistics() {
    const total = await Candidate.count();
    
    const porStatus = await Candidate.findAll({
      attributes: [
        'status',
        [Candidate.sequelize!.fn('COUNT', Candidate.sequelize!.col('id')), 'quantidade']
      ],
      group: ['status']
    });

    const porTurma = await Candidate.findAll({
      attributes: [
        'turma_id',
        [Candidate.sequelize!.fn('COUNT', Candidate.sequelize!.col('Candidate.id')), 'quantidade']
      ],
      include: [{
        model: Class,
        as: 'turma',
        attributes: ['nome'],
        required: false
      }],
      where: {
        turma_id: { [Op.ne]: null }
      },
      group: ['Candidate.turma_id']
    });

    return {
      total,
      porStatus,
      porTurma
    };
  }

  /**
   * Cria uma candidatura pública (sem autenticação)
   * Valida CPF único, email único, curso existe e turno disponível
   */
  async createPublic(data: any) {
    // 1. Validar CPF
    if (!this.validateCPF(data.cpf)) {
      throw new Error('CPF inválido');
    }

    // 2. Verificar se CPF já está cadastrado
    const existingCandidate = await Candidate.findOne({
      where: { cpf: data.cpf.replace(/\D/g, '') }
    });

    if (existingCandidate) {
      throw new Error('CPF já cadastrado');
    }

    // 3. Verificar se email já está cadastrado
    const existingEmail = await Candidate.findOne({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw new Error('Email já cadastrado');
    }

    // 4. Verificar se o curso existe
    const Course = (await import('../courses/course.model.js')).default;
    const course = await Course.findByPk(data.curso_id);

    if (!course) {
      throw new Error('Curso não encontrado');
    }

    // 5. Verificar se existe turma disponível para o curso e turno escolhidos
    const availableClass = await Class.findOne({
      where: {
        id_curso: data.curso_id,
        turno: data.turno
      }
    });

    if (!availableClass) {
      throw new Error('Turno não disponível para este curso');
    }

    // 6. Criar candidatura com status PENDENTE
    const candidate = await Candidate.create({
      nome: data.nome,
      cpf: data.cpf.replace(/\D/g, ''),
      email: data.email.toLowerCase(),
      telefone: data.telefone?.replace(/\D/g, ''),
      data_nascimento: data.data_nascimento,
      // Campos de endereço (se o model suportar)
      cep: data.cep?.replace(/\D/g, ''),
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado?.toUpperCase(),
      // Curso e turno desejados
      curso_id: data.curso_id,
      turno: data.turno,
      status: 'pendente'
    });

    return {
      id: candidate.id,
      nome: candidate.nome,
      email: candidate.email,
      status: candidate.status,
      curso: {
        id: course.id,
        nome: course.nome
      },
      turno: data.turno,
      createdAt: candidate.createdAt
    };
  }
}

export default new CandidateService();
