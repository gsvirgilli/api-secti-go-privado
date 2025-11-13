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
  declare data_nascimento: Date | null;
  
  // Dados pessoais adicionais
  declare rg: string | null;
  declare sexo: 'FEMININO' | 'MASCULINO' | 'OUTRO' | 'PREFIRO_NAO_INFORMAR' | null;
  declare deficiencia: 'NAO' | 'AUDITIVA' | 'VISUAL' | 'FISICA' | 'INTELECTUAL' | 'MULTIPLA' | null;
  declare telefone2: string | null;
  declare idade: number | null;
  declare nome_mae: string | null;
  
  // Endereço
  declare cep: string | null;
  declare rua: string | null;
  declare numero: string | null;
  declare complemento: string | null;
  declare bairro: string | null;
  declare cidade: string | null;
  declare estado: string | null;
  
  // Curso e turno desejados
  declare curso_id: number | null;
  declare turno: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO' | null;
  declare curso_id2: number | null;
  declare turno2: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO' | null;
  declare local_curso: string | null;
  declare turma_id: number | null;
  
  // Questionário Social
  declare raca_cor: 'BRANCO' | 'PARDO' | 'NEGRO' | 'INDIGENA' | 'AMARELO' | null;
  declare renda_mensal: 'SEM_RENDA' | 'ATE_MEIO_SM' | 'ATE_1_SM' | '1_A_2_SM' | '2_A_3_SM' | '3_A_4_SM' | 'ACIMA_5_SM' | null;
  declare pessoas_renda: string | null;
  declare tipo_residencia: 'PROPRIA_QUITADA' | 'PROPRIA_FINANCIADA' | 'ALUGADA' | 'HERDADA' | 'CEDIDA' | null;
  declare itens_casa: string | null;
  
  // Programa Goianas
  declare goianas_ciencia: 'SIM' | 'NAO' | null;
  
  // Responsável Legal
  declare menor_idade: boolean;
  declare nome_responsavel: string | null;
  declare cpf_responsavel: string | null;
  
  // Documentos
  declare rg_frente_url: string | null;
  declare rg_verso_url: string | null;
  declare cpf_aluno_url: string | null;
  declare comprovante_endereco_url: string | null;
  declare identidade_responsavel_frente_url: string | null;
  declare identidade_responsavel_verso_url: string | null;
  declare cpf_responsavel_url: string | null;
  declare comprovante_escolaridade_url: string | null;
  declare foto_3x4_url: string | null;
  
  declare status: 'pendente' | 'aprovado' | 'reprovado' | 'lista_espera';
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
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
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
  nome_mae: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Campos de endereço
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
  // Curso e turno desejados
  curso_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  curso_id2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cursos',
      key: 'id',
    }
  },
  turno2: {
    type: DataTypes.ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO'),
    allowNull: true,
  },
  local_curso: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'turmas',
      key: 'id',
    }
  },
  // Questionário Social
  raca_cor: {
    type: DataTypes.ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'),
    allowNull: true,
  },
  renda_mensal: {
    type: DataTypes.ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM'),
    allowNull: true,
  },
  pessoas_renda: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  tipo_residencia: {
    type: DataTypes.ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'),
    allowNull: true,
  },
  itens_casa: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  // Programa Goianas
  goianas_ciencia: {
    type: DataTypes.ENUM('SIM', 'NAO'),
    allowNull: true,
  },
  // Responsável Legal
  menor_idade: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  nome_responsavel: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  cpf_responsavel: {
    type: DataTypes.STRING(11),
    allowNull: true,
  },
  // Documentos
  rg_frente_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rg_verso_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cpf_aluno_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  comprovante_endereco_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  identidade_responsavel_frente_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  identidade_responsavel_verso_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cpf_responsavel_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  comprovante_escolaridade_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  foto_3x4_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'reprovado', 'lista_espera'),
    allowNull: false,
    defaultValue: 'pendente',
  },
}, {
  sequelize,
  tableName: 'candidatos',
  timestamps: true,
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

// Associações
Candidate.belongsTo(Class, {
  foreignKey: 'turma_id',
  as: 'turma'
});

export default Candidate;