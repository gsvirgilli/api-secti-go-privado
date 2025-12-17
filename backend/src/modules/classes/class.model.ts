import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Curso from '../courses/course.model.js';

/**
 * Modelo de Turma
 * Representa uma turma associada a um curso
 */
class Class extends Model {
  declare id: number;
  declare nome: string;
  declare turno: string;
  declare dataInicio: Date | null;
  declare dataFim: Date | null;
  declare idCurso: number;
  declare vagas: number; // Total de vagas da turma
  declare status: 'ATIVA' | 'PLANEJADA' | 'ENCERRADA' | 'CANCELADA';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Class.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome da turma é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'Nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  turno: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Turno é obrigatório'
      },
      isIn: {
        args: [['MANHA', 'TARDE', 'NOITE', 'INTEGRAL']],
        msg: 'Turno deve ser MANHA, TARDE, NOITE ou INTEGRAL'
      }
    }
  },
  dataInicio: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_inicio',
  },
  dataFim: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_fim',
    validate: {
      isAfterStart(value: Date) {
        if (value && this.dataInicio && value <= this.dataInicio) {
          throw new Error('Data de fim deve ser posterior à data de início');
        }
      }
    }
  },
  idCurso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_curso',
    references: {
      model: Curso,
      key: 'id',
    },
    validate: {
      notNull: {
        msg: 'Curso é obrigatório'
      }
    }
  },
  vagas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Número de vagas é obrigatório'
      },
      min: {
        args: [0],
        msg: 'Número de vagas não pode ser negativo'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('ATIVA', 'PLANEJADA', 'ENCERRADA', 'CANCELADA'),
    allowNull: false,
    defaultValue: 'PLANEJADA',
    validate: {
      notNull: {
        msg: 'Status é obrigatório'
      },
      isIn: {
        args: [['ATIVA', 'PLANEJADA', 'ENCERRADA', 'CANCELADA']],
        msg: 'Status deve ser ATIVA, PLANEJADA, ENCERRADA ou CANCELADA'
      }
    }
  }
}, {
  sequelize,
  tableName: 'turmas',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['idCurso']
    },
    {
      fields: ['turno']
    },
    {
      fields: ['data_inicio', 'data_fim']
    },
    {
      fields: ['status']
    }
  ]
});

// Associações serão configuradas em src/models/associations.ts

export default Class;