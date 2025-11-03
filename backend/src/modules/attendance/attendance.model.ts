import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Model de Presença
 * Representa o registro de presença de um aluno em uma turma em uma data específica
 */
class Attendance extends Model {
  declare id: number;
  declare id_aluno: number;
  declare id_turma: number;
  declare data_chamada: Date;
  declare status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
  declare createdAt: Date;
  declare updatedAt: Date;
}

Attendance.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_aluno: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  id_turma: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  data_chamada: {
    type: DataTypes.DATEONLY,
    allowNull: false,
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
  }
}, {
  sequelize,
  tableName: 'presenca',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['id_aluno', 'id_turma', 'data_chamada'],
      name: 'unique_attendance_per_day'
    },
    {
      fields: ['id_aluno']
    },
    {
      fields: ['id_turma']
    },
    {
      fields: ['data_chamada']
    }
  ]
});

// Importações para associações (após a definição do model para evitar circular dependency)
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';

// Associações
Attendance.belongsTo(Student, {
  foreignKey: 'id_aluno',
  as: 'aluno'
});

Attendance.belongsTo(Class, {
  foreignKey: 'id_turma',
  as: 'turma'
});

export default Attendance;
