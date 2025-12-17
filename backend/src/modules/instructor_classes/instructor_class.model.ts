import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Instructor from '../instructors/instructor.model.js';
import Class from '../classes/class.model.js';

class InstructorClass extends Model {
  public idInstrutor!: number;
  public idTurma!: number;
}

InstructorClass.init({
  idInstrutor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'id_instrutor',
    references: {
      model: Instructor,
      key: 'id',
    }
  },
  idTurma: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'id_turma',
    references: {
      model: Class,
      key: 'id',
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'instrutor_turma',
  timestamps: false, // Geralmente tabelas de junção não precisam de timestamps
  underscored: true
});

// Associações
InstructorClass.belongsTo(Instructor, {
  foreignKey: 'idInstrutor',
  as: 'instrutor'
});

InstructorClass.belongsTo(Class, {
  foreignKey: 'idTurma',
  as: 'turma'
});

// NOTA: As associações N:M (belongsToMany) entre Instructor e Class
// estão definidas no arquivo src/models/associations.ts para evitar conflitos

export default InstructorClass;