import Product from "../models/product.model.ts";
import type { ProductType } from "../types/product.type.ts";
import { NotFoundError } from "../utils/errors.ts";
import type { PaginationMeta, PaginationParams } from "../utils/pagination.ts";
import {
  buildPaginationMeta,
  parsePagination,
} from "../utils/pagination.ts";

export interface PaginatedProducts {
  readonly products: readonly ProductType[];
  readonly pagination: PaginationMeta;
}

export class ProductService {
  async listProducts(
    params: PaginationParams = parsePagination({}),
  ): Promise<PaginatedProducts> {
    const [products, total] = await Promise.all([
      Product.find().skip(params.skip).limit(params.limit).lean<ProductType[]>(),
      Product.countDocuments(),
    ]);

    return {
      products,
      pagination: buildPaginationMeta(total, params.page, params.limit),
    };
  }

  async getProductById(id: number): Promise<ProductType> {
    const product = await Product.findOne({ id }).lean<ProductType>();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async createProduct(productData: Partial<ProductType>): Promise<ProductType> {
    const product = new Product(productData);
    await product.save();
    return product.toObject() as ProductType;
  }

  async replaceProduct(
    id: number,
    productData: Partial<ProductType>,
  ): Promise<ProductType> {
    const product = await Product.findOneAndReplace(
      { id },
      { ...productData, id },
      {
        new: true,
        runValidators: true,
      },
    ).lean<ProductType>();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async updateProduct(
    id: number,
    updateData: Partial<ProductType>,
  ): Promise<ProductType> {
    const product = await Product.findOneAndUpdate(
      { id },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).lean<ProductType>();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async deleteProduct(id: number): Promise<ProductType> {
    const deletedProduct = await Product.findOneAndDelete({
      id,
    }).lean<ProductType>();

    if (!deletedProduct) {
      throw new NotFoundError("Product not found");
    }

    return deletedProduct;
  }
}

export const productService = new ProductService();
