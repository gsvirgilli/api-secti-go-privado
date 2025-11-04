import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Instructor extends Model<InferAttributes<Instructor>, InferCreationAttributes<Instructor>> {
  declare id: number;
  declare cpf: string;
  declare nome: string;
  declare email: string;
  declare endereco: string | null;
  declare data_nascimento: string | null;
  declare especialidade: string | null;
  declare experiencia: string | null;
  declare status: string | null;
  declare createdAt?: Date;
  declare updatedAt?: Date;
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
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  especialidade: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  experiencia: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'instrutores',
  timestamps: true,
});

export default Instructor;