import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

/**
 * Starts an in-memory MongoDB instance and connects Mongoose to it.
 * Call this in Jest's `beforeAll` hook for integration tests.
 */
export const connectTestDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

/**
 * Disconnects Mongoose and stops the in-memory MongoDB server.
 * Call this in Jest's `afterAll` hook to clean up after all tests.
 */
export const disconnectTestDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Wipes all documents from every collection in the test database.
 * Call this in Jest's `afterEach` hook to ensure test isolation.
 */
export const clearCollections = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
