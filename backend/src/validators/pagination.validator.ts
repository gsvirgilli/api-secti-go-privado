import * as z from 'zod';

/**
 * Schema para validação de parâmetros de paginação
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 1))
    .refine(val => val >= 1, { message: 'Página deve ser maior ou igual a 1' }),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 10))
    .refine(val => val >= 1 && val <= 100, { 
      message: 'Limite deve estar entre 1 e 100' 
    })
});

export type PaginationInput = z.infer<typeof paginationSchema>;
