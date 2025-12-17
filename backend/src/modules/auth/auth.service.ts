import bcrypt from 'bcryptjs';
import User from '../users/user.model.js';
import { signJwt } from '../../utils/jwt.js';
import type { LoginBody, RegisterBody } from './auth.validator.js';

export class AuthService {
  public async register(userData: RegisterBody) {
    const { email, senha, role } = userData;

    const existingUser = await User.findOne({ 
      where: { email },
      attributes: ['id'] // Apenas verificar se existe
    });
    if (existingUser) {
      throw new (await import('../../utils/AppError.js')).AppError('Este email já está em uso.', 409);
    }

    const senha_hash = await bcrypt.hash(senha, 8);

    const newUser = await User.create({
      nome: userData.nome,
      email,
      senha_hash,
      role: userData.role || 'INSTRUTOR',
    });

    const safeUser = newUser.toJSON ? (newUser.toJSON() as any) : (newUser as any);
    delete safeUser.senha_hash;
    return safeUser;
  }

  public async login(loginData: LoginBody) {
    const { email, senha } = loginData;

    const loginStart = Date.now();
    
    // Buscar usuário pelo email (com índice otimizado)
    const userSearchStart = Date.now();
    const user = await User.findOne({ 
      where: { email },
      attributes: { exclude: ['createdAt', 'updatedAt'] } // Remover timestamps desnecessários
    });
    const userSearchTime = Date.now() - userSearchStart;
    
    if (!user) {
      throw new (await import('../../utils/AppError.js')).AppError('Email ou senha inválidos.', 401);
    }

    // Validar senha
    const passwordStart = Date.now();
    console.log('🔐 DEBUG - Verificando senha:');
    console.log('  - Senha recebida (primeiros 5 chars):', senha ? senha.substring(0, 5) : 'NULL');
    console.log('  - Hash no banco (primeiros 20 chars):', user.senha_hash ? user.senha_hash.substring(0, 20) : 'NULL');
    console.log('  - Tipo do hash:', typeof user.senha_hash);
    
    const isPasswordCorrect = await bcrypt.compare(senha, user.senha_hash);
    const passwordTime = Date.now() - passwordStart;
    
    console.log('  - Resultado do compare:', isPasswordCorrect);
    console.log('  - Tempo de comparação:', passwordTime, 'ms');
    
    if (!isPasswordCorrect) {
      throw new (await import('../../utils/AppError.js')).AppError('Email ou senha inválidos.', 401);
    }

    // Garantir que o ID está presente
    if (!user.id) {
      throw new (await import('../../utils/AppError.js')).AppError('Erro interno: ID do usuário não encontrado.', 500);
    }

    // Gerar token
    const tokenStart = Date.now();
    const token = signJwt({ sub: String(user.id), role: user.role });
    const tokenTime = Date.now() - tokenStart;

    const safeUser = user.toJSON ? (user.toJSON() as any) : (user as any);
    delete safeUser.senha_hash;
    
    const totalTime = Date.now() - loginStart;
    console.log(`[LOGIN PERF] Email search: ${userSearchTime}ms | Password check: ${passwordTime}ms | Token gen: ${tokenTime}ms | Total: ${totalTime}ms`);

    return { user: safeUser, token };
  }
}