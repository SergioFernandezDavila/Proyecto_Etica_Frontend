export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: ApiError[] | null;
  meta: Meta;
}

export interface ApiError {
  field?: string;
  message: string;
  code: string;
}

export interface Meta {
  timestamp: string;
  version: string;
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: Meta;
}
