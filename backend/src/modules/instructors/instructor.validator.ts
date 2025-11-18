import * as z from 'zod';

/**
 * Schema de validação para criação de instrutor
 */
export const createInstructorSchema = z.object({
  cpf: z
    .string({ message: 'CPF é obrigatório' })
    .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos numéricos')
    .trim(),

  nome: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  email: z
    .string({ message: 'Email é obrigatório' })
    .email('Email deve ser válido')
    .max(100, 'Email deve ter no máximo 100 caracteres')
    .toLowerCase()
    .trim(),

  especialidade: z
    .string()
    .max(100, 'Especialidade deve ter no máximo 100 caracteres')
    .trim()
    .optional()
    .nullable()
});

/**
 * Schema de validação para atualização de instrutor
 */
export const updateInstructorSchema = z.object({
  cpf: z
    .string({ message: 'CPF deve ser uma string' })
    .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos numéricos')
    .trim()
    .optional(),

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
    .trim()
    .optional(),

  endereco: z
    .string()
    .max(255, 'Endereço deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  data_nascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve estar no formato YYYY-MM-DD')
    .optional()
    .nullable(),

  especialidade: z
    .string()
    .max(100, 'Especialidade deve ter no máximo 100 caracteres')
    .trim()
    .optional()
    .nullable(),

  experiencia: z
    .string()
    .max(255, 'Experiência deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  status: z
    .string()
    .max(50, 'Status deve ter no máximo 50 caracteres')
    .optional()
    .nullable()
});

/**
 * Schema de validação para filtros de listagem de instrutores
 */
export const listInstructorFiltersSchema = z.object({
  nome: z.string().optional(),
  
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .optional(),
  
  email: z
    .string()
    .email('Email deve ser válido')
    .optional(),
  
  especialidade: z.string().optional()
});

/**
 * Schema para atribuir/desatribuir instrutor a uma turma
 */
export const assignInstructorToClassSchema = z.object({
  id_turma: z
    .number({ message: 'ID da turma é obrigatório' })
    .int('ID da turma deve ser um número inteiro')
    .positive('ID da turma deve ser positivo')
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateInstructorInput = z.infer<typeof createInstructorSchema>;
export type UpdateInstructorInput = z.infer<typeof updateInstructorSchema>;
export type ListInstructorFiltersInput = z.infer<typeof listInstructorFiltersSchema>;
export type AssignInstructorToClassInput = z.infer<typeof assignInstructorToClassSchema>;
