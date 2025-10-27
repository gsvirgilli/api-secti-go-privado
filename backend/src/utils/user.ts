import type { AuthUser } from '../types/dtos/auth.dto.js';

/**
 * Converte o ID do usuário de string para number
 * @param user - Usuário autenticado
 * @returns ID numérico do usuário
 * @throws Error se o ID não for válido
 */
export function getUserIdNumber(user?: AuthUser): number {
  if (!user || !user.id) {
    throw new Error('Usuário não autenticado ou ID inválido');
  }

  const id = parseInt(user.id, 10);
  
  if (isNaN(id)) {
    throw new Error(`ID de usuário inválido: ${user.id}`);
  }

  return id;
}

/**
 * Verifica se o usuário tem uma role específica
 * @param user - Usuário autenticado
 * @param role - Role a verificar
 * @returns true se o usuário tem a role
 */
export function hasRole(user?: AuthUser, role?: string): boolean {
  if (!user || !user.role) {
    return false;
  }
  return user.role === role;
}

/**
 * Verifica se o usuário é admin
 * @param user - Usuário autenticado
 * @returns true se o usuário é admin
 */
export function isAdmin(user?: AuthUser): boolean {
  return hasRole(user, 'ADMIN');
}

/**
 * Verifica se o usuário é instrutor
 * @param user - Usuário autenticado
 * @returns true se o usuário é instrutor
 */
export function isInstructor(user?: AuthUser): boolean {
  return hasRole(user, 'INSTRUTOR');
}