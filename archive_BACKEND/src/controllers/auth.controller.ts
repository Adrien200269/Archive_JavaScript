import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from "../types/user.type";
import { User } from "../models/user.model";

// Cookie options reused for setting/clearing the auth cookie.
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

export const authController = {
  // POST /api/v1/auth/register
  async register(req: Request, res: Response) {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const user = await userService.register(parsed.data);
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
    });
  },

  // POST /api/v1/auth/login
  async login(req: Request, res: Response) {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { token, user } = await userService.login(parsed.data);

    // Also set the JWT as an httpOnly cookie (in addition to returning it).
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { token, user },
    });
  },

  // POST /api/v1/auth/logout
  async logout(_req: Request, res: Response) {
    res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
    return res.status(200).json({ success: true, message: "Logged out" });
  },

  // GET /api/v1/auth/whoami  (protected)
  async whoami(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    const user = await userService.getById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  },

  // PUT /api/v1/auth/update  (protected)
  async update(req: Request, res: Response) {
    const userId = (req as any).userId as string;
    const { fullName, email, oldPassword, password } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 1. Password update validation & hashing
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: { oldPassword: ["Current password is required to change password"] },
        });
      }
      const isPasswordValid = await user.comparePassword(oldPassword);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: { oldPassword: ["Incorrect current password"] },
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: { password: ["New password must be at least 8 characters"] },
        });
      }
      user.password = password;
    }

    // 2. Email uniqueness check
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: { email: ["Email already in use"] },
        });
      }
      user.email = email;
    }

    // 3. Name update
    if (fullName) {
      if (fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: { fullName: ["Full name must be at least 2 characters"] },
        });
      }
      user.fullName = fullName;
    }

    // 4. File upload (avatar)
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const responseData = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: responseData,
    });
  },

  // POST /api/v1/auth/forgot-password
  async forgotPassword(req: Request, res: Response) {
    const parsed = ForgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await userService.forgotPassword(parsed.data);
    return res.status(200).json({
      success: true,
      message: "If that email is registered, a reset code has been sent.",
    });
  },

  // POST /api/v1/auth/reset-password
  async resetPassword(req: Request, res: Response) {
    const parsed = ResetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await userService.resetPassword(parsed.data);
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  },
};
