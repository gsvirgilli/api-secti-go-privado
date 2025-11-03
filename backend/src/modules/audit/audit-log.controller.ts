import { Request, Response } from 'express';
import auditLogService from './audit-log.service.js';

class AuditLogController {
  /**
   * Lista todos os logs de auditoria
   * GET /api/audit-logs
   */
  async listLogs(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        usuario_id: req.query.usuario_id ? Number(req.query.usuario_id) : undefined,
        acao: req.query.acao as string | undefined,
        entidade: req.query.entidade as string | undefined,
        entidade_id: req.query.entidade_id ? Number(req.query.entidade_id) : undefined,
        data_inicio: req.query.data_inicio as string | undefined,
        data_fim: req.query.data_fim as string | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };

      const result = await auditLogService.listLogs(filters);
      res.json(result);
    } catch (error) {
      console.error('[AUDIT] Erro ao listar logs:', error);
      res.status(500).json({ error: 'Erro ao listar logs de auditoria' });
    }
  }

  /**
   * Busca logs de um usuário específico
   * GET /api/audit-logs/user/:id
   */
  async getUserLogs(req: Request, res: Response): Promise<void> {
    try {
      const usuario_id = Number(req.params.id);
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await auditLogService.getLogsByUser(usuario_id, page, limit);
      res.json(result);
    } catch (error) {
      console.error('[AUDIT] Erro ao buscar logs do usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar logs do usuário' });
    }
  }

  /**
   * Busca logs de uma entidade específica
   * GET /api/audit-logs/entity/:type/:id
   */
  async getEntityLogs(req: Request, res: Response): Promise<void> {
    try {
      const entidade = req.params.type;
      const entidade_id = Number(req.params.id);
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await auditLogService.getLogsByEntity(entidade, entidade_id, page, limit);
      res.json(result);
    } catch (error) {
      console.error('[AUDIT] Erro ao buscar logs da entidade:', error);
      res.status(500).json({ error: 'Erro ao buscar logs da entidade' });
    }
  }

  /**
   * Busca um log específico
   * GET /api/audit-logs/:id
   */
  async getLog(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const log = await auditLogService.getLogById(id);

      if (!log) {
        res.status(404).json({ error: 'Log não encontrado' });
        return;
      }

      res.json(log);
    } catch (error) {
      console.error('[AUDIT] Erro ao buscar log:', error);
      res.status(500).json({ error: 'Erro ao buscar log' });
    }
  }

  /**
   * Estatísticas de auditoria
   * GET /api/audit-logs/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        data_inicio: req.query.data_inicio as string | undefined,
        data_fim: req.query.data_fim as string | undefined,
      };

      const stats = await auditLogService.getStats(filters);
      res.json(stats);
    } catch (error) {
      console.error('[AUDIT] Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
}

export default new AuditLogController();
