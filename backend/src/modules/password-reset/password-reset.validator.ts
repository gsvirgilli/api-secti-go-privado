import * as z from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Schema para solicitar recuperação de senha
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().nonempty('Email é obrigatório').email('Email inválido'),
  }),
});

/**
 * Schema para validar token
 */
export const validateTokenSchema = z.object({
  params: z.object({
    token: z.string().nonempty('Token é obrigatório').min(64, 'Token inválido'),
  }),
});

/**
 * Schema para redefinir senha
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().nonempty('Token é obrigatório').min(64, 'Token inválido'),
    newPassword: z
      .string()
      .nonempty('Nova senha é obrigatória')
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  }),
});

/**
 * Middleware genérico de validação com Zod
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          message: 'Erro de validação',
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
