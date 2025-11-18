import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod/v4';

export const validateRequest = (schema: z.ZodObject<z.ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
