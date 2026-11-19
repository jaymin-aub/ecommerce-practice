import mongoose from "mongoose";
import { readFile } from "fs/promises";
import bcrypt from "bcrypt";
import Product from "../models/product.model.ts";
import User from "../models/user.model.ts";
import connectDB from "../config/database.ts";

process.loadEnvFile();

const seedDatabase = async () => {
  try {
    await connectDB();

    const rawData = await readFile("src/data/data.json", "utf-8");
    const { products, users } = JSON.parse(rawData);

    console.log("Clearing existing data...");
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log(`Inserting ${products.length} products...`);
    await Product.insertMany(products);

    console.log(`Hashing passwords and inserting ${users.length} users...`);
    const saltRounds = 10;
    const preparedUsers = await Promise.all(
      users.map(async (user: any) => {
        const plainPassword = user.password || "password123";
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return {
          ...user,
          password: hashedPassword,
          token: user.token || "",
        };
      }),
    );
    await User.insertMany(preparedUsers);

    console.log("Database seeded successfully! 🎉");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
