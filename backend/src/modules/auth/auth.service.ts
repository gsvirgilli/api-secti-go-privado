import bcrypt from 'bcryptjs';
import User from '../users/user.model.js';
import { signJwt } from '../../utils/jwt.js';
import type { LoginBody, RegisterBody } from './auth.validator.js';

export class AuthService {
  public async register(userData: RegisterBody) {
    const { email, senha, role } = userData;

    const existingUser = await User.findOne({ where: { email } });
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

    const { senha_hash: _omit, ...safeUser } = (newUser.toJSON?.() ?? newUser) as any;
    return safeUser;
  }

  public async login(loginData: LoginBody) {
    const { email, senha } = loginData;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new (await import('../../utils/AppError.js')).AppError('Email ou senha inválidos.', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(senha, user.senha_hash);
    if (!isPasswordCorrect) {
      throw new (await import('../../utils/AppError.js')).AppError('Email ou senha inválidos.', 401);
    }

    // Garantir que o ID está presente
    if (!user.id) {
      throw new (await import('../../utils/AppError.js')).AppError('Erro interno: ID do usuário não encontrado.', 500);
    }

    const token = signJwt({ sub: String(user.id), role: user.role });

    const { senha_hash: _omit, ...safeUser } = (user.toJSON?.() ?? user) as any;
    return { user: safeUser, token };
  }
}