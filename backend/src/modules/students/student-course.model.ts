import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

export class StudentCourse extends Model {
  declare id: number;
  declare student_id: number;
  declare course_id: number;
  declare turma_id?: number;
  declare status: 'Ativo' | 'Concluído' | 'Desistente';
  declare data_inicio: Date;
  declare data_conclusao?: Date;
  declare motivo_desistencia?: string;
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
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alunos',
        key: 'id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'id',
      },
    },
    turma_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    data_conclusao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    motivo_desistencia: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
        fields: ['student_id', 'course_id'],
        unique: true,
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default StudentCourse;
