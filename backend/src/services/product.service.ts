import type { PaginationMeta, ProductDto } from "@shared";
import Product from "../models/product.model.ts";
import { NotFoundError } from "../utils/errors.ts";
import type { PaginationParams } from "../utils/pagination.ts";
import {
  buildPaginationMeta,
  parsePagination,
} from "../utils/pagination.ts";

export interface PaginatedProducts {
  readonly products: readonly ProductDto[];
  readonly pagination: PaginationMeta;
}

export class ProductService {
  async listProducts(
    params: PaginationParams = parsePagination({}),
  ): Promise<PaginatedProducts> {
    const [products, total] = await Promise.all([
      Product.find().skip(params.skip).limit(params.limit).lean<ProductDto[]>(),
      Product.countDocuments(),
    ]);

    return {
      products,
      pagination: buildPaginationMeta(total, params.page, params.limit),
    };
  }

  async getProductById(id: number): Promise<ProductDto> {
    const product = await Product.findOne({ id }).lean<ProductDto>();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async createProduct(productData: Partial<ProductDto>): Promise<ProductDto> {
    const product = new Product(productData);
    await product.save();
    return product.toObject() as unknown as ProductDto;
  }

  async replaceProduct(
    id: number,
    productData: Partial<ProductDto>,
  ): Promise<ProductDto> {
    const product = await Product.findOneAndReplace(
      { id },
      { ...productData, id },
      {
        new: true,
        runValidators: true,
      },
    ).lean<ProductDto>();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async updateProduct(
    id: number,
    updateData: Partial<ProductDto>,
  ): Promise<ProductDto> {
    const product = await Product.findOneAndUpdate(
      { id },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).lean<ProductDto>();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async deleteProduct(id: number): Promise<ProductDto> {
    const deletedProduct = await Product.findOneAndDelete({
      id,
    }).lean<ProductDto>();

    if (!deletedProduct) {
      throw new NotFoundError("Product not found");
    }

    return deletedProduct;
  }
}

export const productService = new ProductService();
