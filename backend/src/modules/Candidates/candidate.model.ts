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
  declare status: 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'LISTA_ESPERA';
  declare id_turma_desejada: number | null;
  declare turma_id: number | null;
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
  status: {
    type: DataTypes.ENUM('PENDENTE', 'APROVADO', 'REPROVADO', 'LISTA_ESPERA'),
    allowNull: false,
    defaultValue: 'PENDENTE',
  },
  id_turma_desejada: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'turmas',
      key: 'id',
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

// Associações serão configuradas em src/models/associations.ts

export default Candidate;