import { useState, useEffect, ReactNode } from 'react';
import { FormConfig, FormConfigContext } from './formConfigCore';

const DEFAULT_CONFIG: FormConfig = {
  welcomeText: "Bem-vindo ao CRC Sukatech! Preencha os dados a seguir e tenha em mãos cópias dos seus documentos pessoais e comprovante de residência.",
  instructionsText: "Vamos lá? ✨",
  whatsapp: "556241419800",
  email: "contato@sukatech.com",
  maxVagas: 0,
  inscricoesAbertas: true,
  fields: [
    // Dados Pessoais
    { id: 'nome', label: 'Nome Completo', type: 'text', required: true, visible: true, section: 'pessoais', order: 1 },
    { id: 'cpf', label: 'CPF', type: 'text', required: true, visible: true, section: 'pessoais', order: 2 },
    { id: 'rg', label: 'RG', type: 'text', required: false, visible: true, section: 'pessoais', order: 3 },
    { id: 'data_nascimento', label: 'Data de Nascimento', type: 'date', required: true, visible: true, section: 'pessoais', order: 4 },
    { id: 'idade', label: 'Idade', type: 'text', required: true, visible: true, section: 'pessoais', order: 5 },
    { id: 'sexo', label: 'Sexo', type: 'select', required: true, visible: true, section: 'pessoais', order: 6, options: ['FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'] },
    { id: 'deficiencia', label: 'Possui algum tipo de deficiência?', type: 'select', required: true, visible: true, section: 'pessoais', order: 7, options: ['NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'] },
    { id: 'email', label: 'Email', type: 'email', required: true, visible: true, section: 'pessoais', order: 8 },
    { id: 'telefone', label: 'Telefone', type: 'tel', required: true, visible: true, section: 'pessoais', order: 9 },
    { id: 'telefone2', label: 'Telefone 2 (opcional)', type: 'tel', required: false, visible: true, section: 'pessoais', order: 10 },
    { id: 'nome_mae', label: 'Nome da mãe', type: 'text', required: true, visible: true, section: 'pessoais', order: 11 },

    // Endereço
    { id: 'cep', label: 'CEP', type: 'text', required: false, visible: true, section: 'endereco', order: 1 },
    { id: 'rua', label: 'Rua', type: 'text', required: false, visible: true, section: 'endereco', order: 2 },
    { id: 'numero', label: 'Número', type: 'text', required: false, visible: true, section: 'endereco', order: 3 },
    { id: 'complemento', label: 'Complemento', type: 'text', required: false, visible: true, section: 'endereco', order: 4 },
    { id: 'bairro', label: 'Bairro', type: 'text', required: false, visible: true, section: 'endereco', order: 5 },
    { id: 'cidade', label: 'Cidade', type: 'text', required: false, visible: true, section: 'endereco', order: 6 },
    { id: 'estado', label: 'Estado (UF)', type: 'text', required: false, visible: true, section: 'endereco', order: 7 },

    // Documentos
    { id: 'rg_frente', label: 'Identidade do aluno (frente)', type: 'file', required: true, visible: true, section: 'documentos', order: 1 },
    { id: 'rg_verso', label: 'Identidade do aluno (verso)', type: 'file', required: true, visible: true, section: 'documentos', order: 2 },
    { id: 'cpf_aluno', label: 'CPF aluno', type: 'file', required: true, visible: true, section: 'documentos', order: 3 },
    { id: 'comprovante_endereco', label: 'Comprovante de endereço', type: 'file', required: true, visible: true, section: 'documentos', order: 4 },
    { id: 'foto_3x4', label: 'Foto 3x4', type: 'file', required: true, visible: true, section: 'documentos', order: 5 },
    { id: 'comprovante_escolaridade', label: 'Comprovante de Escolaridade', type: 'file', required: false, visible: true, section: 'documentos', order: 6 },
  ]
};

export const FormConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<FormConfig>(DEFAULT_CONFIG);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  // Carregar configuração do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('@sukatech:formConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erro ao carregar configuração do formulário:', error);
      }
    }
    setIsConfigLoaded(true);
  }, []);

  // Ouvir mudanças no localStorage (sincronização entre abas/componentes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@sukatech:formConfig' && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          setConfig(newConfig);
          console.log('🔄 Configuração do formulário atualizada automaticamente!', newConfig);
        } catch (error) {
          console.error('Erro ao processar mudança de configuração:', error);
        }
      }
    };

    // Listener para mudanças de storage entre abas
    window.addEventListener('storage', handleStorageChange);

    // Polling para mudanças no mesmo contexto (mesma aba)
    const intervalId = setInterval(() => {
      const savedConfig = localStorage.getItem('@sukatech:formConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          // Comparar se mudou
          if (JSON.stringify(parsedConfig) !== JSON.stringify(config)) {
            setConfig(parsedConfig);
            console.log('🔄 Configuração sincronizada!');
          }
        } catch (error) {
          // Ignorar erros de parse
        }
      }
    }, 1000); // Verificar a cada 1 segundo

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [config]);

  // Atualizar configuração
  const updateConfig = (newConfig: Partial<FormConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('@sukatech:formConfig', JSON.stringify(updated));

    // Disparar evento customizado para sincronização imediata
    window.dispatchEvent(new CustomEvent('formConfigUpdated', { detail: updated }));
    console.log('✅ Configuração atualizada:', newConfig);
  };

  // Resetar para configuração padrão
  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.setItem('@sukatech:formConfig', JSON.stringify(DEFAULT_CONFIG));
    window.dispatchEvent(new CustomEvent('formConfigUpdated', { detail: DEFAULT_CONFIG }));
  };

  return (
    <FormConfigContext.Provider value={{ config, updateConfig, resetConfig, isConfigLoaded }}>
      {children}
    </FormConfigContext.Provider>
  );
};

