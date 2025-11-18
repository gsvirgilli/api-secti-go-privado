import * as z from 'zod';

/**
 * Schema de validação para criação de aluno
 */
export const createStudentSchema = z.object({
  nome: z
    .string({ message: 'Nome deve ser uma string' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  cpf: z
    .string({ message: 'CPF deve ser uma string' })
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),

  email: z
    .string({ message: 'Email deve ser uma string' })
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
    .optional()
    .nullable(),

  endereco: z
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),

  id_curso: z
    .number({ message: 'ID do curso deve ser um número' })
    .int('ID do curso deve ser um número inteiro')
    .positive('ID do curso deve ser positivo')
    .optional()
    .nullable(),

  id_turma: z
    .number({ message: 'ID da turma deve ser um número' })
    .int('ID da turma deve ser um número inteiro')
    .positive('ID da turma deve ser positivo')
    .optional()
    .nullable(),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(['ativo', 'trancado', 'concluido', 'desistente']))
    .optional()
});

/**
 * Schema de validação para atualização de aluno
 */
export const updateStudentSchema = z.object({
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

  turma_id: z
    .number({ message: 'ID da turma deve ser um número' })
    .int('ID da turma deve ser um número inteiro')
    .positive('ID da turma deve ser positivo')
    .optional()
    .nullable(),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(['ativo', 'trancado', 'concluido', 'desistente']))
    .optional()
});

/**
 * Schema de validação para filtros de listagem de alunos
 */
export const listStudentFiltersSchema = z.object({
  nome: z.string().optional(),
  
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .optional(),
  
  email: z
    .string()
    .email('Email deve ser válido')
    .optional(),
  
  matricula: z.string().optional()
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentFilters = z.infer<typeof listStudentFiltersSchema>;
