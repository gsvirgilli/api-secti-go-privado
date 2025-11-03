import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Log de Auditoria
 * Registra todas as ações importantes do sistema para rastreabilidade
 */
class AuditLog extends Model {
  declare id: number;
  declare usuario_id: number | null;
  declare acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT';
  declare entidade: string; // Nome da entidade (ex: 'Student', 'Class', 'Enrollment')
  declare entidade_id: number | null; // ID do registro afetado
  declare dados_anteriores: object | null; // Dados antes da alteração (JSON)
  declare dados_novos: object | null; // Dados depois da alteração (JSON)
  declare ip: string | null; // IP do usuário
  declare user_agent: string | null; // User Agent do navegador
  declare descricao: string | null; // Descrição adicional da ação
  declare readonly createdAt: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      comment: 'ID do usuário que executou a ação',
    },
    acao: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT'),
      allowNull: false,
      comment: 'Tipo de ação realizada',
    },
    entidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nome da entidade afetada (tabela/modelo)',
    },
    entidade_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID do registro afetado',
    },
    dados_anteriores: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Estado anterior do registro (para UPDATE/DELETE)',
    },
    dados_novos: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Estado novo do registro (para CREATE/UPDATE)',
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'Endereço IP do usuário',
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'User Agent do navegador',
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição adicional da ação',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false, // Apenas createdAt, sem updatedAt
    indexes: [
      {
        name: 'idx_audit_usuario',
        fields: ['usuario_id'],
      },
      {
        name: 'idx_audit_entidade',
        fields: ['entidade', 'entidade_id'],
      },
      {
        name: 'idx_audit_acao',
        fields: ['acao'],
      },
      {
        name: 'idx_audit_created',
        fields: ['createdAt'],
      },
    ],
  }
);

export default AuditLog;
