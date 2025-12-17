/**
 * Formata um CPF no padrão XXX.XXX.XXX-XX
 */
export const formatCPF = (cpf: string | undefined | null): string => {
  if (!cpf) return '';
  const cleanCPF = String(cpf).replace(/\D/g, '');
  if (cleanCPF.length !== 11) return String(cpf);
  return `${cleanCPF.substring(0, 3)}.${cleanCPF.substring(3, 6)}.${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}`;
};

/**
 * Remove formatação de CPF, retornando apenas números
 */
export const removeCPFFormatting = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};
