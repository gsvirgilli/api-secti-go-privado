import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Student from '../students/student.model.js';
import Class from '../classes/class.model.js';

class Presenca extends Model {
  public id!: number;
  public id_aluno!: number;
  public id_turma!: number;
  public data_chamada!: Date;
  public status!: string;
}

Presenca.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_aluno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'id',
    }
  },
  id_turma: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Class,
      key: 'id',
    }
  },
  data_chamada: {
    type: DataTypes.DATEONLY, // Usar DATEONLY para não guardar a hora
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false, // PRESENTE, AUSENTE, JUSTIFICADO
  },
}, {
  sequelize,
  tableName: 'presenca',
  timestamps: true,
});

export default Presenca;