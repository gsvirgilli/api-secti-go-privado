import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

type JwtPayload = {
  sub: string; // user id
  [key: string]: unknown;
};

export function signJwt(payload: Omit<JwtPayload, 'sub'> & { sub: string }, options?: jwt.SignOptions) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    ...options,
  });
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T;
}

export function decodeJwt<T extends object = JwtPayload>(token: string): T | null {
  const decoded = jwt.decode(token);
  return (decoded as T) ?? null;
}


