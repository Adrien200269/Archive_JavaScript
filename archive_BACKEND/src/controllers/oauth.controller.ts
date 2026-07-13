import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

export const oauthController = {
  // GET /api/v1/auth/google
  googleAuth: passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),

  // GET /api/v1/auth/google/callback
  googleCallback: [
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${clientURL}/login?oauth=failed`,
    }),
    async (req: Request, res: Response) => {
      const user = req.user as any;
      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
      );
      res.cookie("token", token, cookieOptions);
      res.redirect(`${clientURL}/dashboard`);
    },
  ],

};
