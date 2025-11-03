import nodemailer from 'nodemailer';

/**
 * Configuração do serviço de email usando Nodemailer
 * Suporta múltiplos provedores SMTP através de variáveis de ambiente
 */

// Validar variáveis de ambiente necessárias
const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM_EMAIL',
  'SMTP_FROM_NAME'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.warn(`⚠️  Variáveis de email não configuradas: ${missingVars.join(', ')}`);
  console.warn('⚠️  O sistema de notificações por email não funcionará.');
}

/**
 * Configuração do transporter do Nodemailer
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Configurações adicionais para produção
  pool: true, // Usar pool de conexões
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000, // Taxa de envio
  rateLimit: 10 // Máximo de emails por segundo
});

/**
 * Configurações padrão de email
 */
export const emailConfig = {
  from: {
    email: process.env.SMTP_FROM_EMAIL || 'noreply@secti.com',
    name: process.env.SMTP_FROM_NAME || 'SECTI - Sistema de Cursos'
  },
  // Templates paths
  templatesDir: './src/templates/emails',
  // Configurações de retry
  maxRetries: 3,
  retryDelay: 5000 // 5 segundos
};

/**
 * Verifica se o serviço de email está configurado
 */
export const isEmailConfigured = (): boolean => {
  return missingVars.length === 0;
};

/**
 * Testa a conexão com o servidor SMTP
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
  if (!isEmailConfigured()) {
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Servidor de email conectado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao servidor de email:', error);
    return false;
  }
};

export default transporter;
