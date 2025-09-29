import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Instructor extends Model {
  public id!: number;
  public cpf!: string;
  public nome!: string;
  public email!: string;
  public especialidade!: string | null;
}

Instructor.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  especialidade: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'instrutores',
  timestamps: true,
});

export default Instructor;