import express from "express";
import cors from "cors";

process.loadEnvFile();
const app = express();

import { authRouter } from "./src/routes/auth.routes.ts";
import { productRouter } from "./src/routes/product.routes.ts";
import { userRouter } from "./src/routes/user.routes.ts";
import connectDB from "./src/config/database.ts";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.ts";
import { NotFoundError } from "./src/utils/errors.ts";

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:4200", "http://127.0.0.1:4200"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error-handling middleware
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOSTNAME ?? "localhost";

const startServer = async () => {
  await connectDB();

  app.listen(port, hostname, () => {
    console.log(`Listening on http://${hostname}:${port}`);
  });
};

startServer();
