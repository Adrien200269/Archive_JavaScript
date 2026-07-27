/**
 * Express Application
 *
 * Configures and assembles the Archive Outfitters API server:
 * - Static file serving for uploaded images
 * - JSON body parsing and cookie parsing
 * - Passport.js initialisation for OAuth strategies
 * - CORS configured for the frontend client URL
 * - API route registration under /api/v1/*
 * - Central error handler (must remain last middleware)
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "./config/passport";
import authRoutes from "./routes/auth.route";
import adminUserRoutes from "./routes/admin/user.route";
import productRoutes from "./routes/product.route";
import orderRoutes from "./routes/order.route";
import adminOrderRoutes from "./routes/admin/order.route";
import adminAnalyticsRoutes from "./routes/admin/analytics.route";
import recommendationRoutes from "./routes/recommendation.route";
import paymentRoutes from "./routes/payment.route";
import chatRoutes from "./routes/chat.route";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, 
  })
);

app.get("/", (_req, res) => res.json({ status: "Archive Outfitters API is running" }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/admin/analytics", adminAnalyticsRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/chat", chatRoutes);


app.use(errorHandler);

export default app;
