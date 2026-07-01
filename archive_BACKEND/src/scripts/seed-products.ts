import mongoose from "mongoose";
import { Product } from "../models/product.model";
import dotenv from "dotenv";
import path from "path";

// Load dotenv from backend directory
dotenv.config({ path: path.join(process.cwd(), ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/archive-outfitters";

async function seed() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB at:", MONGO_URI);

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert standard products
    const products = [
      {
        name: "Summer Tees",
        price: 1650,
        imageUrl: "/uploads/summer_tees.jpg",
        isFavourite: true,
      },
      {
        name: "Zip Up Hoodie",
        price: 1600,
        imageUrl: "/uploads/zip_up_hoodie.jpg",
        isFavourite: false,
      },
      {
        name: "Portugal Away Kit WC26",
        price: 2000,
        imageUrl: "/uploads/portugal_away_kit.jpg",
        isFavourite: false,
      },
    ];

    await Product.insertMany(products);
    console.log("Products seeded successfully!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exit(1);
  }
}

seed();
