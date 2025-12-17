import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Model de Presença
 * Representa o registro de presença de um aluno em uma turma em uma data específica
 */
class Attendance extends Model {
  declare id: number;
  declare idAluno: number;
  declare idTurma: number;
  declare idUsuario?: number;
  declare dataChamada: Date;
  declare status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
  declare motivoJustificacao?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Attendance.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idAluno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_aluno',
    references: {
      model: 'alunos',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'ID do aluno é obrigatório'
      }
    }
  },
  idTurma: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_turma',
    references: {
      model: 'turmas',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'ID da turma é obrigatório'
      }
    }
  },
  dataChamada: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_chamada',
    validate: {
      notNull: {
        msg: 'Data da chamada é obrigatória'
      }
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Status é obrigatório'
      },
      isIn: {
        args: [['PRESENTE', 'AUSENTE', 'JUSTIFICADO']],
        msg: 'Status deve ser PRESENTE, AUSENTE ou JUSTIFICADO'
      }
    }
  },
  motivoJustificacao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'motivo_justificacao',
    comment: 'Motivo da justificação (quando status é JUSTIFICADO)'
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_usuario',
    references: {
      model: 'usuarios',
      key: 'id'
    },
    comment: 'ID do usuário (instrutor ou admin) que registrou a frequência'
  }
}, {
  sequelize,
  tableName: 'presenca',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['idAluno', 'idTurma', 'dataChamada'],
      name: 'unique_attendance_per_day'
    },
    {
      fields: ['idAluno']
    },
    {
      fields: ['idTurma']
    },
    {
      fields: ['dataChamada']
    }
  ]
});

// Importações para associações (após a definição do model para evitar circular dependency)
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';
import User from '../users/user.model.js';

// Associações
Attendance.belongsTo(Student, {
  foreignKey: 'idAluno',
  as: 'aluno'
});

Attendance.belongsTo(Class, {
  foreignKey: 'idTurma',
  as: 'turma'
});

Attendance.belongsTo(User, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

export default Attendance;
