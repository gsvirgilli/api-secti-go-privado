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
      .enum(['PENDENTE', 'APROVADO', 'REPROVADO', 'LISTA_ESPERA'], {
        message: 'Status deve ser PENDENTE, APROVADO, REPROVADO ou LISTA_ESPERA'
      })
      .optional()
      .default('PENDENTE'),

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
      .enum(['PENDENTE', 'APROVADO', 'REPROVADO', 'LISTA_ESPERA'], {
        message: 'Status deve ser PENDENTE, APROVADO, REPROVADO ou LISTA_ESPERA'
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
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      // Aceita valores separados por vírgula e valida cada um
      const validStatuses = ['PENDENTE', 'APROVADO', 'REPROVADO', 'LISTA_ESPERA'];
      const statuses = val.split(',').map((s) => s.trim());
      
      for (const status of statuses) {
        if (!validStatuses.includes(status)) {
          throw new Error(`Status inválido: ${status}. Deve ser um de: ${validStatuses.join(', ')}`);
        }
      }
      return statuses;
    }),
  
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
    opcaoCurso: z
      .number()
      .int()
      .refine((val) => val === 1 || val === 2, {
        message: 'Opção de curso deve ser 1 ou 2'
      })
      .optional()
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

    // Dados pessoais adicionais (opcionais)
    rg: z
      .string()
      .max(20, 'RG deve ter no máximo 20 caracteres')
      .optional()
      .nullable(),

    sexo: z
      .enum(['FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'], { message: 'Sexo deve ser FEMININO, MASCULINO, OUTRO ou PREFIRO_NAO_INFORMAR' })
      .optional()
      .nullable(),

    deficiencia: z
      .enum(['NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'], { message: 'Deficiência deve ser um valor válido' })
      .optional()
      .nullable(),

    telefone2: z
      .string()
      .max(20, 'Segundo telefone deve ter no máximo 20 caracteres')
      .optional()
      .nullable(),

    idade: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable(),

    nome_mae: z
      .string()
      .max(100, 'Nome da mãe deve ter no máximo 100 caracteres')
      .optional()
      .nullable(),

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

    // Curso e turno desejados (obrigatórios)
    curso_id: z
      .number({ message: 'ID do curso é obrigatório' })
      .int('ID do curso deve ser um número inteiro')
      .positive('ID do curso deve ser positivo'),

    turno: z
      .enum(['MATUTINO', 'VESPERTINO', 'NOTURNO'], {
        message: 'Turno deve ser MATUTINO, VESPERTINO ou NOTURNO'
      }),

    // Curso - segunda opção (opcionais)
    curso_id2: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable(),

    turno2: z
      .enum(['MATUTINO', 'VESPERTINO', 'NOTURNO'])
      .optional()
      .nullable(),

    local_curso: z
      .string()
      .max(255)
      .optional()
      .nullable(),

    // Questionário Social (opcionais)
    raca_cor: z
      .enum(['BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'], { message: 'Raça/Cor deve ser um valor válido' })
      .optional()
      .nullable(),

    renda_mensal: z
      .enum(['SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM'], { message: 'Renda mensal deve ser um valor válido' })
      .optional()
      .nullable(),

    pessoas_renda: z
      .string()
      .optional()
      .nullable(),

    tipo_residencia: z
      .enum(['PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'], { message: 'Tipo de residência deve ser um valor válido' })
      .optional()
      .nullable(),

    itens_casa: z
      .string()
      .optional()
      .nullable(),

    // Programa Goianas (opcional)
    goianas_ciencia: z
      .enum(['SIM', 'NAO'], { message: 'Goianas Ciência deve ser SIM ou NAO' })
      .optional()
      .nullable(),

    // Responsável Legal (opcionais)
    menor_idade: z
      .boolean()
      .optional()
      .nullable(),

    nome_responsavel: z
      .string()
      .max(100, 'Nome do responsável deve ter no máximo 100 caracteres')
      .optional()
      .nullable(),

    cpf_responsavel: z
      .string()
      .regex(/^\d{11}$/, 'CPF do responsável deve conter 11 dígitos')
      .optional()
      .nullable()
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
