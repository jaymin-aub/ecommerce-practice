import type { PaginationMeta } from "@shared";

export type { PaginationMeta };

export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
  readonly skip: number;
}

export interface PaginatedData<T> {
  readonly items: readonly T[];
  readonly pagination: PaginationMeta;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const parsePagination = (
  query: { readonly page?: unknown; readonly limit?: unknown },
  defaultLimit: number = DEFAULT_LIMIT,
  maxLimit: number = MAX_LIMIT,
): PaginationParams => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const rawLimit = Number(query.limit) || defaultLimit;
  const limit = Math.max(1, Math.min(rawLimit, maxLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
