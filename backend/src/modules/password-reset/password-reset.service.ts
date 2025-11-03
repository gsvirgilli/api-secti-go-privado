import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../users/user.model.js';
import PasswordResetToken from './password-reset-token.model.js';
import transporter, { emailConfig } from '../../config/email.js';

/**
 * Helper para enviar email usando o transporter
 */
async function sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
    to,
    subject,
    text,
    html
  });
}

export class PasswordResetService {
  /**
   * Solicita recuperação de senha gerando token e enviando email
   * @param email Email do usuário
   * @returns Mensagem genérica (não revela se email existe)
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      // Busca usuário por email
      const usuario = await User.findOne({ where: { email } });

      // Por segurança, sempre retorna sucesso (não revela se email existe)
      if (!usuario) {
        return { 
          message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.'
        };
      }

      // Gera token seguro (32 bytes = 64 caracteres hex)
      const token = crypto.randomBytes(32).toString('hex');

      // Define expiração do token (1 hora a partir de agora)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Invalida tokens anteriores não usados deste usuário
      await PasswordResetToken.update(
        { used: true },
        { 
          where: { 
            usuario_id: usuario.id,
            used: false 
          } 
        }
      );

      // Cria novo token no banco
      await PasswordResetToken.create({
        usuario_id: usuario.id,
        token,
        expires_at: expiresAt,
        used: false
      });

      // Envia email com link de recuperação
      await this.sendPasswordResetEmail(usuario.email, usuario.nome, token);

      return { 
        message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.'
      };
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw new Error('Erro ao processar solicitação de recuperação de senha');
    }
  }

  /**
   * Valida se o token é válido
   * @param token Token de recuperação
   * @returns Informações sobre a validade do token
   */
  async validateToken(token: string): Promise<{ valid: boolean; message?: string }> {
    try {
      const resetToken = await PasswordResetToken.findOne({
        where: { 
          token,
          used: false
        },
        include: [{ 
          model: User,
          attributes: ['id', 'email', 'nome'],
          as: 'user'
        }]
      });

      if (!resetToken) {
        return { 
          valid: false, 
          message: 'Token inválido ou já utilizado' 
        };
      }

      // Verifica se o token está expirado
      const now = new Date();
      if (now > resetToken.expires_at) {
        return { 
          valid: false, 
          message: 'Token expirado. Solicite uma nova recuperação de senha.' 
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw new Error('Erro ao validar token');
    }
  }

  /**
   * Redefine a senha do usuário
   * @param token Token de recuperação
   * @param newPassword Nova senha
   * @returns Mensagem de sucesso
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Valida o token
      const validation = await this.validateToken(token);
      if (!validation.valid) {
        throw new Error(validation.message || 'Token inválido');
      }

      // Busca token com usuário
      const resetToken = await PasswordResetToken.findOne({
        where: { 
          token,
          used: false
        },
        include: [{ 
          model: User,
          attributes: ['id', 'email', 'nome'],
          as: 'user'
        }]
      });

      if (!resetToken || !(resetToken as any).user) {
        throw new Error('Token inválido');
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Pega o ID do usuário do token
      const userId = (resetToken as any).dataValues?.usuario_id || resetToken.usuario_id;
      
      if (!userId) {
        throw new Error('ID do usuário não encontrado no token');
      }

      // Atualiza senha do usuário
      await User.update(
        { senha_hash: hashedPassword },
        { where: { id: userId } }
      );

      // Marca token como usado
      await resetToken.update({ used: true });

      // Invalida todos os outros tokens não usados deste usuário
      const tokenId = (resetToken as any).dataValues?.id || resetToken.id;
      
      if (tokenId) {
        await PasswordResetToken.update(
          { used: true },
          { 
            where: { 
              usuario_id: userId,
              used: false,
              id: { [Op.ne]: tokenId }
            } 
          }
        );
      }

      // Envia email de confirmação
      const user = (resetToken as any).user;
      await this.sendPasswordChangedEmail(user.email, user.nome);

      return { message: 'Senha redefinida com sucesso!' };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  }

  /**
   * Limpa tokens expirados do banco (executar via cron job)
   * @returns Quantidade de tokens removidos
   */
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const now = new Date();
      const result = await PasswordResetToken.destroy({
        where: {
          expires_at: { [Op.lt]: now }
        }
      });
      
      console.log(`Limpeza de tokens: ${result} tokens expirados removidos`);
      return result;
    } catch (error) {
      console.error('Erro ao limpar tokens expirados:', error);
      throw new Error('Erro ao limpar tokens expirados');
    }
  }

  /**
   * Envia email com link de recuperação de senha
   * @param email Email do usuário
   * @param name Nome do usuário
   * @param token Token de recuperação
   */
  private async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    // URL do frontend (configurável via env)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/new-password?token=${token}`;

    const subject = 'Recuperação de Senha - Sistema SECTI';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e0e0e0;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recuperação de Senha</h1>
          </div>
          
          <p>Olá, <strong>${name}</strong>!</p>
          
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no Sistema SECTI.</p>
          
          <p>Para criar uma nova senha, clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Redefinir Senha</a>
          </div>
          
          <p>Ou copie e cole o link abaixo no seu navegador:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
            <a href="${resetLink}">${resetLink}</a>
          </p>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Este link é válido por <strong>1 hora</strong></li>
              <li>Por questões de segurança, o link só pode ser usado uma vez</li>
              <li>Se você não solicitou esta recuperação, ignore este email</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p><strong>Sistema SECTI</strong> - Secretaria de Ciência, Tecnologia e Inovação</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá, ${name}!

      Recebemos uma solicitação para redefinir a senha da sua conta no Sistema SECTI.

      Para criar uma nova senha, acesse o link abaixo:
      ${resetLink}

      IMPORTANTE:
      - Este link é válido por 1 hora
      - Por questões de segurança, o link só pode ser usado uma vez
      - Se você não solicitou esta recuperação, ignore este email

      Sistema SECTI - Secretaria de Ciência, Tecnologia e Inovação
    `;

    await sendEmail(email, subject, text, html);
  }

  /**
   * Envia email de confirmação de senha alterada
   * @param email Email do usuário
   * @param name Nome do usuário
   */
  private async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    const subject = 'Senha Alterada com Sucesso - Sistema SECTI';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e0e0e0;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
          }
          .success-icon {
            font-size: 48px;
            text-align: center;
            margin: 20px 0;
          }
          .info-box {
            background-color: #e3f2fd;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Senha Alterada</h1>
          </div>
          
          <div class="success-icon">✅</div>
          
          <p>Olá, <strong>${name}</strong>!</p>
          
          <p>Sua senha foi alterada com sucesso!</p>
          
          <div class="info-box">
            <strong>ℹ️ Informação:</strong>
            <p style="margin: 10px 0;">
              Se você não realizou esta alteração, entre em contato imediatamente com o suporte
              para proteger sua conta.
            </p>
          </div>
          
          <p>Data e hora da alteração: <strong>${new Date().toLocaleString('pt-BR')}</strong></p>
          
          <p>Agora você já pode fazer login com sua nova senha.</p>
          
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p><strong>Sistema SECTI</strong> - Secretaria de Ciência, Tecnologia e Inovação</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá, ${name}!

      Sua senha foi alterada com sucesso!

      Se você não realizou esta alteração, entre em contato imediatamente com o suporte
      para proteger sua conta.

      Data e hora da alteração: ${new Date().toLocaleString('pt-BR')}

      Agora você já pode fazer login com sua nova senha.

      Sistema SECTI - Secretaria de Ciência, Tecnologia e Inovação
    `;

    await sendEmail(email, subject, text, html);
  }
}

export const passwordResetService = new PasswordResetService();
