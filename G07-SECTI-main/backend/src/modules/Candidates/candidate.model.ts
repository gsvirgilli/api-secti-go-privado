import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Class from '../classes/class.model.js';

class Candidate extends Model {
  public id!: number;
  public nome!: string;
  public cpf!: string;
  public email!: string;
  public status!: string;
  public id_turma_desejada!: number;
}

Candidate.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'PENDENTE', // PENDENTE, APROVADO, REJEITADO
  },
  id_turma_desejada: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Class,
      key: 'id',
    }
  }
}, {
  sequelize,
  tableName: 'candidatos',
  timestamps: true,
});

export default Candidate;