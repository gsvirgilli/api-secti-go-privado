import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';

/**
 * Modelo de Matrícula
 * Relacionamento entre Aluno e Turma
 */
class Enrollment extends Model {
  declare idAluno: number;
  declare idTurma: number;
  declare status: 'ativo' | 'trancado' | 'concluido' | 'cancelado';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Enrollment.init({
  idAluno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id_aluno',
    references: {
      model: 'alunos',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  idTurma: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id_turma',
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
  underscored: true,
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
  foreignKey: 'idAluno',
  as: 'aluno'
});

Enrollment.belongsTo(Class, {
  foreignKey: 'idTurma',
  as: 'turma'
});

// Associações inversas
Student.hasMany(Enrollment, {
  foreignKey: 'idAluno',
  as: 'matriculas'
});

Class.hasMany(Enrollment, {
  foreignKey: 'idTurma',
  as: 'matriculas'
});

export default Enrollment;
