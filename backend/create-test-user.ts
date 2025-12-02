import { sequelize } from './src/config/database.js';
import User from './src/modules/users/user.model.js';
import bcryptjs from 'bcryptjs';

async function createTestUser() {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');

    // Verificar se usuário já existe
    const existingUser = await User.findOne({
      where: { email: 'teste@example.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário de teste já existe');
      console.log('Email: teste@example.com');
      console.log('Senha: Teste123!');
      process.exit(0);
    }

    // Criar hash da senha
    const senhaHash = await bcryptjs.hash('Teste123!', 10);

    // Criar usuário de teste
    const user = await User.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: senhaHash,
      role: 'admin'
    });

    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('Email: teste@example.com');
    console.log('Senha: Teste123!');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  }
}

createTestUser();
