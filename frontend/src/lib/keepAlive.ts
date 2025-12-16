import { api } from './api';

/**
 * Sistema de keep-alive para manter a API acordada
 * Envia requisições periódicas para evitar que o Render coloque em sleep
 */

const KEEP_ALIVE_INTERVAL = 30 * 60 * 1000; // 30 minutos
const KEEP_ALIVE_TIMEOUT = 30000; // 30 segundos

let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export const startKeepAlive = () => {
  if (keepAliveInterval) return; // Já está rodando

  console.log('🔄 Keep-alive iniciado - enviando pings a cada 30 minutos');

  keepAliveInterval = setInterval(async () => {
    try {
      await api.get('/health', { timeout: KEEP_ALIVE_TIMEOUT });
      console.log('✅ Keep-alive ping bem-sucedido');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.warn('⚠️ Keep-alive ping falhou:', errorMessage);
    }
  }, KEEP_ALIVE_INTERVAL);
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Keep-alive parado');
  }
};
