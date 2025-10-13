import type { 
  ServiceResponse, 
  ServicePaginatedResponse, 
  CreateResult, 
  UpdateResult, 
  DeleteResult, 
  FindResult, 
  FindAllResult 
} from '../api/response.types.js';

// Base service interface
export interface BaseService<T, CreateData, UpdateData> {
  create(data: CreateData): Promise<CreateResult<T>>;
  findById(id: number): Promise<FindResult<T>>;
  findAll(params?: any): Promise<FindAllResult<T>>;
  update(id: number, data: UpdateData): Promise<UpdateResult<T>>;
  delete(id: number): Promise<DeleteResult>;
}

// Paginated service interface
export interface PaginatedService<T, SearchParams> {
  findPaginated(params: SearchParams): Promise<ServicePaginatedResponse<T>>;
}

// Search service interface
export interface SearchService<T, SearchParams> {
  search(params: SearchParams): Promise<ServiceResponse<T[]>>;
}

// Service with relations interface
export interface ServiceWithRelations<T, Relations> {
  findWithRelations(id: number, relations: Relations): Promise<FindResult<T>>;
  findAllWithRelations(params: any, relations: Relations): Promise<FindAllResult<T>>;
}

// Generic service options
export interface ServiceOptions {
  includeDeleted?: boolean;
  includeInactive?: boolean;
  relations?: string[];
}

// Service error types
export interface ServiceError extends Error {
  code: string;
  statusCode: number;
  details?: any;
}

// Service validation error
export interface ValidationError extends ServiceError {
  field: string;
  value: any;
  constraint: string;
}
