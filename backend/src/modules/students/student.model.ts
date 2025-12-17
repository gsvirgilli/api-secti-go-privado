import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Aluno
 * Representa candidatos aprovados que foram matriculados
 */
class Student extends Model {
  declare id: number;
  declare candidatoId: number | null;
  declare usuarioId: number | null;
  declare matricula: string;
  declare cpf: string;
  declare nome: string;
  declare email: string;
  declare telefone: string | null;
  declare dataNascimento: Date | null;
  declare endereco: string | null;
  declare turmaId: number | null;
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
  candidatoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    references: {
      model: 'alunos',
      key: 'id'
    },
    field: 'candidato_id'
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    field: 'usuario_id'
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Matrícula é obrigatória'
      }
    },
    field: 'matricula'
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    field: 'cpf'
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email'
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'telefone'
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_nascimento'
  },
  endereco: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'endereco'
  },
  turmaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'turmas',
      key: 'id'
    },
    field: 'turma_id'
  },
  status: {
    type: DataTypes.ENUM('ativo', 'trancado', 'concluido', 'desistente'),
    allowNull: false,
    defaultValue: 'ativo',
    field: 'status'
  },
}, {
  sequelize,
  tableName: 'alunos',
  timestamps: true,
  underscored: true,
  indexes: [
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