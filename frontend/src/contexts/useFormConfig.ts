import { useContext } from 'react';
import { FormConfigContext } from './formConfigCore';

export const useFormConfig = () => {
  const context = useContext(FormConfigContext);
  if (!context) {
    throw new Error('useFormConfig deve ser usado dentro de FormConfigProvider');
  }
  return context;
};
