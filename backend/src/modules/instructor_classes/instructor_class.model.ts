import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Instructor from '../instructors/instructor.model.js';
import Class from '../classes/class.model.js';

class InstructorClass extends Model {
  public id_instrutor!: number;
  public id_turma!: number;
}

InstructorClass.init({
  id_instrutor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Instructor,
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
}, {
  sequelize,
  tableName: 'instrutor_turma',
  timestamps: false, // Geralmente tabelas de junção não precisam de timestamps
});

// Associações
InstructorClass.belongsTo(Instructor, {
  foreignKey: 'id_instrutor',
  as: 'instrutor'
});

InstructorClass.belongsTo(Class, {
  foreignKey: 'id_turma',
  as: 'turma'
});

Instructor.belongsToMany(Class, {
  through: InstructorClass,
  foreignKey: 'id_instrutor',
  otherKey: 'id_turma',
  as: 'turmas'
});

Class.belongsToMany(Instructor, {
  through: InstructorClass,
  foreignKey: 'id_turma',
  otherKey: 'id_instrutor',
  as: 'instrutores'
});

export default InstructorClass;