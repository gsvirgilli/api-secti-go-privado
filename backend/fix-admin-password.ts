import bcryptjs from 'bcryptjs';

// Gerar o hash para a senha "admin123"
const senha = 'admin123';

async function gerarHash() {
  try {
    const hash = await bcryptjs.hash(senha, 10);
    console.log('Hash para "admin123":');
    console.log(hash);
    console.log('\nSQL para atualizar:');
    console.log(`UPDATE usuarios SET senha = '${hash}' WHERE email = 'admin@example.com';`);
  } catch (error) {
    console.error('Erro:', error);
  }
}

gerarHash();
