import type { Request, Response } from "express";
import { productService } from "../services/product.service.ts";
import { parsePagination } from "../utils/pagination.ts";
import { BadRequestError } from "../utils/errors.ts";

const getProductId = (req: Request): number => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid product ID");
  }
  return id;
};

// READ GET /products
export const listProducts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const paginationParams = parsePagination(req.query);
  const { products, pagination } =
    await productService.listProducts(paginationParams);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    pagination,
    data: products,
  });
};

// CREATE POST /products
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const product = await productService.createProduct(req.body);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

// READ GET /products/:id
export const getProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = getProductId(req);
  const product = await productService.getProductById(id);

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
};

// UPDATE PUT /products/:id --> overwrite
export const replaceProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = getProductId(req);
  const product = await productService.replaceProduct(id, req.body);

  return res.status(200).json({
    success: true,
    message: "Product replaced successfully",
    data: product,
  });
};

// UPDATE PATCH /products/:id --> merge
export const patchProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = getProductId(req);
  const product = await productService.updateProduct(id, req.body);

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

// DELETE DELETE /products/:id
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = getProductId(req);
  const deletedProduct = await productService.deleteProduct(id);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
};
