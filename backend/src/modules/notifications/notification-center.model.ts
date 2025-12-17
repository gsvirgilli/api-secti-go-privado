import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Notificações
 */
class Notification extends Model {
  declare id: number;
  declare titulo: string;
  declare descricao: string;
  declare tipo: 'ALUNO' | 'TURMA' | 'INSTRUTOR' | 'CALENDARIO' | 'CANDIDATO';
  declare icone: string;
  declare lido: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  toJSON() {
    const values = super.toJSON() as any;
    return values;
  }
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Título da notificação',
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Descrição detalhada da notificação',
    },
    tipo: {
      type: DataTypes.ENUM('ALUNO', 'TURMA', 'INSTRUTOR', 'CALENDARIO', 'CANDIDATO'),
      allowNull: false,
      defaultValue: 'ALUNO',
      comment: 'Tipo de notificação',
    },
    icone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Ícone da notificação (lucide-react icon name)',
    },
    lido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Se a notificação foi lida',
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['lido'],
        name: 'idx_notification_lido',
      },
      {
        fields: ['tipo'],
        name: 'idx_notification_tipo',
      },
      {
        fields: ['createdAt'],
        name: 'idx_notification_criacao',
      },
    ],
  }
);

export default Notification;
