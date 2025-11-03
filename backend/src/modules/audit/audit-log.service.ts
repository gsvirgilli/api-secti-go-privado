import AuditLog from './audit-log.model.js';
import { Op } from 'sequelize';
import { PaginatedResponse, createPagination, normalizePagination } from '../../utils/pagination.js';

interface AuditLogFilters {
  usuario_id?: number;
  acao?: string;
  entidade?: string;
  entidade_id?: number;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

interface CreateAuditLogData {
  usuario_id?: number;
  acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT';
  entidade: string;
  entidade_id?: number;
  dados_anteriores?: object;
  dados_novos?: object;
  ip?: string;
  user_agent?: string;
  descricao?: string;
}

class AuditLogService {
  /**
   * Cria um novo log de auditoria
   */
  async createLog(data: CreateAuditLogData): Promise<AuditLog> {
    try {
      const log = await AuditLog.create({
        usuario_id: data.usuario_id || null,
        acao: data.acao,
        entidade: data.entidade,
        entidade_id: data.entidade_id || null,
        dados_anteriores: data.dados_anteriores || null,
        dados_novos: data.dados_novos || null,
        ip: data.ip || null,
        user_agent: data.user_agent || null,
        descricao: data.descricao || null,
      });

      return log;
    } catch (error) {
      console.error('[AUDIT] Erro ao criar log:', error);
      // Não lançar erro para não quebrar a operação principal
      throw error;
    }
  }

  /**
   * Lista logs com filtros e paginação
   */
  async listLogs(filters: AuditLogFilters): Promise<PaginatedResponse<AuditLog>> {
    const { page, limit } = normalizePagination({
      page: filters.page,
      limit: filters.limit,
    });

    const where: any = {};

    // Filtros
    if (filters.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    if (filters.acao) {
      where.acao = filters.acao;
    }

    if (filters.entidade) {
      where.entidade = filters.entidade;
    }

    if (filters.entidade_id) {
      where.entidade_id = filters.entidade_id;
    }

    if (filters.data_inicio && filters.data_fim) {
      where.createdAt = {
        [Op.between]: [filters.data_inicio, filters.data_fim],
      };
    } else if (filters.data_inicio) {
      where.createdAt = {
        [Op.gte]: filters.data_inicio,
      };
    } else if (filters.data_fim) {
      where.createdAt = {
        [Op.lte]: filters.data_fim,
      };
    }

    // Buscar total
    const total = await AuditLog.count({ where });

    // Buscar registros
    const logs = await AuditLog.findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']], // Mais recentes primeiro
    });

    return {
      data: logs,
      pagination: createPagination(page, limit, total),
    };
  }

  /**
   * Busca logs por entidade específica
   */
  async getLogsByEntity(
    entidade: string,
    entidade_id: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return this.listLogs({
      entidade,
      entidade_id,
      page,
      limit,
    });
  }

  /**
   * Busca logs por usuário
   */
  async getLogsByUser(
    usuario_id: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return this.listLogs({
      usuario_id,
      page,
      limit,
    });
  }

  /**
   * Busca um log específico por ID
   */
  async getLogById(id: number): Promise<AuditLog | null> {
    return await AuditLog.findByPk(id);
  }

  /**
   * Estatísticas de auditoria
   */
  async getStats(filters?: { data_inicio?: string; data_fim?: string }) {
    const where: any = {};

    if (filters?.data_inicio && filters?.data_fim) {
      where.createdAt = {
        [Op.between]: [filters.data_inicio, filters.data_fim],
      };
    }

    const total = await AuditLog.count({ where });

    const porAcao = await AuditLog.findAll({
      where,
      attributes: [
        'acao',
        [AuditLog.sequelize!.fn('COUNT', AuditLog.sequelize!.col('id')), 'total'],
      ],
      group: ['acao'],
      raw: true,
    });

    const porEntidade = await AuditLog.findAll({
      where,
      attributes: [
        'entidade',
        [AuditLog.sequelize!.fn('COUNT', AuditLog.sequelize!.col('id')), 'total'],
      ],
      group: ['entidade'],
      order: [[AuditLog.sequelize!.fn('COUNT', AuditLog.sequelize!.col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    return {
      total,
      por_acao: porAcao,
      por_entidade: porEntidade,
    };
  }

  /**
   * Helper para extrair IP da requisição
   */
  getIpFromRequest(req: any): string {
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Helper para extrair User Agent da requisição
   */
  getUserAgentFromRequest(req: any): string {
    return req.headers['user-agent'] || 'unknown';
  }
}

export default new AuditLogService();
