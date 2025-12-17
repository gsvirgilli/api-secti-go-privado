import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Log de Auditoria
 * Registra todas as ações importantes do sistema para rastreabilidade
 */
class AuditLog extends Model {
  declare id: number;
  declare usuario_id: number | null;
  declare operacao: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  declare tabela: string; // Nome da tabela
  declare registro_id: number | null; // ID do registro afetado
  declare dados_anteriores: object | null; // Dados antes da alteração (JSON)
  declare dados_novos: object | null; // Dados depois da alteração (JSON)
  declare ip_address: string | null; // IP do usuário
  declare user_agent: string | null; // User Agent do navegador
  declare descricao: string | null; // Descrição adicional da ação
  declare readonly created_at: Date;
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
      type: DataTypes.ENUM('CREATE', 'READ', 'UPDATE', 'DELETE'),
      allowNull: false,
      field: 'operacao',
      comment: 'Tipo de operação realizada',
    },
    tabela: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Nome da tabela afetada',
    },
    registro_id: {
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
      field: 'ip_address',
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
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false, // Apenas created_at, sem updated_at
    underscored: true,
    indexes: [
      {
        name: 'idx_audit_usuario',
        fields: ['usuario_id'],
      },
      {
        name: 'idx_audit_tabela',
        fields: ['tabela', 'registro_id'],
      },
      {
        name: 'idx_audit_operacao',
        fields: ['operacao'],
      },
      {
        name: 'idx_audit_created',
        fields: ['created_at'],
      },
    ],
  }
);

export default AuditLog;
