import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Curso extends Model {
  public id!: number;
  public nome!: string;
  public carga_horaria!: number;
  public descricao!: string | null;
}

Curso.init({
  // Coluna 'id'
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Coluna 'nome'
  nome: {
    type: DataTypes.STRING(100), 
    allowNull: false, 
  },
  // Coluna 'carga_horaria'
  carga_horaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Coluna 'descricao'
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
}, {
  sequelize,
  tableName: 'cursos',
  timestamps: true,
});

export default Curso;