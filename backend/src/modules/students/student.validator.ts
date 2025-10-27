import { z } from 'zod';

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
    .nullable()
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
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentFilters = z.infer<typeof listStudentFiltersSchema>;
