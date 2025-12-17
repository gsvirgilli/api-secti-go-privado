import type { Request, Response } from 'express';
import User from './user.model.js';
import { getUserIdNumber } from '../../utils/user.js';
import { AppError } from '../../utils/AppError.js';
import bcrypt from 'bcryptjs';

export class UserController {
  async me(req: Request, res: Response) {
    const userId = getUserIdNumber(req.user);
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['senha_hash'] },
    });
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return res.json(user);
  }

  async updateProfile(req: Request, res: Response) {
    const userId = getUserIdNumber(req.user);
    const { nome, email, telefone, endereco, dataNascimento, cpf, currentPassword, newPassword } = req.body;

    console.log('Atualizando perfil do usuário:', userId, { nome, email, telefone, endereco, dataNascimento, cpf, newPassword: newPassword ? '***' : undefined });

    // Validações básicas
    if (!nome || !email) {
      throw new AppError('Nome e email são obrigatórios', 400);
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Email inválido', 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Se estiver alterando email, verificar se já existe
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('Este email já está em uso', 400);
      }
    }

    // Se estiver alterando senha
    if (newPassword) {
      if (!currentPassword) {
        throw new AppError('Senha atual é obrigatória para alterar a senha', 400);
      }

      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(currentPassword, user.senha_hash);
      if (!isValidPassword) {
        throw new AppError('Senha atual incorreta', 401);
      }

      if (newPassword.length < 6) {
        throw new AppError('A nova senha deve ter pelo menos 6 caracteres', 400);
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.senha_hash = hashedPassword;
    }

    // Atualizar dados do usuário
    user.nome = nome;
    user.email = email;
    
    // Atualizar campos extras se existirem (telefone, endereco, etc)
    // Esses campos podem ser adicionados ao modelo User depois se necessário
    // Por enquanto, apenas nome e email são atualizados

    await user.save();

    console.log('Perfil atualizado com sucesso:', userId);

    return res.json({
      message: 'Perfil atualizado com sucesso',
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      }
    });
  }

  async uploadAvatar(req: Request, res: Response) {
    const userId = getUserIdNumber(req.user);
    const file = (req as any).file;

    if (!file) {
      throw new AppError('Nenhum arquivo foi enviado', 400);
    }

    // Validar tipo de arquivo
    if (!file.mimetype.startsWith('image/')) {
      throw new AppError('O arquivo deve ser uma imagem válida', 400);
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new AppError('A imagem não pode ser maior que 5MB', 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Construir URL do upload usando o filename que multer já criou
    // O arquivo já foi salvo em /uploads/avatars/ pelo multer
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    
    user.avatar_url = avatarUrl;
    await user.save();

    return res.json({
      message: 'Avatar atualizado com sucesso',
      avatar_url: avatarUrl,
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        avatar_url: user.avatar_url,
      }
    });
  }}