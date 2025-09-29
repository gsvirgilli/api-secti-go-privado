import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3333),

  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_USER: z.string().default('root'),
  DATABASE_PASSWORD: z.string().default(''),
  DATABASE_NAME: z.string().default('sukatechdb'),
  DATABASE_PORT: z.coerce.number().default(3306),

  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters').default('jwt_secret'),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

export const env = envSchema.parse(process.env);