import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.ts";
import { BadRequestError, UnauthorizedError } from "../utils/errors.ts";

// POST /auth/signup
export const signUp = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, ...(username ? [{ username }] : [])],
  });

  if (existingUser) {
    const isEmailTaken = existingUser.email === email.toLowerCase();
    throw new BadRequestError(
      isEmailTaken ? "Email already in use" : "Username already in use",
    );
  }

  // Hash password asynchronously
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Auto-generate numeric ID if not provided (required by User schema)
  let userId = req.body.id;
  if (!userId) {
    const lastUser = await User.findOne().sort({ id: -1 }).select("id").lean();
    userId = lastUser?.id ? lastUser.id + 1 : 1;
  }

  const secretKey = process.env.JWT_SECRET!;

  // Generate JWT token
  const token = jwt.sign(
    // payload
    { id: userId, email: email, username: username || "" },
    // secret key
    secretKey,
    // headers
    { expiresIn: "2h" },
  );

  // Create new user instance
  const newUser = new User({
    ...req.body,
    id: userId,
    email: email,
    password: hashedPassword,
    token,
  });

  const savedUser = await newUser.save();

  // Exclude password from the response
  const userData = savedUser.toObject();
  delete (userData as { password?: string }).password;

  res.status(201).json({
    success: true,
    message: "Signup Successful",
    token,
    data: userData,
  });
};

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const identifier = email || username;

  if (!identifier || !password) {
    throw new BadRequestError("Email/username and password are required");
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    isDeleted: false,
  });

  // Generic message for security (prevents user enumeration)
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const secretKey = process.env.JWT_SECRET!;

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    secretKey,
    { expiresIn: "2h" },
  );

  // Save the new token in the database
  user.token = token;
  await user.save();

  // Exclude password from the response
  const userData = user.toObject();
  delete (userData as { password?: string }).password;

  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    data: userData,
  });
};
