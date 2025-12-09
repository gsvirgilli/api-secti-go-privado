import { createContext } from 'react';

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'file'
  | 'checkbox'
  | 'textarea';

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  visible: boolean;
  placeholder?: string;
  options?: string[];
  section: string;
  order: number;
}

export interface FormConfig {
  welcomeText: string;
  instructionsText: string;
  whatsapp: string;
  email: string;
  maxVagas: number;
  inscricoesAbertas: boolean;
  fields: FieldConfig[];
}

export interface FormConfigContextType {
  config: FormConfig;
  updateConfig: (newConfig: Partial<FormConfig>) => void;
  resetConfig: () => void;
  isConfigLoaded: boolean;
}

export const FormConfigContext = createContext<FormConfigContextType | undefined>(undefined);
