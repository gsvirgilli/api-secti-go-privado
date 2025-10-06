import * as jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

type JwtPayload = {
  sub: string; // user id
  [key: string]: unknown;
};

export function signJwt(payload: Omit<JwtPayload, 'sub'> & { sub: string }, options?: jwt.SignOptions) {
  const secret: jwt.Secret = env.JWT_SECRET as unknown as jwt.Secret;
  const finalOptions = { ...(options as any) };
  if (finalOptions.expiresIn === undefined) {
    finalOptions.expiresIn = env.JWT_EXPIRES_IN;
  }
  return jwt.sign(payload, secret, finalOptions as jwt.SignOptions);
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
  const secret: jwt.Secret = env.JWT_SECRET as unknown as jwt.Secret;
  return jwt.verify(token, secret) as T;
}

export function decodeJwt<T extends object = JwtPayload>(token: string): T | null {
  const decoded = jwt.decode(token);
  return (decoded as T) ?? null;
}


