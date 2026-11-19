import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { HydratedDocument } from "mongoose";
import User from "../models/user.model.ts";
import type { UserType } from "../types/user.type.ts";
import { BadRequestError, UnauthorizedError } from "../utils/errors.ts";

export type SanitizedUser = Omit<UserType, "password">;

export interface AuthResult {
  readonly token: string;
  readonly user: SanitizedUser;
}

export interface SignupDto extends Partial<UserType> {
  readonly email: string;
  readonly password: string;
  readonly username?: string;
}

export interface LoginDto {
  readonly email?: string;
  readonly username?: string;
  readonly password: string;
}

export class AuthService {
  private readonly saltRounds = 10;
  private readonly tokenExpiration = "2h";

  private generateToken(payload: {
    readonly id: number;
    readonly email: string;
    readonly username: string;
  }): string {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET environment variable is not configured");
    }

    return jwt.sign(payload, secretKey, { expiresIn: this.tokenExpiration });
  }

  private sanitizeUser(userDoc: HydratedDocument<UserType>): SanitizedUser {
    const userData = userDoc.toObject();
    delete (userData as { password?: string }).password;
    return userData as SanitizedUser;
  }

  async signUp(dto: SignupDto): Promise<AuthResult> {
    const email = dto.email.trim().toLowerCase();
    const username = dto.username?.trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, ...(username ? [{ username }] : [])],
    }).lean<UserType>();

    if (existingUser) {
      const isEmailTaken = existingUser.email === email;
      throw new BadRequestError(
        isEmailTaken ? "Email already in use" : "Username already in use",
      );
    }

    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);

    // Auto-generate numeric ID if not provided (required by schema)
    let userId = dto.id;
    if (!userId) {
      const lastUser = await User.findOne()
        .sort({ id: -1 })
        .select("id")
        .lean<{ id: number }>();
      userId = lastUser?.id ? lastUser.id + 1 : 1;
    }

    const token = this.generateToken({
      id: userId,
      email,
      username: username ?? "",
    });

    const newUser = new User({
      ...dto,
      id: userId,
      email,
      password: hashedPassword,
      token,
    });

    const savedUser = await newUser.save();

    return {
      token,
      user: this.sanitizeUser(savedUser),
    };
  }

  async login(credentials: LoginDto): Promise<AuthResult> {
    const identifier = credentials.email || credentials.username;
    if (!identifier) {
      throw new BadRequestError("Email or username is required");
    }

    const trimmedIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { email: trimmedIdentifier.toLowerCase() },
        { username: trimmedIdentifier },
      ],
      isDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    user.token = token;
    await user.save();

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }
}

export const authService = new AuthService();
