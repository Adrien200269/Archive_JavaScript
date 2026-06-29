import { Request, Response, NextFunction } from "express";

// Guards admin-only routes.
// Must be used AFTER the `authenticate` middleware so (req as any).userRole is set.
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).userRole;
  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: admin access required",
    });
  }
  next();
};
