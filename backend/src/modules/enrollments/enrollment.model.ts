import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';

/**
 * Modelo de Matrícula
 * Relacionamento entre Aluno e Turma
 */
class Enrollment extends Model {
  declare id_aluno: number;
  declare id_turma: number;
  declare status: 'ativo' | 'trancado' | 'concluido' | 'cancelado';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Enrollment.init({
  id_aluno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'alunos',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  id_turma: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'turmas',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('ativo', 'trancado', 'concluido', 'cancelado'),
    allowNull: false,
    defaultValue: 'ativo',
  },
}, {
  sequelize,
  tableName: 'matriculas',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['id_aluno', 'id_turma']
    },
    {
      fields: ['status']
    }
  ]
});

// Associações
Enrollment.belongsTo(Student, {
  foreignKey: 'id_aluno',
  as: 'aluno'
});

Enrollment.belongsTo(Class, {
  foreignKey: 'id_turma',
  as: 'turma'
});

// Associações
Enrollment.belongsTo(Student, {
  foreignKey: 'id_aluno',
  as: 'aluno'
});

Enrollment.belongsTo(Class, {
  foreignKey: 'id_turma',
  as: 'turma'
});

export default Enrollment;
