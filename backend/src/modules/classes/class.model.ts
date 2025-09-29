import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Curso from '../courses/course.model.js';

class Class extends Model {
  public id!: number;
  public nome!: string;
  public turno!: string;
  public data_inicio!: Date | null;
  public data_fim!: Date | null;
  public id_curso!: number;
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
  },
  turno: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // --- Chave Estrangeira ---
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Curso, // Pode referenciar o Model diretamente
      key: 'id',
    }
  }
}, {
  sequelize,
  tableName: 'turmas', // Nome da tabela no banco
  timestamps: true,
});

export default Class;