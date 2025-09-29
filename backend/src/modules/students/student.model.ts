import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Student extends Model {
  public id!: number;
  public matricula!: string;
  public cpf!: string;
  public nome!: string;
  public email!: string;
}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
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
}, {
  sequelize,
  tableName: 'alunos',
  timestamps: true,
});

export default Student;