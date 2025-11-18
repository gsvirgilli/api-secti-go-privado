import { z } from 'zod';

/**
 * Schema de validação para criação de matrícula
 */
export const createEnrollmentSchema = z.object({
  body: z.object({
    id_aluno: z
      .number({ message: 'ID do aluno é obrigatório' })
      .int('ID do aluno deve ser um número inteiro')
      .positive('ID do aluno deve ser positivo'),

    id_turma: z
      .number({ message: 'ID da turma é obrigatório' })
      .int('ID da turma deve ser um número inteiro')
      .positive('ID da turma deve ser positivo'),

    status: z
      .enum(['ativo', 'trancado', 'concluido', 'cancelado'], {
        message: 'Status deve ser: ativo, trancado, concluido ou cancelado'
      })
      .optional()
      .default('ativo'),
  })
});

/**
 * Schema de validação para atualização de matrícula
 */
export const updateEnrollmentSchema = z.object({
  body: z.object({
    status: z
      .enum(['ativo', 'trancado', 'concluido', 'cancelado'], {
        message: 'Status deve ser: ativo, trancado, concluido ou cancelado'
      })
      .optional(),
  })
});

/**
 * Schema de validação para filtros de listagem
 */
export const listEnrollmentFiltersSchema = z.object({
  id_aluno: z
    .string()
    .regex(/^\d+$/, 'ID do aluno deve ser um número')
    .transform(Number)
    .optional(),

  id_turma: z
    .string()
    .regex(/^\d+$/, 'ID da turma deve ser um número')
    .transform(Number)
    .optional(),

  status: z
    .enum(['ativo', 'trancado', 'concluido', 'cancelado'])
    .optional(),
});

/**
 * Schema para transferência de turma
 */
export const transferEnrollmentSchema = z.object({
  body: z.object({
    id_nova_turma: z
      .number({ message: 'ID da nova turma é obrigatório' })
      .int('ID da turma deve ser um número inteiro')
      .positive('ID da turma deve ser positivo'),

    motivo: z
      .string()
      .min(10, 'Motivo deve ter no mínimo 10 caracteres')
      .optional(),
  })
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
export type ListEnrollmentFilters = z.infer<typeof listEnrollmentFiltersSchema>;
export type TransferEnrollmentInput = z.infer<typeof transferEnrollmentSchema>;
