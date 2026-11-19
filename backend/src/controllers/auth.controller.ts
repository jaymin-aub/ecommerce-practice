import type { Request, Response } from "express";
import { authService } from "../services/auth.service.ts";
import { BadRequestError } from "../utils/errors.ts";

// POST /auth/signup
export const signUp = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const { token, user } = await authService.signUp(req.body);

  return res.status(201).json({
    success: true,
    message: "Signup Successful",
    token,
    data: user,
  });
};

// POST /auth/login
export const login = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    throw new BadRequestError("Email/username and password are required");
  }

  const { token, user } = await authService.login({
    email,
    username,
    password,
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    data: user,
  });
};
