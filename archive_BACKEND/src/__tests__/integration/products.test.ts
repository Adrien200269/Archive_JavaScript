import request from "supertest";
import app from "../../app";
import { connectTestDB, disconnectTestDB, clearCollections } from "../helpers/test-db";
import { User } from "../../models/user.model";
import { Product } from "../../models/product.model";

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  process.env.JWT_EXPIRES_IN = "7d";
  process.env.NODE_ENV = "test";
  await connectTestDB();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

const seedAdmin = async (): Promise<string> => {
  await User.create({
    fullName: "Admin User",
    email: "admin@example.com",
    password: "adminpass123",
    role: "admin",
  });

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@example.com", password: "adminpass123" });

  return res.body.data.token;
};

const seedUser = async (): Promise<string> => {
  await User.create({
    fullName: "Normal User",
    email: "user@example.com",
    password: "userpass123",
    role: "user",
  });

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "user@example.com", password: "userpass123" });

  return res.body.data.token;
};

describe("GET /api/v1/products", () => {
  it("should return an empty list when no products exist", async () => {
    const res = await request(app).get("/api/v1/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("should return all products sorted newest first", async () => {
    await Product.create({ name: "Old Product", price: 10, imageUrl: "/uploads/old.jpg" });
    await new Promise((r) => setTimeout(r, 10));
    await Product.create({ name: "New Product", price: 20, imageUrl: "/uploads/new.jpg" });

    const res = await request(app).get("/api/v1/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].name).toBe("New Product");
    expect(res.body.data[1].name).toBe("Old Product");
  });
});

describe("POST /api/v1/products", () => {
  beforeEach(async () => {
    adminToken = await seedAdmin();
    userToken = await seedUser();
  });

  it("should create a product when admin is authenticated", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Test Product")
      .field("price", "29.99")
      .attach("image", Buffer.from("fake-image-content"), {
        filename: "test.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Product");
    expect(res.body.data.price).toBe(29.99);
    expect(res.body.data.imageUrl).toContain("/uploads/");
  });

  it("should return 403 when a non-admin user tries to create a product", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${userToken}`)
      .field("name", "Test Product")
      .field("price", "29.99")
      .attach("image", Buffer.from("fake-image-content"), {
        filename: "test.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(403);
  });

  it("should return 401 when not authenticated", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "Test Product")
      .field("price", "29.99");

    expect(res.status).toBe(401);
  });

  it("should return 400 when name and price are missing", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("image", Buffer.from("fake-image-content"), {
        filename: "test.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name and price are required");
  });

  it("should return 400 when image is missing", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Test Product")
      .field("price", "29.99");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Product image is required");
  });

  it("should return 400 when price is not a number", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Test Product")
      .field("price", "not-a-number")
      .attach("image", Buffer.from("fake-image-content"), {
        filename: "test.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Price must be a valid number");
  });
});

describe("PUT /api/v1/products/:id", () => {
  let productId: string;

  beforeEach(async () => {
    adminToken = await seedAdmin();
    userToken = await seedUser();

    const product = await Product.create({
      name: "Original Product",
      price: 10,
      imageUrl: "/uploads/original.jpg",
    });
    productId = product._id.toString();
  });

  it("should update a product when admin is authenticated", async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Updated Product")
      .field("price", "49.99");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Product");
    expect(res.body.data.price).toBe(49.99);
  });

  it("should return 403 when a non-admin user tries to update", async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .field("name", "Hacked Product");

    expect(res.status).toBe(403);
  });

  it("should return 404 when product does not exist", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .put(`/api/v1/products/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Ghost Product");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should return 400 when price is not a number", async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("price", "not-a-number");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Price must be a valid number");
  });
});

describe("DELETE /api/v1/products/:id", () => {
  let productId: string;

  beforeEach(async () => {
    adminToken = await seedAdmin();
    userToken = await seedUser();

    const product = await Product.create({
      name: "Product to Delete",
      price: 15,
      imageUrl: "/uploads/delete-me.jpg",
    });
    productId = product._id.toString();
  });

  it("should delete a product when admin is authenticated", async () => {
    const res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Product deleted successfully");

    const deleted = await Product.findById(productId);
    expect(deleted).toBeNull();
  });

  it("should return 403 when a non-admin user tries to delete", async () => {
    const res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("should return 404 when product does not exist", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .delete(`/api/v1/products/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/v1/products/:id/favorite", () => {
  let productId: string;

  beforeEach(async () => {
    const product = await Product.create({
      name: "Toggle Favorite Product",
      price: 25,
      imageUrl: "/uploads/toggle.jpg",
      isFavourite: false,
    });
    productId = product._id.toString();
  });

  it("should toggle isFavourite from false to true", async () => {
    const res = await request(app).patch(`/api/v1/products/${productId}/favorite`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isFavourite).toBe(true);
  });

  it("should toggle isFavourite from true to false", async () => {
    await Product.findByIdAndUpdate(productId, { isFavourite: true });

    const res = await request(app).patch(`/api/v1/products/${productId}/favorite`);

    expect(res.status).toBe(200);
    expect(res.body.data.isFavourite).toBe(false);
  });

  it("should return 404 when product does not exist", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app).patch(`/api/v1/products/${fakeId}/favorite`);

    expect(res.status).toBe(404);
  });
});
