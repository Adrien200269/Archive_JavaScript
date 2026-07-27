import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/user.type";

/**
 * Authentication middleware.
 * Reads the JWT from the httpOnly cookie OR the Authorization Bearer header,
 * verifies its signature and expiry, then attaches userId, userRole,
 * and userEmail onto the request object for downstream handlers.
 *
 * @throws 401 if no token is present or the token is invalid/expired.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fromCookie = req.cookies?.token;
  const header = req.headers.authorization;
  const fromHeader = header?.startsWith("Bearer ")
    ? header.slice(7)
    : undefined;

  const token = fromCookie || fromHeader;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;
    (req as any).userEmail = decoded.email;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
