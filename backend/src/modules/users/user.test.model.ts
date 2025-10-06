import { Model, DataTypes } from 'sequelize';
import { testSequelize } from '../../config/database.test.js';

export interface UserTestAttributes {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserTestCreationAttributes {
  nome: string;
  email: string;
  senha_hash: string;
  role?: string;
}

class UserTest extends Model<UserTestAttributes, UserTestCreationAttributes> implements UserTestAttributes {
  declare id: number;
  declare nome: string;
  declare email: string;
  declare senha_hash: string;
  declare role: string;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserTest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'INSTRUTOR',
  }
}, {
  sequelize: testSequelize,
  tableName: 'usuarios',
  timestamps: true,
});

export default UserTest;