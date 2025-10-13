// Helper para trabalhar com o id do usuário autenticado
export function getUserIdNumber(user?: { id?: string } | null): number {
  if (!user || typeof user.id !== 'string') {
    throw new Error('User id ausente ou inválido');
  }
  const n = Number(user.id);
  if (Number.isNaN(n)) throw new Error('User id não é um número válido');
  return n;
}
