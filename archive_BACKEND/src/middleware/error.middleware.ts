import { Request, Response, NextFunction } from "express";

// Wraps async route handlers so thrown errors reach the error handler
// without try/catch in every controller.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Central error handler: turns thrown errors into clean JSON responses.
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message });
};
