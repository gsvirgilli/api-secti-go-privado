import { z } from 'zod';

/**
 * Schema de validação para criação de evento do calendário
 */
export const createCalendarEventSchema = z.object({
  titulo: z
    .string({ message: 'Título é obrigatório' })
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim(),

  descricao: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),

  data_inicio: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
    ])
    .refine(date => date instanceof Date && !isNaN(date.getTime()), {
      message: 'Data de início inválida',
    }),

  data_fim: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null(),
    ])
    .optional()
    .nullable(),

  tipo: z
    .enum(['AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS'], {
      message: 'Tipo de evento inválido',
    })
    .default('EVENTO'),

  status: z
    .enum(['PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'], {
      message: 'Status inválido',
    })
    .default('PLANEJADO')
    .optional(),

  turma_id: z
    .number()
    .int()
    .positive('ID da turma deve ser um número positivo')
    .optional()
    .nullable(),

  curso_id: z
    .number()
    .int()
    .positive('ID do curso deve ser um número positivo')
    .optional()
    .nullable(),

  cor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um valor hexadecimal válido (ex: #FF0000)')
    .optional()
    .nullable()
    .default('#3B82F6'),
}).refine(
  (data) => {
    if (data.data_fim && data.data_inicio) {
      return data.data_fim > data.data_inicio;
    }
    return true;
  },
  {
    message: 'Data de fim deve ser posterior à data de início',
    path: ['data_fim'],
  }
);

/**
 * Schema de validação para atualização de evento
 */
export const updateCalendarEventSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  descricao: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),

  data_inicio: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
    ])
    .optional(),

  data_fim: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null(),
    ])
    .optional()
    .nullable(),

  tipo: z
    .enum(['AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS'])
    .optional(),

  status: z
    .enum(['PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'])
    .optional(),

  turma_id: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),

  curso_id: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),

  cor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um valor hexadecimal válido')
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.data_fim && data.data_inicio) {
      return data.data_fim > data.data_inicio;
    }
    return true;
  },
  {
    message: 'Data de fim deve ser posterior à data de início',
    path: ['data_fim'],
  }
);

/**
 * Schema de validação para filtros de listagem
 */
export const listCalendarEventsSchema = z.object({
  mes: z.coerce.number().int().min(1).max(12).optional(),
  ano: z.coerce.number().int().min(2000).optional(),
  tipo: z.enum(['AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS']).optional(),
  status: z.enum(['PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
  turma_id: z.coerce.number().int().optional(),
  curso_id: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
