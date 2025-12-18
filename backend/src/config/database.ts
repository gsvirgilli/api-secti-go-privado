import { Sequelize } from 'sequelize';
import { env } from './environment.js';

// Detectar se estamos rodando testes e ajustar o host
const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

// Usa a variável de ambiente DB_HOST se existir, senão usa DATABASE_HOST do env schema, senão 'localhost'
const databaseHost = isTest 
  ? 'localhost' 
  : (process.env.DB_HOST || env.DATABASE_HOST || 'localhost');

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
      max: 20,          // Máximo de conexões simultâneas
      min: 2,           // Mínimo de conexões
      acquire: 60000,   // Timeout para adquirir conexão (ms)
      idle: 30000       // Timeout para conexão ociosa (ms)
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