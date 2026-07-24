import request from "supertest";
import app from "../../app";
import { connectTestDB, disconnectTestDB, clearCollections } from "../helpers/test-db";
import { User } from "../../models/user.model";
import * as emailService from "../../services/email.service";

jest.mock("../../services/email.service");

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  process.env.JWT_EXPIRES_IN = "7d";
  process.env.NODE_ENV = "test";
  await connectTestDB();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

const registerPayload = {
  fullName: "Test User",
  email: "test@example.com",
  password: "password123",
};

const seedUser = async () => {
  await User.create({
    fullName: "Test User",
    email: "test@example.com",
    password: "password123",
  });
};

describe("POST /api/v1/auth/register", () => {
  it("should register a new user and return 201", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(registerPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Account created successfully");
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.fullName).toBe("Test User");
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("should return 409 when email already exists", async () => {
    await User.create(registerPayload);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(registerPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("An account with this email already exists");
  });

  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ fullName: "A", email: "bad", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(async () => {
    await seedUser();
  });

  it("should login successfully and return a token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("test@example.com");
  });

  it("should set the token as an httpOnly cookie", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toContain("token=");
    expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
  });

  it("should return 401 for invalid password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nonexistent@example.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "bad", password: "" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/v1/auth/logout", () => {
  it("should clear the cookie and return 200", async () => {
    const res = await request(app).post("/api/v1/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Logged out");

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("token=;");
  });
});

describe("GET /api/v1/auth/whoami", () => {
  it("should return the current user when authenticated", async () => {
    await seedUser();

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get("/api/v1/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("should return 401 without a token", async () => {
    const res = await request(app).get("/api/v1/auth/whoami");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Not authenticated");
  });

  it("should return 401 with an invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/whoami")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("should return 401 with a tampered token", async () => {
    await seedUser();

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const token = loginRes.body.data.token;

    const tamperedRes = await request(app)
      .get("/api/v1/auth/whoami")
      .set("Authorization", `Bearer ${token}x`);

    expect(tamperedRes.status).toBe(401);
  });

  it("should return 404 when user does not exist in DB", async () => {
    const jwt = require("jsonwebtoken");
    const mongoose = require("mongoose");
    const token = jwt.sign(
      { id: new mongoose.Types.ObjectId(), email: "ghost@example.com", role: "user" },
      "test-secret-key",
      { expiresIn: "7d" }
    );

    const res = await request(app)
      .get("/api/v1/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});

describe("POST /api/v1/auth/forgot-password", () => {
  it("should return 200 even when email does not exist (security)", async () => {
    (emailService.sendResetCodeEmail as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "nonexistent@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      "If that email is registered, a reset code has been sent."
    );
  });

  it("should return 200 for a registered email", async () => {
    (emailService.sendResetCodeEmail as jest.Mock).mockResolvedValue(undefined);
    await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should set a reset code on the user", async () => {
    (emailService.sendResetCodeEmail as jest.Mock).mockResolvedValue(undefined);
    const user = await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@example.com" });

    const updated = await User.findById(user._id);
    expect(updated!.resetPasswordCode).toBeDefined();
    expect(updated!.resetPasswordCode).toHaveLength(6);
    expect(updated!.resetPasswordExpires).toBeDefined();
  });

  it("should return 400 for invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "bad-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/v1/auth/reset-password", () => {
  it("should reset the password with a valid code", async () => {
    const user = await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      resetPasswordCode: "123456",
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: "test@example.com", code: "123456", password: "newpassword456" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password has been reset successfully.");

    const updated = await User.findById(user._id).select("+password");
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare("newpassword456", updated!.password);
    expect(isMatch).toBe(true);
    expect(updated!.resetPasswordCode).toBeUndefined();
  });

  it("should return 400 with an invalid code", async () => {
    await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      resetPasswordCode: "123456",
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: "test@example.com", code: "000000", password: "newpassword456" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid or expired reset code");
  });

  it("should return 400 with an expired code", async () => {
    await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      resetPasswordCode: "123456",
      resetPasswordExpires: new Date(Date.now() - 60 * 1000),
    });

    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: "test@example.com", code: "123456", password: "newpassword456" });

    expect(res.status).toBe(400);
  });

  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ email: "bad", code: "abc", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
