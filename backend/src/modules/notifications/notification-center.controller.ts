import { Request, Response } from 'express';
import NotificationCenterService from './notification-center.service.js';

class NotificationCenterController {
  /**
   * Lista notificações
   * GET /api/notifications
   */
  async list(req: Request, res: Response) {
    try {
      const { lido, tipo, page, limit } = req.query;
      const result = await NotificationCenterService.list({
        lido: lido ? lido === 'true' : undefined,
        tipo: tipo as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      return res.status(500).json({ error: 'Erro ao listar notificações' });
    }
  }

  /**
   * Busca notificações não lidas
   * GET /api/notifications/unread
   */
  async getUnread(req: Request, res: Response) {
    try {
      const result = await NotificationCenterService.getUnread();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      return res.status(500).json({ error: 'Erro ao buscar notificações não lidas' });
    }
  }

  /**
   * Marca uma notificação como lida
   * PUT /api/notifications/:id/read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = await NotificationCenterService.markAsRead(Number(id));
      return res.status(200).json(notification);
    } catch (error) {
      if (error instanceof Error && error.message === 'Notificação não encontrada') {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }
      console.error('Erro ao marcar notificação como lida:', error);
      return res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
    }
  }

  /**
   * Marca todas as notificações como lidas
   * PUT /api/notifications/read-all
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const count = await NotificationCenterService.markAllAsRead();
      return res.status(200).json({ message: `${count} notificações marcadas como lidas` });
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      return res.status(500).json({ error: 'Erro ao marcar todas as notificações como lidas' });
    }
  }

  /**
   * Deleta uma notificação
   * DELETE /api/notifications/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await NotificationCenterService.delete(Number(id));
      return res.status(200).json({ message: 'Notificação deletada' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Notificação não encontrada') {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }
      console.error('Erro ao deletar notificação:', error);
      return res.status(500).json({ error: 'Erro ao deletar notificação' });
    }
  }
}

export default new NotificationCenterController();
