import { Sequelize } from 'sequelize';
import { env } from './environment.js'; 

export const sequelize = new Sequelize(
  env.DATABASE_NAME,
  env.DATABASE_USER,
  env.DATABASE_PASSWORD,
  {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    dialect: 'mysql', 
    logging: console.log, 
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