import mongoose, { Schema } from "mongoose";
import type { Address, Company, UserModelType } from "../types/user.type.ts";

const addressSchema = new Schema<Address>(
  {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const companySchema = new Schema<Company>(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema<UserModelType>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [
      true,
      "Email ID is required. Please provide a valid email address.",
    ],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Invalid email format. Please provide a valid email address.",
    ],
    lowercase: true,
  },
  password: {
    type: String,
    required: [
      true,
      "Password is required. Please provide your valid password.",
    ],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: addressSchema,
  },
  company: {
    type: companySchema,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  token: String,
});

const User = mongoose.model<UserModelType>("User", userSchema);
export default User;
