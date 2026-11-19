import express from "express";
import {
  listUsers,
  getUser,
  patchUser,
  deleteUser,
} from "../controllers/user.controller.ts";

export const userRouter = express.Router();

userRouter
  .get("/", listUsers)
  .get("/:id", getUser)
  .patch("/:id", patchUser)
  .delete("/:id", deleteUser);
