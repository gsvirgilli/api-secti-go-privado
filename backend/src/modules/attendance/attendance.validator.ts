import { z } from 'zod/v4';

/**
 * Schema de validação para criação de presença
 */
export const createAttendanceSchema = z.object({
  id_aluno: z
    .number({ message: 'ID do aluno é obrigatório' })
    .int('ID do aluno deve ser um número inteiro')
    .positive('ID do aluno deve ser um número positivo'),

  id_turma: z
    .number({ message: 'ID da turma é obrigatório' })
    .int('ID da turma deve ser um número inteiro')
    .positive('ID da turma deve ser um número positivo'),

  data_chamada: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date()
    ]),

  status: z
    .enum(['PRESENTE', 'AUSENTE', 'JUSTIFICADO'], {
      message: 'Status deve ser PRESENTE, AUSENTE ou JUSTIFICADO'
    })
});

/**
 * Schema para atualização de presença
 */
export const updateAttendanceSchema = z.object({
  status: z
    .enum(['PRESENTE', 'AUSENTE', 'JUSTIFICADO'], {
      message: 'Status deve ser PRESENTE, AUSENTE ou JUSTIFICADO'
    })
});

/**
 * Schema para registro em lote de presenças
 */
export const bulkAttendanceSchema = z.object({
  id_turma: z
    .number({ message: 'ID da turma é obrigatório' })
    .int('ID da turma deve ser um número inteiro')
    .positive('ID da turma deve ser um número positivo'),

  data_chamada: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date()
    ]),

  attendances: z.array(z.object({
    id_aluno: z
      .number({ message: 'ID do aluno é obrigatório' })
      .int('ID do aluno deve ser um número inteiro')
      .positive('ID do aluno deve ser um número positivo'),
    
    status: z
      .enum(['PRESENTE', 'AUSENTE', 'JUSTIFICADO'], {
        message: 'Status deve ser PRESENTE, AUSENTE ou JUSTIFICADO'
      })
  }))
  .min(1, 'Deve haver pelo menos um registro de presença')
});

/**
 * Schema para filtros de busca
 */
export const attendanceFiltersSchema = z.object({
  id_aluno: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_turma: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  data_inicio: z
    .string()
    .transform(val => new Date(val))
    .optional(),

  data_fim: z
    .string()
    .transform(val => new Date(val))
    .optional(),

  status: z
    .enum(['PRESENTE', 'AUSENTE', 'JUSTIFICADO'])
    .optional()
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
export type AttendanceFiltersInput = z.infer<typeof attendanceFiltersSchema>;
