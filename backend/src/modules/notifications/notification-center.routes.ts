import { Router } from 'express';
import NotificationCenterController from './notification-center.controller.js';

const router = Router();

/**
 * Rotas de Notificações
 */
router.get('/', NotificationCenterController.list.bind(NotificationCenterController));
router.get('/unread', NotificationCenterController.getUnread.bind(NotificationCenterController));
router.put('/:id/read', NotificationCenterController.markAsRead.bind(NotificationCenterController));
router.put('/read-all', NotificationCenterController.markAllAsRead.bind(NotificationCenterController));
router.delete('/:id', NotificationCenterController.delete.bind(NotificationCenterController));

export default router;
