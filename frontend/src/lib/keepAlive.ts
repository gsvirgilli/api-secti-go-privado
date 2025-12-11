import axios from 'axios';

/**
 * Sistema de keep-alive para manter a API acordada
 * Envia requisições periódicas para evitar que o Render coloque em sleep
 */

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api';
const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 minutos (antes do timeout de 15 min do Render)

let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export const startKeepAlive = () => {
  if (keepAliveInterval) return; // Já está rodando

  console.log('🔄 Keep-alive iniciado - enviando pings a cada 4 minutos');

  keepAliveInterval = setInterval(() => {
    axios
      .get(`${API_URL}/health`, { timeout: 5000 })
      .then(() => {
        console.log('✅ Keep-alive ping bem-sucedido');
      })
      .catch((error) => {
        console.log('⚠️ Keep-alive ping falhou:', error.message);
      });
  }, KEEP_ALIVE_INTERVAL);
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Keep-alive parado');
  }
};
