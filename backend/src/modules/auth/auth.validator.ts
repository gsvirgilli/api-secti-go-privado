import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    email: z.string().nonempty('Email é obrigatório').email('Formato de email inválido'),
    senha: z.string().nonempty('Senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
    role: z.enum(['ADMIN', 'INSTRUTOR']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().nonempty('Email é obrigatório').email('Formato de email inválido'),
    senha: z.string().nonempty('Senha é obrigatória'),
  }),
});

export {
  registerSchema,
  loginSchema,
};

export type RegisterBody = z.infer<typeof registerSchema>['body'];
export type LoginBody = z.infer<typeof loginSchema>['body'];