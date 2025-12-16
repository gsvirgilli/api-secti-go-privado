import Notification from './notification-center.model.js';
import { Op } from 'sequelize';

class NotificationCenterService {
  /**
   * Lista notificações com filtros
   */
  async list(filters: {
    lido?: boolean;
    tipo?: string;
    page?: number;
    limit?: number;
  }) {
    const { lido, tipo, page = 1, limit = 20 } = filters;

    const where: any = {};

    if (typeof lido === 'boolean') where.lido = lido;
    if (tipo) where.tipo = tipo;

    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Busca notificações não lidas
   */
  async getUnread() {
    const notifications = await Notification.findAll({
      where: { lido: false },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const unreadCount = await this.getUnreadCount();

    return {
      data: notifications,
      unreadCount,
    };
  }

  /**
   * Conta notificações não lidas
   */
  async getUnreadCount() {
    return await Notification.count({
      where: { lido: false },
    });
  }

  /**
   * Busca uma notificação por ID
   */
  async findById(id: number): Promise<Notification> {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      throw new Error('Notificação não encontrada');
    }
    return notification;
  }

  /**
   * Cria uma nova notificação
   */
  async create(data: {
    titulo: string;
    descricao: string;
    tipo: 'ALUNO' | 'TURMA' | 'INSTRUTOR' | 'CALENDARIO' | 'CANDIDATO';
    icone?: string;
  }): Promise<Notification> {
    return await Notification.create(data);
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findById(id);
    await notification.update({ lido: true });
    return notification;
  }

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead(): Promise<number> {
    const [count] = await Notification.update(
      { lido: true },
      { where: { lido: false } }
    );
    return count;
  }

  /**
   * Deleta uma notificação
   */
  async delete(id: number): Promise<void> {
    const notification = await this.findById(id);
    await notification.destroy();
  }

  /**
   * Deleta notificações antigas (mais de 30 dias)
   */
  async deleteOldNotifications(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const count = await Notification.destroy({
      where: {
        createdAt: { [Op.lt]: thirtyDaysAgo },
      },
    });

    return count;
  }
}

export default new NotificationCenterService();
