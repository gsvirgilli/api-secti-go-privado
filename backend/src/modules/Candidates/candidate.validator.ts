import { z } from 'zod/v4';

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
    .enum(['PENDENTE', 'APROVADO', 'REPROVADO'])
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
 * Schema de validação para candidatura pública (sem autenticação)
 */
export const publicCandidateSchema = z.object({
  body: z.object({
    nome: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .trim(),

    cpf: z
      .string({ message: 'CPF é obrigatório' })
      .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos numéricos'),

    email: z
      .string({ message: 'Email é obrigatório' })
      .email('Email inválido')
      .max(100, 'Email deve ter no máximo 100 caracteres')
      .toLowerCase(),

    telefone: z
      .string({ message: 'Telefone é obrigatório' })
      .min(10, 'Telefone deve ter no mínimo 10 dígitos')
      .max(20, 'Telefone deve ter no máximo 20 caracteres'),

    data_nascimento: z
      .string({ message: 'Data de nascimento é obrigatória' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

    // Endereço (opcional)
    cep: z
      .string()
      .regex(/^\d{8}$/, 'CEP deve conter 8 dígitos')
      .optional()
      .nullable(),

    rua: z
      .string()
      .max(200, 'Rua deve ter no máximo 200 caracteres')
      .optional()
      .nullable(),

    numero: z
      .string()
      .max(20, 'Número deve ter no máximo 20 caracteres')
      .optional()
      .nullable(),

    complemento: z
      .string()
      .max(100, 'Complemento deve ter no máximo 100 caracteres')
      .optional()
      .nullable(),

    bairro: z
      .string()
      .max(100, 'Bairro deve ter no máximo 100 caracteres')
      .optional()
      .nullable(),

    cidade: z
      .string()
      .max(100, 'Cidade deve ter no máximo 100 caracteres')
      .optional()
      .nullable(),

    estado: z
      .string()
      .length(2, 'Estado deve ter exatamente 2 caracteres (UF)')
      .toUpperCase()
      .optional()
      .nullable(),

    // Curso e turno desejados
    curso_id: z
      .number({ message: 'ID do curso é obrigatório' })
      .int('ID do curso deve ser um número inteiro')
      .positive('ID do curso deve ser positivo'),

    turno: z
      .enum(['MATUTINO', 'VESPERTINO', 'NOTURNO'], {
        message: 'Turno deve ser MATUTINO, VESPERTINO ou NOTURNO'
      })
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
export type PublicCandidateInput = z.infer<typeof publicCandidateSchema>;
