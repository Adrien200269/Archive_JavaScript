import mongoose from "mongoose";
import { connectDB } from "../../../config/db";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  jest.restoreAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe("connectDB", () => {
  it("should log success message when mongoose connects", async () => {
    process.env.MONGO_URI = "mongodb://localhost:27017/test";
    jest.spyOn(mongoose, "connect").mockResolvedValueOnce(mongoose as any);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);

    await connectDB();

    expect(logSpy).toHaveBeenCalledWith("\u2705 MongoDB connected");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("should log error and exit when mongoose connection fails", async () => {
    process.env.MONGO_URI = "mongodb://localhost:27017/test";
    const error = new Error("connection refused");
    jest.spyOn(mongoose, "connect").mockRejectedValueOnce(error);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);

    await connectDB();

    expect(errorSpy).toHaveBeenCalledWith("\u274C MongoDB connection error:", error);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should throw when MONGO_URI is not defined", async () => {
    delete process.env.MONGO_URI;
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);

    await expect(connectDB()).rejects.toThrow("MONGO_URI is not defined in environment variables");
    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
