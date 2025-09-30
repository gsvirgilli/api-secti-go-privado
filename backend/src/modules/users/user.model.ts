import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

class User extends Model {
  public id!: number;
  public email!: string;
  public senha_hash!: string;
  public role!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'INSTRUTOR', // Ex: 'ADMIN', 'INSTRUTOR'
  }
}, {
  sequelize,
  tableName: 'usuarios',
  timestamps: true,
});

export default User;