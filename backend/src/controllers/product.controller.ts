import type { Request, Response } from "express";
import Product from "../models/product.model.ts";
import { BadRequestError, NotFoundError } from "../utils/errors.ts";

// READ GET /products
export const listProducts = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: products,
  });
};

// CREATE POST /products
export const createProduct = async (req: Request, res: Response) => {
  const product = new Product(req.body);
  await product.save();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

// READ GET /products/:id
export const getProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid product ID");
  }

  const product = await Product.findOne({ id }).lean();

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
};

// UPDATE PUT /products/:id --> overwrite
export const replaceProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid product ID");
  }

  const product = await Product.findOneAndReplace(
    { id },
    { ...req.body, id },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product replaced successfully",
    data: product,
  });
};

// UPDATE PATCH /products/:id --> merge
export const patchProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid product ID");
  }

  const product = await Product.findOneAndUpdate(
    { id },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

// DELETE DELETE /products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid product ID");
  }

  const deletedProduct = await Product.findOneAndDelete({ id });

  if (!deletedProduct) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
};
