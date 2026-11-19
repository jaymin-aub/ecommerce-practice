import express from "express";
import { signUp, login } from "../controllers/auth.controller.ts";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
