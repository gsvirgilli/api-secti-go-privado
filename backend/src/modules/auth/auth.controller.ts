import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      return res.status(error.statusCode || 500).json({ 
        error: error.message || 'Erro ao registrar usuário' 
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      return res.status(error.statusCode || 500).json({ 
        error: error.message || 'Erro ao fazer login' 
      });
    }
  }
}