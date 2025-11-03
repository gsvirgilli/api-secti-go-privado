import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

export interface PasswordResetTokenAttributes {
  id?: number;
  usuario_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class PasswordResetToken extends Model<PasswordResetTokenAttributes> implements PasswordResetTokenAttributes {
  public id!: number;
  public usuario_id!: number;
  public token!: string;
  public expires_at!: Date;
  public used!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordResetToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'password_reset_tokens',
    timestamps: true,
    indexes: [
      {
        fields: ['token'],
      },
      {
        fields: ['usuario_id'],
      },
      {
        fields: ['expires_at'],
      },
    ],
  }
);

// Relação com User
import User from '../users/user.model.js';
PasswordResetToken.belongsTo(User, { foreignKey: 'usuario_id', as: 'user' });

export default PasswordResetToken;
