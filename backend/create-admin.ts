import User from './src/modules/users/user.model';
import * as bcrypt from 'bcrypt';
import { sequelize } from './src/config/database';

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({
      where: { email: 'admin@sukatech.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin já existe:');
      console.log({
        id: existingAdmin.id,
        nome: existingAdmin.nome,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      
      // Atualizar a senha
      const hashedPassword = await bcrypt.hash('admin123', 8);
      await existingAdmin.update({ senha_hash: hashedPassword });
      console.log('✅ Senha atualizada para: admin123');
    } else {
      // Criar novo admin
      const hashedPassword = await bcrypt.hash('admin123', 8);
      const admin = await User.create({
        nome: 'Administrador',
        email: 'admin@sukatech.com',
        senha_hash: hashedPassword,
        role: 'ADMIN'
      });
      
      console.log('✅ Admin criado com sucesso:');
      console.log({
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role
      });
    }

    // Listar todos os usuários
    console.log('\n📋 Todos os usuários:');
    const users = await User.findAll({
      attributes: ['id', 'nome', 'email', 'role']
    });
    console.table(users.map((u: any) => u.toJSON()));

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

createAdmin();
