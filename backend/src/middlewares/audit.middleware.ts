import type { Request, Response, NextFunction } from 'express';
import auditLogService from '../modules/audit/audit-log.service.js';

/**
 * Middleware para registrar ações no log de auditoria
 * Captura CREATE, UPDATE e DELETE automaticamente
 */
export function auditMiddleware(options: {
  entidade: string;
  getEntityId?: (req: Request) => number | undefined;
  getOldData?: (req: Request) => Promise<object | undefined>;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { entidade, getEntityId, getOldData } = options;

    // Captura a resposta original para detectar status de sucesso
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    let responseData: any;
    let alreadyLogged = false;

    // Intercepta res.json
    res.json = function (data: any) {
      responseData = data;
      return originalJson(data);
    };

    // Intercepta res.send
    res.send = function (data: any) {
      if (!responseData) {
        try {
          responseData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch {
          responseData = data;
        }
      }
      return originalSend(data);
    };

    // Hook no evento 'finish' do response
    res.on('finish', async () => {
      // Evita log duplicado
      if (alreadyLogged) return;
      alreadyLogged = true;

      // Só registra se foi sucesso (2xx)
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return;
      }

      // Detecta a ação baseada no método HTTP
      let acao: 'CREATE' | 'UPDATE' | 'DELETE' | undefined;
      if (req.method === 'POST') acao = 'CREATE';
      else if (req.method === 'PUT' || req.method === 'PATCH') acao = 'UPDATE';
      else if (req.method === 'DELETE') acao = 'DELETE';

      // Só registra CREATE, UPDATE, DELETE
      if (!acao) return;

      try {
        const usuario_id = req.user?.id ? Number(req.user.id) : undefined;
        const entidade_id = getEntityId ? getEntityId(req) : undefined;
        const ip = auditLogService.getIpFromRequest(req);
        const user_agent = auditLogService.getUserAgentFromRequest(req);

        let dados_anteriores: object | undefined;
        if (acao === 'UPDATE' || acao === 'DELETE') {
          if (getOldData) {
            dados_anteriores = await getOldData(req);
          }
        }

        let dados_novos: object | undefined;
        if (acao === 'CREATE' || acao === 'UPDATE') {
          // Usa body como novos dados
          dados_novos = req.body;
        }

        await auditLogService.createLog({
          usuario_id,
          acao,
          entidade,
          entidade_id,
          dados_anteriores,
          dados_novos,
          ip,
          user_agent,
        });
      } catch (error) {
        // Não quebra a requisição se houver erro no log
        console.error('[AUDIT] Erro ao registrar log:', error);
      }
    });

    next();
  };
}

/**
 * Middleware simples para registrar ações de login
 */
export async function auditLogin(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    // Registra apenas se o login foi bem-sucedido (tem token)
    if (res.statusCode === 200 && data?.token) {
      const usuario_id = data.user?.id ? Number(data.user.id) : undefined;
      const ip = auditLogService.getIpFromRequest(req);
      const user_agent = auditLogService.getUserAgentFromRequest(req);

      auditLogService
        .createLog({
          usuario_id,
          acao: 'LOGIN',
          entidade: 'auth',
          ip,
          user_agent,
          descricao: `Login realizado com sucesso: ${req.body.email || 'email desconhecido'}`,
        })
        .catch((error) => {
          console.error('[AUDIT] Erro ao registrar login:', error);
        });
    }

    return originalJson(data);
  };

  next();
}

/**
 * Middleware para registrar logout
 */
export async function auditLogout(req: Request, _res: Response, next: NextFunction) {
  try {
    const usuario_id = req.user?.id ? Number(req.user.id) : undefined;
    const ip = auditLogService.getIpFromRequest(req);
    const user_agent = auditLogService.getUserAgentFromRequest(req);

    await auditLogService.createLog({
      usuario_id,
      acao: 'LOGOUT',
      entidade: 'auth',
      ip,
      user_agent,
      descricao: 'Logout realizado',
    });
  } catch (error) {
    console.error('[AUDIT] Erro ao registrar logout:', error);
  }

  next();
}
