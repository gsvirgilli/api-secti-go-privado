import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Aluno
 * Representa candidatos aprovados que foram matriculados
 */
class Student extends Model {
  declare id: number;
  declare candidato_id: number | null;
  declare usuario_id: number | null;
  declare matricula: string;
  declare cpf: string;
  declare nome: string;
  declare email: string;
  declare telefone: string | null;
  declare data_nascimento: Date | null;
  declare endereco: string | null;
  declare turma_id: number | null;
  declare status: 'ativo' | 'trancado' | 'concluido' | 'desistente';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  candidato_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir null para cadastro direto
    unique: true,
    references: {
      model: 'candidatos',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir null para cadastro direto
    unique: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Matrícula é obrigatória'
      }
    }
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  data_nascimento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endereco: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir null para cadastro direto
    references: {
      model: 'turmas',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'trancado', 'concluido', 'desistente'),
    allowNull: false,
    defaultValue: 'ativo'
  },
}, {
  sequelize,
  tableName: 'alunos',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['matricula']
    },
    {
      unique: true,
      fields: ['candidato_id']
    },
    {
      unique: true,
      fields: ['usuario_id']
    },
    {
      fields: ['turma_id']
    }
  ]
});

// Associações serão configuradas em src/models/associations.ts

export default Student;