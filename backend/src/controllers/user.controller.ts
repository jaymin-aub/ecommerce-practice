import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import { BadRequestError, NotFoundError } from "../utils/errors.ts";

// READ GET /users
export const listUsers = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  });
};

// READ GET /users/:id
export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid user ID");
  }

  const user = await User.findOne({ id, isDeleted: false }).lean();

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
};

// UPDATE PATCH /users/:id --> merge
export const patchUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid user ID");
  }

  const user = await User.findOneAndUpdate(
    { id, isDeleted: false },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
};

// DELETE DELETE /users/:id --> soft delete
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("Invalid user ID");
  }

  const user = await User.findOneAndUpdate(
    { id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true },
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
};
