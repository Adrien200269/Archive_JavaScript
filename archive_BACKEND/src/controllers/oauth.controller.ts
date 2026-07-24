import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport";
import { User } from "../models/user.model";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

async function fetchGoogleUser(token: string) {
  const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
  if (!res.ok) throw new Error("Invalid Google token");
  return res.json() as Promise<{
    sub: string;
    email: string;
    name: string;
    picture: string;
  }>;
}

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

  // POST /api/v1/auth/google/mobile
  async googleMobile(req: Request, res: Response) {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: "idToken is required" });
    }

    let googleUser;
    try {
      googleUser = await fetchGoogleUser(idToken);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    if (!googleUser.email) {
      return res.status(400).json({ success: false, message: "No email returned from Google" });
    }

    let user = await User.findOne({ provider: "google", providerId: googleUser.sub });
    if (!user) {
      user = await User.findOne({ email: googleUser.email.toLowerCase() });
      if (user) {
        user.provider = "google";
        user.providerId = googleUser.sub;
        if (!user.avatar) user.avatar = googleUser.picture;
      } else {
        user = await User.create({
          fullName: googleUser.name,
          email: googleUser.email.toLowerCase(),
          password: googleUser.sub + (process.env.JWT_SECRET as string),
          provider: "google",
          providerId: googleUser.sub,
          avatar: googleUser.picture,
        });
      }
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  },
};
