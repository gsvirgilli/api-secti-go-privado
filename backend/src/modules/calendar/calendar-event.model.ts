import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Modelo de Evento do Calendário Acadêmico
 */
class CalendarEvent extends Model {
  declare id: number;
  declare titulo: string;
  declare descricao: string | null;
  declare data_inicio: Date;
  declare data_fim: Date | null;
  declare tipo: 'AULA' | 'PROVA' | 'ENTREGA' | 'FERIADO' | 'EVENTO' | 'INSCRICAO' | 'FORMATURAS';
  declare status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  declare turma_id: number | null;
  declare curso_id: number | null;
  declare cor: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  toJSON() {
    const values = super.toJSON() as any;
    
    // Converter datas para formato YYYY-MM-DD
    if (values.data_inicio) {
      const date = new Date(values.data_inicio);
      values.data_inicio = date.toISOString().split('T')[0];
    }
    if (values.data_fim) {
      const date = new Date(values.data_fim);
      values.data_fim = date.toISOString().split('T')[0];
    }

    // Calcular e aplicar status automático
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataInicio = new Date(this.data_inicio);
    dataInicio.setHours(0, 0, 0, 0);

    const dataFim = this.data_fim ? new Date(this.data_fim) : null;
    if (dataFim) {
      dataFim.setHours(0, 0, 0, 0);
    }

    // Determinar status automático
    let autoStatus = 'PLANEJADO';
    
    if (dataFim && dataFim < hoje) {
      autoStatus = 'CONCLUIDO';
    } else if (dataInicio > hoje) {
      autoStatus = 'PLANEJADO';
    } else if (dataInicio <= hoje && (!dataFim || dataFim >= hoje)) {
      autoStatus = 'EM_ANDAMENTO';
    }

    values.status = autoStatus;
    return values;
  }
}

CalendarEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Título do evento',
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição detalhada do evento',
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Data e hora de início do evento',
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Data e hora de término do evento',
    },
    tipo: {
      type: DataTypes.ENUM('AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS'),
      allowNull: false,
      defaultValue: 'EVENTO',
      comment: 'Tipo de evento no calendário',
    },
    status: {
      type: DataTypes.ENUM('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'PLANEJADO',
      comment: 'Status do evento',
    },
    turma_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'turmas',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'ID da turma relacionada (opcional)',
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cursos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'ID do curso relacionado (opcional)',
    },
    cor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#3B82F6',
      comment: 'Cor do evento em formato hexadecimal',
    },
  },
  {
    sequelize,
    tableName: 'calendar_events',
    timestamps: true,
    indexes: [
      {
        fields: ['data_inicio'],
        name: 'idx_calendar_data_inicio',
      },
      {
        fields: ['tipo'],
        name: 'idx_calendar_tipo',
      },
      {
        fields: ['turma_id'],
        name: 'idx_calendar_turma',
      },
      {
        fields: ['curso_id'],
        name: 'idx_calendar_curso',
      },
    ],
  }
);

export default CalendarEvent;
