// Validações e máscaras para dados brasileiros

export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleanCPF.charAt(9)) === digit1 && parseInt(cleanCPF.charAt(10)) === digit2;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const validateAge = (birthDate: string, minAge: number = 14, maxAge: number = 100): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }
  
  return age >= minAge && age <= maxAge;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Máscaras
export const maskCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const maskPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanValue.length === 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return cleanValue;
};

export const maskCEP = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const maskRG = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
};

// Função para buscar endereço por CEP
export const fetchAddressByCEP = async (cep: string): Promise<any> => {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return null;
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) return null;
    
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      cep: data.cep
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

// Estados civis
export const civilStatusOptions = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao-estavel', label: 'União Estável' }
];

// Escolaridade
export const educationOptions = [
  { value: 'fundamental-incompleto', label: 'Fundamental Incompleto' },
  { value: 'fundamental-completo', label: 'Fundamental Completo' },
  { value: 'medio-incompleto', label: 'Médio Incompleto' },
  { value: 'medio-completo', label: 'Médio Completo' },
  { value: 'superior-incompleto', label: 'Superior Incompleto' },
  { value: 'superior-completo', label: 'Superior Completo' },
  { value: 'pos-graduacao', label: 'Pós-Graduação' },
  { value: 'mestrado', label: 'Mestrado' },
  { value: 'doutorado', label: 'Doutorado' }
];
