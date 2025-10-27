import { z } from 'zod';

/**
 * Schema de validação para criação de turma
 */
export const createClassSchema = z.object({
  nome: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  turno: z
    .enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL'], {
      message: 'Turno deve ser MANHA, TARDE, NOITE ou INTEGRAL'
    }),

  data_inicio: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null()
    ])
    .optional()
    .nullable(),

  data_fim: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null()
    ])
    .optional()
    .nullable(),

  id_curso: z
    .number({ message: 'ID do curso é obrigatório' })
    .int('ID do curso deve ser um número inteiro')
    .positive('ID do curso deve ser um número positivo')
}).refine(
  (data) => {
    if (data.data_inicio && data.data_fim) {
      return data.data_fim > data.data_inicio;
    }
    return true;
  },
  {
    message: 'Data de fim deve ser posterior à data de início',
    path: ['data_fim']
  }
);

/**
 * Schema de validação para atualização de turma
 */
export const updateClassSchema = z.object({
  nome: z
    .string({ message: 'Nome deve ser uma string' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  turno: z
    .enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL'], {
      message: 'Turno deve ser MANHA, TARDE, NOITE ou INTEGRAL'
    })
    .optional(),

  data_inicio: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null()
    ])
    .optional()
    .nullable(),

  data_fim: z
    .union([
      z.string().transform(val => new Date(val)),
      z.date(),
      z.null()
    ])
    .optional()
    .nullable(),

  id_curso: z
    .number({ message: 'ID do curso deve ser um número' })
    .int('ID do curso deve ser um número inteiro')
    .positive('ID do curso deve ser um número positivo')
    .optional()
}).refine(
  (data) => {
    if (data.data_inicio && data.data_fim) {
      return data.data_fim > data.data_inicio;
    }
    return true;
  },
  {
    message: 'Data de fim deve ser posterior à data de início',
    path: ['data_fim']
  }
);

/**
 * Schema de validação para filtros de listagem
 */
export const listClassFiltersSchema = z.object({
  nome: z.string().optional(),
  
  turno: z
    .enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL'])
    .optional(),
  
  id_curso: z
    .string()
    .regex(/^\d+$/, 'ID do curso deve ser um número')
    .transform(Number)
    .optional(),
  
  data_inicio_min: z
    .string()
    .datetime({ message: 'Data de início mínima deve ser uma data válida (ISO 8601)' })
    .transform(val => new Date(val))
    .optional(),
  
  data_inicio_max: z
    .string()
    .datetime({ message: 'Data de início máxima deve ser uma data válida (ISO 8601)' })
    .transform(val => new Date(val))
    .optional(),
  
  data_fim_min: z
    .string()
    .datetime({ message: 'Data de fim mínima deve ser uma data válida (ISO 8601)' })
    .transform(val => new Date(val))
    .optional(),
  
  data_fim_max: z
    .string()
    .datetime({ message: 'Data de fim máxima deve ser uma data válida (ISO 8601)' })
    .transform(val => new Date(val))
    .optional()
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type ListClassFilters = z.infer<typeof listClassFiltersSchema>;
