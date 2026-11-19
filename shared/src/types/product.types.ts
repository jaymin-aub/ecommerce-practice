import type { PaginationMeta } from "./api.types.ts";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly discountPercentage?: number;
  readonly rating: number;
  readonly stock: number;
  readonly brand: string;
  readonly category: string;
  readonly thumbnail: string;
  readonly images: readonly string[];
}

export interface PaginatedProductsDto {
  readonly products: readonly ProductDto[];
  readonly pagination: PaginationMeta;
}

export interface ProductQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly category?: string;
  readonly search?: string;
}
