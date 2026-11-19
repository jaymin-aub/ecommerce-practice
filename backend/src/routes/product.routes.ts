import express from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  listProducts,
  createProduct,
  getProduct,
  replaceProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/product.controller.ts";

export const productRouter = express.Router();

// Public routes (catalog browsing)
productRouter.get("/", listProducts);
productRouter.get("/:id", getProduct);

// Protected routes (mutating operations)
productRouter.post("/", authMiddleware, createProduct);
productRouter.put("/:id", authMiddleware, replaceProduct);
productRouter.patch("/:id", authMiddleware, patchProduct);
productRouter.delete("/:id", authMiddleware, deleteProduct);
