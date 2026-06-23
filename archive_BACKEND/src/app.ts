import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // allow cookies to be sent cross-origin
  })
);

// Health check
app.get("/", (_req, res) => res.json({ status: "Archive Outfitters API is running" }));

// Routes
app.use("/api/v1/auth", authRoutes);

// Error handler must be last
app.use(errorHandler);

export default app;
