import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';

class Enrollment extends Model {
  public id_aluno!: number;
  public id_turma!: number;
  public status!: string;
}

Enrollment.init({
  id_aluno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Student,
      key: 'id',
    }
  },
  id_turma: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Class,
      key: 'id',
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Cursando', // Cursando, Concluído, Cancelado
  },
}, {
  sequelize,
  tableName: 'matriculas',
  timestamps: true,
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