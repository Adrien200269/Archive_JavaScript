import request from "supertest";
import path from "path";
import fs from "fs";
import app from "../../app";
import { connectTestDB, disconnectTestDB, clearCollections } from "../helpers/test-db";
import { User } from "../../models/user.model";
import { Product } from "../../models/product.model";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const uploadsDir = path.join(process.cwd(), "uploads");

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  process.env.JWT_EXPIRES_IN = "7d";
  process.env.NODE_ENV = "test";
  await connectTestDB();
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
});

afterEach(async () => {
  await clearCollections();
  if (fs.existsSync(uploadsDir)) {
    fs.rmSync(uploadsDir, { recursive: true, force: true });
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
});

afterAll(async () => {
  await disconnectTestDB();
  if (fs.existsSync(uploadsDir)) {
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  }
});

const login = async (role: "admin" | "user" = "user") => {
  await User.create({
    fullName: "Test User",
    email: "test@example.com",
    password: "password123",
    role,
  });

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "test@example.com", password: "password123" });

  return res.body.data.token;
};

describe("authenticate middleware execution output", () => {
  describe("GET /api/v1/auth/whoami", () => {
    it("should return 401 when no token is provided", async () => {
      const res = await request(app).get("/api/v1/auth/whoami");

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Not authenticated",
      });
    });

    it("should return 401 when an invalid token is provided", async () => {
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Invalid or expired token",
      });
    });

    it("should return 401 when a tampered token is provided", async () => {
      const token = jwt.sign({ id: new Types.ObjectId().toString(), role: "user", email: "test@test.com" }, "wrong-secret");
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Invalid or expired token",
      });
    });

    it("should return 401 with Authorization header missing Bearer prefix", async () => {
      const token = await login("user");
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", `Token ${token}`);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Not authenticated",
      });
    });

    it("should return 200 when a valid Bearer token is provided", async () => {
      const token = await login("user");
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("test@example.com");
    });

    it("should return 200 when a valid cookie token is provided", async () => {
      const token = await login("user");
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("test@example.com");
    });

    it("should return 404 when token is valid but user no longer exists", async () => {
      const id = new Types.ObjectId();
      const token = jwt.sign({ id: id.toString(), role: "user", email: "ghost@test.com" }, process.env.JWT_SECRET!, { expiresIn: "7d" });
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: "User not found",
      });
    });
  });

  describe("authenticate attaches user context to request", () => {
    it("should set userId, userRole, and userEmail when authenticated", async () => {
      const token = await login("admin");

      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("role", "admin");
      expect(res.body.data).toHaveProperty("email", "test@example.com");
    });
  });
});

describe("requireAdmin middleware execution output", () => {
  describe("POST /api/v1/products", () => {
    it("should return 403 when a non-admin user tries to create a product", async () => {
      const token = await login("user");
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "Test Product")
        .field("price", "100")
        .field("image", "");

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        success: false,
        message: "Forbidden: admin access required",
      });
    });

    it("should allow admin to proceed past requireAdmin middleware", async () => {
      const token = await login("admin");
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "Test Product")
        .field("price", "100")
        .field("image", "");

      expect(res.status).not.toBe(403);
    });
  });

  describe("GET /api/v1/admin/users", () => {
    it("should return 403 when a non-admin user tries to access admin route", async () => {
      const token = await login("user");
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        success: false,
        message: "Forbidden: admin access required",
      });
    });

    it("should return 200 when admin accesses admin route", async () => {
      const token = await login("admin");
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe("upload middleware execution output", () => {
  it("should reject non-image file types", async () => {
    const token = await login("admin");

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test Product")
      .field("price", "100")
      .attach("image", Buffer.from("fake text content"), "test.txt");

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Only JPEG, PNG, WEBP, and GIF images are allowed/i);
  });

  it("should reject files larger than 5MB", async () => {
    const token = await login("admin");
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test Product")
      .field("price", "100")
      .attach("image", largeBuffer, "large.jpg");

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/File too large/i);
  });

  it("should accept valid image files", async () => {
    const token = await login("admin");
    const fakeImage = Buffer.from("fake-image-data");

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test Product")
      .field("price", "100")
      .attach("image", fakeImage, "test.jpg");

    expect(res.status).not.toBe(500);
  });
});

describe("errorHandler middleware execution output", () => {
  it("should catch errors thrown by async route handlers and return 500 JSON", async () => {
    const spy = jest.spyOn(Product.prototype, "save").mockRejectedValueOnce(new Error("Database connection failed"));

    const token = await login("admin");
    const fakeImage = Buffer.from("fake-image-data");

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test Product")
      .field("price", "100")
      .attach("image", fakeImage, "test.jpg");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: "Database connection failed",
    });

    spy.mockRestore();
  });

  it("should use default message when error has no message", async () => {
    const spy = jest.spyOn(Product.prototype, "save").mockRejectedValueOnce({});

    const token = await login("admin");
    const fakeImage = Buffer.from("fake-image-data");

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test Product")
      .field("price", "100")
      .attach("image", fakeImage, "test.jpg");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: "Something went wrong",
    });

    spy.mockRestore();
  });
});
