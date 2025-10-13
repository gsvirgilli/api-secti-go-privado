import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

type JwtPayload = {
  sub: string; // user id
  [key: string]: unknown;
};

export function signJwt(payload: Omit<JwtPayload, 'sub'> & { sub: string }, options?: jwt.SignOptions) {
  const secret = env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET não está definido');
  }
  if (!payload.sub) {
    throw new Error('payload.sub é obrigatório');
  }
  
  const finalOptions: jwt.SignOptions = { 
    expiresIn: '1d',
    ...(options || {})
  };
  
  return jwt.sign(payload, secret, finalOptions);
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está definido');
  }
  return jwt.verify(token, secret) as T;
}

export function decodeJwt<T extends object = JwtPayload>(token: string): T | null {
  const decoded = jwt.decode(token);
  return (decoded as T) ?? null;
}


