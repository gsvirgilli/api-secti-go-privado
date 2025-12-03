import Candidate from './candidate.model.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import Course from '../courses/course.model.js';
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
      attributes: ['id', 'nome', 'cpf', 'email', 'telefone', 'data_nascimento', 'status', 'id_turma_desejada', 'turma_id', 'createdAt', 'updatedAt'],
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
    if (candidate.status === 'APROVADO') {
      throw new Error('Não é possível deletar candidato aprovado. O aluno já foi criado.');
    }

    await candidate.destroy();

    return { message: 'Candidato deletado com sucesso' };
  }

  /**
   * Aprova candidato e converte em aluno
   * @param id - ID do candidato
   * @param opcaoCurso - Qual curso aprovar: 1 (primeira opção) ou 2 (segunda opção). Se não informado, tenta a primeira com vaga.
   */
  async approve(id: number, opcaoCurso?: 1 | 2) {
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      throw new Error('Candidato não encontrado');
    }

    if (candidate.status === 'APROVADO') {
      throw new Error('Candidato já foi aprovado');
    }

    // Para esta versão simplificada, o candidato é aprovado e vinculado à turma desejada
    if (!candidate.id_turma_desejada) {
      throw new Error('Candidato não possui turma desejada definida');
    }

    // Buscar a turma desejada
    const turma = await Class.findByPk(candidate.id_turma_desejada);
    
    const turmaDisponivel = turma;
    
    if (!turmaDisponivel) {
      throw new Error('Turma não encontrada');
    }

    // Verificar se ainda há vagas na turma
    const Student = (await import('../students/student.model.js')).default;
    const alunosNaTurma = await Student.count({ where: { turma_id: turmaDisponivel.id } });
    const vagasDisponiveis = turmaDisponivel.vagas - alunosNaTurma;

    if (vagasDisponiveis <= 0) {
      throw new Error('Não há mais vagas disponíveis nesta turma. O candidato deve permanecer em lista de espera.');
    }

    const turmaId = turmaDisponivel.id;
    
    // Atualizar o candidato com a turma
    await candidate.update({ turma_id: turmaId });

    try {
      // Verificar se já existe aluno com este CPF (candidato já aprovado antes)
      const existingStudent = await Student.findOne({ where: { cpf: candidate.cpf } });
      if (existingStudent) {
        throw new Error('Este candidato já foi aprovado anteriormente e já possui cadastro como aluno');
      }

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
        turma_id: turmaId,
        status: 'ativo'
      } as any);

      // Atualizar status do candidato
      await candidate.update({ status: 'APROVADO' });

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

    if (candidate.status === 'APROVADO') {
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
  async createPublic(data: any, files?: any) {
    // 1. Validar CPF
    if (!this.validateCPF(data.cpf)) {
      throw new Error('CPF inválido. Verifique se digitou corretamente.');
    }

    // Limpar CPF e telefone para comparação
    const cleanCPF = data.cpf.replace(/\D/g, '');
    const cleanTelefone = data.telefone ? data.telefone.replace(/\D/g, '') : null;

    // 2. Verificar se CPF já está cadastrado como CANDIDATO
    const existingCandidateByCPF = await Candidate.findOne({
      where: { cpf: cleanCPF }
    });

    if (existingCandidateByCPF) {
      throw new Error('Este CPF já possui uma inscrição no sistema. Cada pessoa pode fazer apenas uma inscrição.');
    }

    // 3. Verificar se CPF já está cadastrado como ALUNO (já foi aprovado)
      if (await Student.findOne({ where: { cpf: cleanCPF } })) {
        throw new Error('Este CPF já está cadastrado como aluno. Você já foi aprovado em um processo seletivo anterior.');
      }

    // 4. Verificar se EMAIL já está cadastrado como CANDIDATO
    const existingCandidateByEmail = await Candidate.findOne({
      where: { email: data.email }
    });

    if (existingCandidateByEmail) {
      throw new Error('Este email já está cadastrado em outra inscrição. Use um email diferente.');
    }

    // 5. Verificar se EMAIL já está cadastrado como ALUNO
      if (await Student.findOne({ where: { email: data.email } })) {
        throw new Error('Este email já está cadastrado como aluno no sistema.');
      }

    // 6. Verificar se EMAIL já está cadastrado como USUÁRIO
    const existingUserByEmail = await User.findOne({
      where: { email: data.email }
    });

    if (existingUserByEmail) {
      throw new Error('Este email já está cadastrado no sistema. Use um email diferente.');
    }

    // 7. Verificar se TELEFONE já está cadastrado (se fornecido)
    if (cleanTelefone) {
      const existingCandidateByPhone = await Candidate.findOne({
        where: { telefone: cleanTelefone }
      });

      if (existingCandidateByPhone) {
        throw new Error('Este telefone já está cadastrado em outra inscrição. Use um telefone diferente.');
      }
    }

    // 8. Verificar se o curso existe
    const Course = (await import('../courses/course.model.js')).default;
    const course = await Course.findByPk(data.curso_id);

    if (!course) {
      throw new Error('Curso não encontrado');
    }

    // 5. Verificar disponibilidade de vagas nas turmas escolhidas
    // Converter formato de turno (MATUTINO -> MANHA, VESPERTINO -> TARDE, NOTURNO -> NOITE)
    const turnoMap: Record<string, string> = {
      'MATUTINO': 'MANHA',
      'VESPERTINO': 'TARDE',
      'NOTURNO': 'NOITE'
    };
    
    const turnoParaBusca = turnoMap[data.turno] || data.turno;
    
    // Buscar 1ª opção de turma
    const turma1 = await Class.findOne({
      where: {
        id_curso: data.curso_id,
        turno: turnoParaBusca
      }
    });

    if (!turma1) {
      throw new Error('Não há turmas disponíveis no turno selecionado para o curso escolhido');
    }

    // Buscar 2ª opção de turma (se fornecida)
    let turma2 = null;
    if (data.curso_id2 && data.turno2) {
      const turnoParaBusca2 = turnoMap[data.turno2] || data.turno2;
      turma2 = await Class.findOne({
        where: {
          id_curso: data.curso_id2,
          turno: turnoParaBusca2
        }
      });
    }

    // Contar quantos alunos já estão matriculados em cada turma
    const alunosNaTurma1 = await Student.count({ where: { turma_id: turma1.id } });
    const vagasDisponiveis1 = turma1.vagas - alunosNaTurma1;

    let vagasDisponiveis2 = 0;
    if (turma2) {
      const alunosNaTurma2 = await Student.count({ where: { turma_id: turma2.id } });
      vagasDisponiveis2 = turma2.vagas - alunosNaTurma2;
    }

    // Determinar status inicial baseado nas vagas
    let statusInicial: 'pendente' | 'lista_espera' = 'lista_espera';
    
    // Se pelo menos uma das turmas tem vaga, status é PENDENTE
    if (vagasDisponiveis1 > 0 || vagasDisponiveis2 > 0) {
      statusInicial = 'pendente';
    }

    // 6. Processar arquivos (se houver)
    const documentUrls: any = {};
    if (files) {
      // Mapear nomes de campos para campos do banco
      const fieldMapping: Record<string, string> = {
        'rg_frente': 'rg_frente_url',
        'rg_verso': 'rg_verso_url',
        'cpf_aluno': 'cpf_aluno_url',
        'comprovante_endereco': 'comprovante_endereco_url',
        'identidade_responsavel_frente': 'identidade_responsavel_frente_url',
        'identidade_responsavel_verso': 'identidade_responsavel_verso_url',
        'cpf_responsavel_doc': 'cpf_responsavel_url',
        'comprovante_escolaridade': 'comprovante_escolaridade_url',
        'foto_3x4': 'foto_3x4_url'
      };

      Object.keys(files).forEach((fieldName) => {
        const file = files[fieldName][0]; // Multer retorna array
        const dbFieldName = fieldMapping[fieldName];
        if (dbFieldName && file) {
          // Salvar caminho relativo do arquivo
          documentUrls[dbFieldName] = `/uploads/documents/${file.filename}`;
        }
      });
    }

    // 7. Criar candidatura com status PENDENTE
    const candidate = await Candidate.create({
      // Dados pessoais obrigatórios
      nome: data.nome,
      cpf: data.cpf.replace(/\D/g, ''),
      email: data.email.toLowerCase(),
      telefone: data.telefone?.replace(/\D/g, ''),
      data_nascimento: data.data_nascimento,
      
      // Dados pessoais adicionais
      rg: data.rg,
      sexo: data.sexo,
      deficiencia: data.deficiencia,
      telefone2: data.telefone2?.replace(/\D/g, ''),
      idade: data.idade,
      nome_mae: data.nome_mae,
      
      // Campos de endereço
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
      
      // Curso - segunda opção
      curso_id2: data.curso_id2,
      turno2: data.turno2,
      local_curso: data.local_curso,
      
      // Questionário Social
      raca_cor: data.raca_cor,
      renda_mensal: data.renda_mensal,
      pessoas_renda: data.pessoas_renda,
      tipo_residencia: data.tipo_residencia,
      itens_casa: data.itens_casa, // Já vem como string separada por vírgula
      
      // Programa Goianas
      goianas_ciencia: data.goianas_ciencia,
      
      // Responsável Legal
      menor_idade: data.menor_idade || false,
      nome_responsavel: data.nome_responsavel,
      cpf_responsavel: data.cpf_responsavel?.replace(/\D/g, ''),
      
      // Documentos (URLs dos arquivos)
      ...documentUrls,
      
      // Status inicial (baseado na disponibilidade de vagas)
      status: statusInicial
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
      vagas_disponiveis_opcao1: vagasDisponiveis1,
      vagas_disponiveis_opcao2: vagasDisponiveis2,
      mensagem: statusInicial === 'lista_espera' 
        ? 'Inscrição realizada! Você foi colocado na lista de espera pois não há vagas disponíveis no momento.' 
        : 'Inscrição realizada com sucesso! Aguarde a análise da sua candidatura.',
      createdAt: candidate.createdAt
    };
  }

  /**
   * Valida se CPF, email e telefone já estão em uso
   * Usado para validação prévia no formulário (antes de enviar todos os dados)
   */
  async validateUniqueFields(data: { cpf?: string; email?: string; telefone?: string }) {
    const errors: string[] = [];

    // Validar CPF
    if (data.cpf) {
      const cleanCPF = data.cpf.replace(/\D/g, '');
      
      console.log('🔍 Validando CPF:', cleanCPF);
      
      // Verificar se tem 11 dígitos
      if (cleanCPF.length !== 11) {
        errors.push('CPF deve ter 11 dígitos.');
      } else {
        // SEMPRE verificar no banco, independente da validação matemática
        // Verificar se já existe em candidatos
        const existingCandidateByCPF = await Candidate.findOne({
          where: { cpf: cleanCPF }
        });
        
        console.log('🔍 CPF em candidatos:', existingCandidateByCPF ? 'ENCONTRADO' : 'não encontrado');
        
        if (existingCandidateByCPF) {
          errors.push('Este CPF já possui uma inscrição no sistema. Cada pessoa pode fazer apenas uma inscrição.');
        }
        
        // Verificar se já existe em alunos
        const existingStudent = await Student.findOne({
          where: { cpf: cleanCPF }
        });
        
        console.log('🔍 CPF em alunos:', existingStudent ? 'ENCONTRADO' : 'não encontrado');
        
        if (existingStudent) {
          errors.push('Este CPF já está cadastrado como aluno. Você já foi aprovado em um processo seletivo anterior.');
        }
        
        // Validar formato (mas não bloquear se inválido, apenas avisar)
        if (!this.validateCPF(cleanCPF) && !existingCandidateByCPF && !existingStudent) {
          errors.push('CPF inválido. Verifique se digitou corretamente.');
        }
      }
    }

    // Validar Email
    if (data.email) {
      const email = data.email.trim().toLowerCase();
      
      console.log('🔍 Validando Email:', email);
      
      // Verificar se já existe em candidatos
      const existingCandidateByEmail = await Candidate.findOne({
        where: { email }
      });
      
      console.log('🔍 Email em candidatos:', existingCandidateByEmail ? 'ENCONTRADO' : 'não encontrado');
      
      if (existingCandidateByEmail) {
        errors.push('Este email já está cadastrado em outra inscrição. Use um email diferente.');
      }
      
      // Verificar se já existe em alunos
      const existingStudentByEmail = await Student.findOne({
        where: { email }
      });
      
      console.log('🔍 Email em alunos:', existingStudentByEmail ? 'ENCONTRADO' : 'não encontrado');
      
      if (existingStudentByEmail) {
        errors.push('Este email já está cadastrado como aluno no sistema.');
      }
      
      // Verificar se já existe em usuários
      const existingUserByEmail = await User.findOne({
        where: { email }
      });
      
      console.log('🔍 Email em usuarios:', existingUserByEmail ? 'ENCONTRADO' : 'não encontrado');
      
      if (existingUserByEmail) {
        errors.push('Este email já está cadastrado no sistema. Use um email diferente.');
      }
    }

    // Validar Telefone
    if (data.telefone) {
      const cleanTelefone = data.telefone.replace(/\D/g, '');
      
      console.log('🔍 Validando Telefone:', cleanTelefone);
      
      const existingCandidateByPhone = await Candidate.findOne({
        where: { telefone: cleanTelefone }
      });
      
      console.log('🔍 Telefone em candidatos:', existingCandidateByPhone ? 'ENCONTRADO' : 'não encontrado');
      
      if (existingCandidateByPhone) {
        errors.push('Este telefone já está cadastrado em outra inscrição. Use um telefone diferente.');
      }
    }

    console.log('🔍 Resultado final - Erros encontrados:', errors.length);
    console.log('🔍 Erros:', errors);

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default new CandidateService();
