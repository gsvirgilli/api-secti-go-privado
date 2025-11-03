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
  declare data_inicio: Date | null;
  declare data_fim: Date | null;
  declare id_curso: number;
  declare vagas: number; // Total de vagas da turma
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
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterStart(value: Date) {
        if (value && this.data_inicio && value <= this.data_inicio) {
          throw new Error('Data de fim deve ser posterior à data de início');
        }
      }
    }
  },
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    defaultValue: 30,
    validate: {
      notNull: {
        msg: 'Número de vagas é obrigatório'
      },
      min: {
        args: [0],
        msg: 'Número de vagas não pode ser negativo'
      }
    }
  }
}, {
  sequelize,
  tableName: 'turmas',
  timestamps: true,
  indexes: [
    {
      fields: ['id_curso']
    },
    {
      fields: ['turno']
    },
    {
      fields: ['data_inicio', 'data_fim']
    }
  ]
});

// Associações
Class.belongsTo(Curso, {
  foreignKey: 'id_curso',
  as: 'curso'
});

export default Class;