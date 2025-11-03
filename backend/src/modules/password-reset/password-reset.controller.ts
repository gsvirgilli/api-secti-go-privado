import { Request, Response } from 'express';
import { passwordResetService } from './password-reset.service.js';
import { AppError } from '../../utils/AppError.js';

export class PasswordResetController {
  /**
   * Solicita recuperação de senha
   * POST /api/auth/forgot-password
   */
  async requestReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const result = await passwordResetService.requestPasswordReset(email);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw new AppError('Erro ao processar solicitação', 500);
    }
  }

  /**
   * Valida token de recuperação
   * GET /api/auth/reset-password/:token
   */
  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;

      const result = await passwordResetService.validateToken(token);

      if (!result.valid) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw new AppError('Erro ao validar token', 500);
    }
  }

  /**
   * Redefine a senha
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const result = await passwordResetService.resetPassword(token, newPassword);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      if (error.message === 'Token inválido' || 
          error.message.includes('Token expirado') ||
          error.message.includes('Token inválido ou já utilizado')) {
        throw new AppError(error.message, 400);
      }
      
      throw new AppError('Erro ao redefinir senha', 500);
    }
  }
}

export const passwordResetController = new PasswordResetController();
