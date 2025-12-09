import { Sequelize } from 'sequelize';
import { env } from './environment.js';

// Detectar se estamos rodando testes e ajustar o host
const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
const databaseHost = isTest ? 'localhost' : env.DATABASE_HOST;

export const sequelize = new Sequelize(
  env.DATABASE_NAME,
  env.DATABASE_USER,
  env.DATABASE_PASSWORD,
  {
    host: databaseHost,
    port: env.DATABASE_PORT,
    dialect: 'mysql', 
    logging: isTest ? false : console.log,
    pool: {
      max: 20,          // Aumentado: máximo de conexões simultâneas
      min: 2,           // Mínimo de conexões
      acquire: 60000,   // Aumentado para 60s: timeout para adquirir conexão (ms)
      idle: 30000       // Aumentado para 30s: timeout para conexão ociosa (ms)
    }
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅✅✅ Conexão com o banco de dados estabelecida com sucesso. ✅✅✅');
  } catch (error) {
    console.error('❌❌❌ Não foi possível conectar ao banco de dados:', error);
  }
};