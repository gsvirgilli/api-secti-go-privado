import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export interface UserAttributes {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  role: string;
  avatar_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes {
  nome: string;
  email: string;
  senha_hash: string;
  role?: string;
  avatar_url?: string;
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare nome: string;
  declare email: string;
  declare senha_hash: string;
  declare role: string;
  declare avatar_url?: string;
  
  // Timestamps automáticos
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
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
    defaultValue: 'INSTRUTOR', // Ex: 'ADMIN', 'INSTRUTOR'
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'avatar_url',
  }
}, {
  sequelize,
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['email'],
      name: 'idx_usuarios_email'
    }
  ]
});

export default User;