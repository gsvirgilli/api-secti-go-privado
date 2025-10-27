import { z } from 'zod';

/**
 * Schema de validação para criação de candidato
 */
export const createCandidateSchema = z.object({
  body: z.object({
    nome: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .trim(),

    cpf: z
      .string({ message: 'CPF é obrigatório' })
      .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),

    email: z
      .string({ message: 'Email é obrigatório' })
      .email('Email deve ser válido')
      .max(100, 'Email deve ter no máximo 100 caracteres')
      .toLowerCase(),

    telefone: z
      .string()
      .max(20, 'Telefone deve ter no máximo 20 caracteres')
      .optional()
      .nullable(),

    data_nascimento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .optional()
      .nullable(),

    status: z
      .enum(['pendente', 'aprovado', 'reprovado'], {
        message: 'Status deve ser pendente, aprovado ou reprovado'
      })
      .optional()
      .default('pendente'),

    turma_id: z
      .number({ message: 'ID da turma deve ser um número' })
      .int('ID da turma deve ser um número inteiro')
      .positive('ID da turma deve ser positivo')
      .optional()
      .nullable()
  })
});

/**
 * Schema de validação para atualização de candidato
 */
export const updateCandidateSchema = z.object({
  body: z.object({
    nome: z
      .string({ message: 'Nome deve ser uma string' })
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .trim()
      .optional(),

    email: z
      .string({ message: 'Email deve ser uma string' })
      .email('Email deve ser válido')
      .max(100, 'Email deve ter no máximo 100 caracteres')
      .toLowerCase()
      .optional(),

    telefone: z
      .string()
      .max(20, 'Telefone deve ter no máximo 20 caracteres')
      .optional()
      .nullable(),

    status: z
      .enum(['pendente', 'aprovado', 'reprovado'], {
        message: 'Status deve ser pendente, aprovado ou reprovado'
      })
      .optional(),

    turma_id: z
      .number({ message: 'ID da turma deve ser um número' })
      .int('ID da turma deve ser um número inteiro')
      .positive('ID da turma deve ser positivo')
      .optional()
      .nullable()
  })
});

/**
 * Schema de validação para filtros de listagem de candidatos
 */
export const listCandidateFiltersSchema = z.object({
  nome: z.string().optional(),
  
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .optional(),
  
  email: z
    .string()
    .email('Email deve ser válido')
    .optional(),
  
  status: z
    .enum(['pendente', 'aprovado', 'reprovado'])
    .optional(),
  
  turma_id: z
    .string()
    .regex(/^\d+$/, 'ID da turma deve ser um número')
    .transform(Number)
    .optional()
});

/**
 * Schema de validação para aprovação de candidato
 */
export const approveCandidateSchema = z.object({
  body: z.object({
    motivo: z.string().optional()
  })
});

/**
 * Schema de validação para rejeição de candidato
 */
export const rejectCandidateSchema = z.object({
  body: z.object({
    motivo: z
      .string({ message: 'Motivo é obrigatório' })
      .min(10, 'Motivo deve ter no mínimo 10 caracteres')
  })
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type ListCandidateFilters = z.infer<typeof listCandidateFiltersSchema>;
export type ApproveCandidateInput = z.infer<typeof approveCandidateSchema>;
export type RejectCandidateInput = z.infer<typeof rejectCandidateSchema>;
