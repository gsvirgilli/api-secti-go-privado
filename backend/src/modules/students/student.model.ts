import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Aluno
 * Representa candidatos aprovados que foram matriculados
 */
class Student extends Model {
  public id!: number;
  public candidato_id!: number;
  public usuario_id!: number;
  public matricula!: string;
  public turma_id!: number;
  public status!: 'ativo' | 'trancado' | 'concluido' | 'desistente';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  candidato_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'candidatos',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    }
  ]
});

export default Student;