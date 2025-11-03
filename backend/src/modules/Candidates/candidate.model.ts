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
  declare turma_id: number | null;
  declare status: 'pendente' | 'aprovado' | 'reprovado';
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
    allowNull: true, // Alterado para permitir null
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
  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'turmas',
      key: 'id',
    }
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'reprovado'),
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