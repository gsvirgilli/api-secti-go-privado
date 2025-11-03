/**
 * Interface para parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Calcula offset baseado em page e limit
 */
export const calculateOffset = (page: number = 1, limit: number = 10): number => {
  return (page - 1) * limit;
};

/**
 * Cria objeto de paginação para resposta
 */
export const createPagination = (
  page: number,
  limit: number,
  total: number
): PaginatedResponse<any>['pagination'] => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Valores padrão de paginação
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Valida e normaliza parâmetros de paginação
 */
export const normalizePagination = (params: PaginationParams) => {
  let page = params.page || DEFAULT_PAGE;
  let limit = params.limit || DEFAULT_LIMIT;

  // Garantir valores mínimos
  page = Math.max(1, page);
  limit = Math.max(1, Math.min(limit, MAX_LIMIT));

  return { page, limit };
};
