import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

export class StudentCourse extends Model {
  declare id: number;
  declare studentId: number;
  declare courseId: number;
  declare turmaId?: number;
  declare status: 'Ativo' | 'Concluído' | 'Desistente';
  declare dataInicio: Date;
  declare dataConclusao?: Date;
  declare motivoDesistencia?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentCourse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id',
      references: {
        model: 'alunos',
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'course_id',
      references: {
        model: 'cursos',
        key: 'id',
      },
    },
    turmaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'turma_id',
      references: {
        model: 'turmas',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('Ativo', 'Concluído', 'Desistente'),
      allowNull: false,
      defaultValue: 'Ativo',
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_inicio',
      defaultValue: DataTypes.NOW,
    },
    dataConclusao: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'data_conclusao',
    },
    motivoDesistencia: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'motivo_desistencia',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'StudentCourse',
    tableName: 'student_courses',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['studentId', 'courseId'],
        unique: true,
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default StudentCourse;
