import { Model, DataTypes } from 'sequelize';
import { testSequelize } from '../../config/database.test.js';

export interface CourseTestAttributes {
  id: number;
  nome: string;
  carga_horaria: number;
  descricao?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseTestCreationAttributes {
  nome: string;
  carga_horaria: number;
  descricao?: string;
}

class CourseTest extends Model<CourseTestAttributes, CourseTestCreationAttributes> implements CourseTestAttributes {
  declare id: number;
  declare nome: string;
  declare carga_horaria: number;
  declare descricao?: string;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CourseTest.init({
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
        msg: 'Nome do curso é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'Nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  carga_horaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Carga horária deve ser maior que zero'
      },
      max: {
        args: [1000],
        msg: 'Carga horária não pode exceder 1000 horas'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Descrição não pode exceder 1000 caracteres'
      }
    }
  }
}, {
  sequelize: testSequelize,
  tableName: 'cursos',
  timestamps: true,
});

export default CourseTest;