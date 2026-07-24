import { errorHandler } from "../../../middleware/error.middleware";
import { Request, Response, NextFunction } from "express";

describe("errorHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    jest.restoreAllMocks();
    json = jest.fn();
    status = jest.fn(() => res);
    req = {};
    res = { status: status as any, json: json as any };
  });

  it("should log the error when status is 500", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const err = new Error("Internal failure");

    errorHandler(err, req as Request, res as Response, {} as NextFunction);

    expect(errorSpy).toHaveBeenCalledWith(err);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ success: false, message: "Internal failure" });
  });

  it("should not log the error when status is not 500", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const err: any = new Error("Bad request");
    err.status = 400;

    errorHandler(err, req as Request, res as Response, {} as NextFunction);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ success: false, message: "Bad request" });
  });

  it("should use default message when error has no message", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const err = {} as any;
    err.status = 500;

    errorHandler(err, req as Request, res as Response, {} as NextFunction);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ success: false, message: "Something went wrong" });
  });
});
