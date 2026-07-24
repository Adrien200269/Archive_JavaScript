import dotenv from "dotenv";
dotenv.config();

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../../app";
import { User } from "../../models/user.model";
import { Product } from "../../models/product.model";

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await seedData();

  app.listen(PORT, () => {
    console.log(`E2E test server running on http://localhost:${PORT}`);
  });

  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    process.exit(0);
  });
}

async function seedData() {
  const adminExists = await User.findOne({ email: "admin@test.com" });
  if (!adminExists) {
    await User.create({
      fullName: "Admin User",
      email: "admin@test.com",
      password: "admin123",
      role: "admin",
    });
  }

  const userExists = await User.findOne({ email: "user@test.com" });
  if (!userExists) {
    await User.create({
      fullName: "Test User",
      email: "user@test.com",
      password: "user1234",
      role: "user",
    });
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.create([
      { name: "Classic Leather Jacket", price: 12999, imageUrl: "/uploads/leather.jpg", isFavourite: false },
      { name: "Denim Jacket", price: 5999, imageUrl: "/uploads/denim.jpg", isFavourite: true },
      { name: "Cotton T-Shirt", price: 1999, imageUrl: "/uploads/tshirt.jpg", isFavourite: false },
      { name: "Wool Scarf", price: 2499, imageUrl: "/uploads/scarf.jpg", isFavourite: false },
      { name: "Canvas Sneakers", price: 4499, imageUrl: "/uploads/sneakers.jpg", isFavourite: true },
      { name: "Aviator Sunglasses", price: 3499, imageUrl: "/uploads/sunglasses.jpg", isFavourite: false },
    ]);
  }
}

start();
