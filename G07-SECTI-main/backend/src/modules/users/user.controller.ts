import type { Request, Response } from 'express';
import User from './user.model.js';
import { getUserIdNumber } from '../../utils/user.js';
import { AppError } from '../../utils/AppError.js';

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
}
