import Candidate from './candidate.model.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import { Op } from 'sequelize';

/**
 * Interface para filtros de candidatos
 */
interface CandidateFilters {
  nome?: string;
  cpf?: string;
  email?: string;
  status?: string;
  id_turma_desejada?: number;
}

/**
 * Interface para dados de criação de candidato
 */
interface CreateCandidateData {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  status?: string;
  id_turma_desejada?: number;
}

/**
 * Interface para dados de atualização de candidato
 */
interface UpdateCandidateData {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: string;
  id_turma_desejada?: number;
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
   * Lista todos os candidatos com filtros opcionais
   */
  async list(filters: CandidateFilters = {}) {
    const where: any = {};

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
    if (filters.id_turma_desejada) {
      where.id_turma_desejada = filters.id_turma_desejada;
    }

    const candidates = await Candidate.findAll({
      where,
      include: [{
        model: Class,
        as: 'turma',
        attributes: ['id', 'nome'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });

    return candidates;
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
    if (data.id_turma_desejada) {
      const turma = await Class.findByPk(data.id_turma_desejada);
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
    if (data.id_turma_desejada) {
      const turma = await Class.findByPk(data.id_turma_desejada);
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

    // Gerar matrícula
    const matricula = await this.generateMatricula();

    // Criar aluno
    const student = await Student.create({
      matricula,
      cpf: candidate.cpf,
      nome: candidate.nome,
      email: candidate.email,
      telefone: candidate.telefone
    } as any);

    // Atualizar status do candidato
    await candidate.update({ status: 'aprovado' });

    return {
      candidate,
      student,
      message: 'Candidato aprovado e convertido em aluno com sucesso'
    };
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
}

export default new CandidateService();
