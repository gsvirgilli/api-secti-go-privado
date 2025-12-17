import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Class from '../classes/class.model.js';

/**
 * Modelo de Candidato
 * Representa pessoas interessadas em participar de cursos
 */
class Candidate extends Model {
  declare id: number;
  declare nome: string;
  declare cpf: string;
  declare email: string;
  declare telefone: string | null;
  declare dataNascimento: Date | null;
  declare status: 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'LISTA_ESPERA';
  declare idTurmaDesejada: number | null;
  declare turmaId: number | null;
  declare rg?: string | null;
  declare sexo?: string | null;
  declare deficiencia?: string | null;
  declare telefone2?: string | null;
  declare idade?: number | null;
  declare nomeMae?: string | null;
  declare cep?: string | null;
  declare rua?: string | null;
  declare numero?: string | null;
  declare complemento?: string | null;
  declare bairro?: string | null;
  declare cidade?: string | null;
  declare estado?: string | null;
  declare cursoId?: number | null;
  declare turno?: string | null;
  declare cursoId2?: number | null;
  declare turno2?: string | null;
  declare localCurso?: string | null;
  declare racaCor?: string | null;
  declare rendaMensal?: string | null;
  declare pessoasRenda?: string | null;
  declare tipoResidencia?: string | null;
  declare itensCasa?: string | null;
  declare goianasCiencia?: string | null;
  declare menoridade?: boolean | null;
  declare nomeResponsavel?: string | null;
  declare cpfResponsavel?: string | null;
  declare rgFrenteUrl?: string | null;
  declare rgVersoUrl?: string | null;
  declare cpfAlunoUrl?: string | null;
  declare comprovante_endereco_url?: string | null;
  declare identidadeResponsavelFrenteUrl?: string | null;
  declare identidadeResponsavelVersoUrl?: string | null;
  declare cpfResponsavelUrl?: string | null;
  declare comprovanteEscolaridadeUrl?: string | null;
  declare foto3x4Url?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Candidate.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'Nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'CPF é obrigatório'
      },
      len: {
        args: [11, 11],
        msg: 'CPF deve ter 11 dígitos'
      },
      isNumeric: {
        msg: 'CPF deve conter apenas números'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Email é obrigatório'
      },
      isEmail: {
        msg: 'Email deve ser válido'
      }
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'data_nascimento',
  },
  status: {
    type: DataTypes.ENUM('PENDENTE', 'APROVADO', 'REPROVADO', 'LISTA_ESPERA'),
    allowNull: false,
    defaultValue: 'PENDENTE',
  },
  idTurmaDesejada: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_turma_desejada',
    references: {
      model: 'turmas',
      key: 'id',
    }
  },
  turmaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'turma_id',
    references: {
      model: 'turmas',
      key: 'id',
    }
  },

  // Dados pessoais adicionais
  rg: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  sexo: {
    type: DataTypes.ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'),
    allowNull: true,
  },
  deficiencia: {
    type: DataTypes.ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'),
    allowNull: true,
  },
  telefone2: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nomeMae: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nome_mae',
  },

  // Endereço
  cep: {
    type: DataTypes.STRING(8),
    allowNull: true,
  },
  rua: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  complemento: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },

  // Curso desejado
  cursoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'curso_id',
    references: {
      model: 'cursos',
      key: 'id',
    }
  },
  turno: {
    type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO'),
    allowNull: true,
  },

  // Curso - segunda opção
  cursoId2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'curso_id2',
    references: {
      model: 'cursos',
      key: 'id',
    }
  },
  turno2: {
    type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO'),
    allowNull: true,
  },
  localCurso: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'local_curso',
  },

  // Questionário Social
  racaCor: {
    type: DataTypes.ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'),
    allowNull: true,
    field: 'raca_cor',
  },
  rendaMensal: {
    type: DataTypes.ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM'),
    allowNull: true,
    field: 'renda_mensal',
  },
  pessoasRenda: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'pessoas_renda',
  },
  tipoResidencia: {
    type: DataTypes.ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'),
    allowNull: true,
    field: 'tipo_residencia',
  },
  itensCasa: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'itens_casa',
  },

  // Programa Goianas
  goianasCiencia: {
    type: DataTypes.ENUM('SIM', 'NAO'),
    allowNull: true,
    field: 'goianas_ciencia',
  },

  // Responsável Legal
  menoridade: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'menor_idade',
    defaultValue: false,
  },
  nomeResponsavel: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nome_responsavel',
  },
  cpfResponsavel: {
    type: DataTypes.STRING(11),
    allowNull: true,
    field: 'cpf_responsavel',
  },

  // Documentos
  rgFrenteUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'rg_frente_url',
  },
  rgVersoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'rg_verso_url',
  },
  cpfAlunoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cpf_aluno_url',
  },
  comprovante_endereco_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  identidadeResponsavelFrenteUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'identidade_responsavel_frente_url',
  },
  identidadeResponsavelVersoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'identidade_responsavel_verso_url',
  },
  cpfResponsavelUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cpf_responsavel_url',
  },
  comprovanteEscolaridadeUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'comprovante_escolaridade_url',
  },
  foto3x4Url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'foto_3x4_url',
  },
}, {
  sequelize,
  tableName: 'candidatos',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['cpf']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['status']
    }
  ]
});

// Associações serão configuradas em src/models/associations.ts

export default Candidate;