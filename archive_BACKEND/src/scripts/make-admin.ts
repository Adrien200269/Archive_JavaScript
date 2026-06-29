/**
 * Admin Seeder Script
 * Run: npx ts-node src/scripts/make-admin.ts <email>
 *
 * Sets role="admin" on the user with the given email address.
 * Usage example:
 *   npx ts-node src/scripts/make-admin.ts john@example.com
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function makeAdmin(email: string) {
  if (!email) {
    console.error("Usage: npx ts-node src/scripts/make-admin.ts <email>");
    process.exit(1);
  }

  if (!MONGO_URI) {
    console.error("MONGO_URI is not set in your .env file");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Update the user directly (bypasses any Mongoose hooks)
  const result = await mongoose.connection
    .collection("users")
    .updateOne(
      { email: email.toLowerCase() },
      { $set: { role: "admin" } }
    );

  if (result.matchedCount === 0) {
    console.error(`No user found with email: ${email}`);
  } else {
    console.log(`✅ User "${email}" is now an admin`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

makeAdmin(process.argv[2]);
