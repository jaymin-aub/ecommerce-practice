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

// Protect all product routes
productRouter.use(authMiddleware);

productRouter
  .get("/", listProducts)
  .post("/", createProduct)
  .get("/:id", getProduct)
  .put("/:id", replaceProduct)
  .patch("/:id", patchProduct)
  .delete("/:id", deleteProduct);
