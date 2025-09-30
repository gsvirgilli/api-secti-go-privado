import bcrypt from 'bcryptjs';
import User from '../users/user.model.js';
import { signJwt } from '../../utils/jwt.js';
import type { LoginBody, RegisterBody } from './auth.validator.js';

export class AuthService {
  public async register(userData: RegisterBody) {
    const { email, senha, role } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Este email já está em uso.');
    }

    const senha_hash = await bcrypt.hash(senha, 8);

    const newUser = await User.create({
      email,
      senha_hash,
      role,
    });

    const { senha_hash: _omit, ...safeUser } = (newUser.toJSON?.() ?? newUser) as any;
    return safeUser;
  }

  public async login(loginData: LoginBody) {
    const { email, senha } = loginData;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email ou senha inválidos.');
    }

    const isPasswordCorrect = await bcrypt.compare(senha, user.senha_hash);
    if (!isPasswordCorrect) {
      throw new Error('Email ou senha inválidos.');
    }

    const token = signJwt({ sub: String(user.id), role: user.role });

    const { senha_hash: _omit, ...safeUser } = (user.toJSON?.() ?? user) as any;
    return { user: safeUser, token };
  }
}