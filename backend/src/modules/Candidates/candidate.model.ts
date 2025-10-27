import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Class from '../classes/class.model.js';

/**
 * Modelo de Candidato
 * Representa pessoas interessadas em participar de cursos
 */
class Candidate extends Model {
  public id!: number;
  public nome!: string;
  public cpf!: string;
  public email!: string;
  public telefone!: string | null;
  public data_nascimento!: Date;
  public turma_id!: number;
  public status!: 'pendente' | 'aprovado' | 'reprovado';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Data de nascimento é obrigatória'
      }
    }
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