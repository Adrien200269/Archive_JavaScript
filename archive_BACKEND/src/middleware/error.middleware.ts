import { Request, Response, NextFunction } from "express";

/**
 * Higher-order function that wraps an async route handler.
 * Automatically forwards any thrown errors to Express's next(err),
 * eliminating the need for try/catch in every controller.
 *
 * @param fn - The async route handler to wrap.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Central Express error handler.
 * Must be registered LAST in the middleware chain.
 * Converts thrown errors into a consistent JSON error response.
 *
 * @param err  - The thrown error (may include a .status property).
 */
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
