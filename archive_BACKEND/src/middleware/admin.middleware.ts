import { Request, Response, NextFunction } from "express";

/**
 * Role-guard middleware that restricts access to admin-only routes.
 * MUST be used after the `authenticate` middleware, as it relies on
 * `(req as any).userRole` being set by the JWT verification step.
 *
 * @throws 403 if the authenticated user does not have the 'admin' role.
 */
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
