export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export interface ApiResponse<T> {
  readonly success: true;
  readonly message: string;
  readonly data: T;
  readonly pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly message: string;
  readonly errors?: readonly unknown[];
}
