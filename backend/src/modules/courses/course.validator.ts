import * as z from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

// Schema para criação de curso
export const createCourseSchema = z.object({
  body: z.object({
    nome: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .trim(),
    carga_horaria: z
      .number({ message: 'Carga horária é obrigatória' })
      .int('Carga horária deve ser um número inteiro')
      .min(1, 'Carga horária deve ser maior que zero')
      .max(1000, 'Carga horária não pode exceder 1000 horas'),
    nivel: z
      .enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'])
      .optional(),
    status: z
      .enum(['ATIVO', 'INATIVO', 'EM_DESENVOLVIMENTO'])
      .optional(),
    descricao: z
      .string()
      .max(1000, 'Descrição não pode exceder 1000 caracteres')
      .trim()
      .optional()
  })
});

// Schema para atualização de curso
export const updateCourseSchema = z.object({
  body: z.object({
    nome: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .trim()
      .optional(),
    carga_horaria: z
      .number()
      .int('Carga horária deve ser um número inteiro')
      .min(1, 'Carga horária deve ser maior que zero')
      .max(1000, 'Carga horária não pode exceder 1000 horas')
      .optional(),
    nivel: z
      .enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'])
      .optional(),
    status: z
      .enum(['ATIVO', 'INATIVO', 'EM_DESENVOLVIMENTO'])
      .optional(),
    descricao: z
      .string()
      .max(1000, 'Descrição não pode exceder 1000 caracteres')
      .trim()
      .optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Pelo menos um campo deve ser fornecido para atualização' }
  ),
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número válido')
      .transform(Number)
  })
});

// Schema para busca de curso por ID
export const getCourseSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número válido')
      .transform(Number)
  })
});

// Schema para filtros de busca
export const getCourseFiltersSchema = z.object({
  query: z.object({
    nome: z
      .string()
      .min(1, 'Nome deve ter pelo menos 1 caractere')
      .optional(),
    carga_horaria_min: z
      .string()
      .regex(/^\d+$/, 'Carga horária mínima deve ser um número')
      .transform(Number)
      .refine(val => val >= 1, 'Carga horária mínima deve ser maior que zero')
      .optional(),
    carga_horaria_max: z
      .string()
      .regex(/^\d+$/, 'Carga horária máxima deve ser um número')
      .transform(Number)
      .refine(val => val <= 1000, 'Carga horária máxima não pode exceder 1000 horas')
      .optional()
  }).refine(
    (data) => {
      if (data.carga_horaria_min && data.carga_horaria_max) {
        return data.carga_horaria_min <= data.carga_horaria_max;
      }
      return true;
    },
    { message: 'Carga horária mínima deve ser menor ou igual à máxima' }
  )
});

// Middleware de validação genérico
export const validateSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      }) as any;

      // Aplicar os valores parseados de volta ao request (somente se necessário)
      if (parsed.body) {
        Object.assign(req.body, parsed.body);
      }
      if (parsed.params) {
        Object.assign(req.params, parsed.params);
      }
      
      // Para query, não vamos tentar modificar diretamente
      // A validação já foi feita, os dados estão corretos

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((err: any) => {
          const field = err.path.slice(1).join('.');
          return `${field}: ${err.message}`;
        });
        
        throw new AppError(`Erro de validação: ${messages.join(', ')}`, 400);
      }
      next(error);
    }
  };
};

// Middleware específicos para cada operação
export const validateCreateCourse = validateSchema(createCourseSchema);
export const validateUpdateCourse = validateSchema(updateCourseSchema);
export const validateGetCourse = validateSchema(getCourseSchema);
export const validateCourseFilters = validateSchema(getCourseFiltersSchema);