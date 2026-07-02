import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, IUser } from "../models/user.model";
import { RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO, UserResponseDTO, AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/user.dto";
import { JwtPayload } from "../types/user.type";
import { sendResetCodeEmail } from "./email.service";

// Strip the password and reshape the Mongoose doc into a safe client response.
const toUserResponse = (user: IUser): UserResponseDTO => ({
  id: (user._id as any).toString(),
  fullName: user.fullName,
  email: user.email,
  avatar: user.avatar,
  age: user.age,
  role: user.role,
  provider: user.provider,
  createdAt: user.createdAt,
});

const signToken = (user: IUser): string => {
  const payload: JwtPayload = {
    id: (user._id as any).toString(),
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

export const userService = {
  // REGISTER: duplicate-email check + password hashing (hashing happens in the model hook).
  async register(dto: RegisterDTO): Promise<UserResponseDTO> {
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      const err: any = new Error("An account with this email already exists");
      err.status = 409;
      throw err;
    }

    const user = await User.create({
      fullName: dto.fullName,
      email: dto.email,
      password: dto.password,
      age: dto.age,
      provider: "local",
    });

    return toUserResponse(user);
  },

  // LOGIN: verify password, then generate a JWT.
  async login(dto: LoginDTO): Promise<{ token: string; user: UserResponseDTO }> {
    // password has select:false, so explicitly ask for it
    const user = await User.findOne({ email: dto.email.toLowerCase() }).select("+password");

    if (!user) {
      const err: any = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const valid = await user.comparePassword(dto.password);
    if (!valid) {
      const err: any = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const token = signToken(user);
    return { token, user: toUserResponse(user) };
  },

  // Used by /whoami (auth middleware).
  async getById(id: string): Promise<UserResponseDTO | null> {
    const user = await User.findById(id);
    return user ? toUserResponse(user) : null;
  },

  // FORGOT PASSWORD: generate a 6-digit code, save it, email it.
  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const user = await User.findOne({ email: dto.email.toLowerCase() });
    // Don't reveal whether the email exists
    if (!user) return;

    const code = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    await sendResetCodeEmail(user.email, code).catch((err) => {
      console.error("Failed to send reset email:", err);
    });
  },

  // RESET PASSWORD: verify code + expiry, update password.
  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    const user = await User.findOne({
      email: dto.email.toLowerCase(),
      resetPasswordCode: dto.code,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      const err: any = new Error("Invalid or expired reset code");
      err.status = 400;
      throw err;
    }

    user.password = dto.password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  },

  // ── Admin Service Methods ──────────────────────────────────────────────────

  async adminGetAllUsers(
    page?: string,
    limit?: string,
    search?: string
  ): Promise<{ data: UserResponseDTO[]; pagination: object }> {
    const currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
    const currentLimit = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
    const skip = (currentPage - 1) * currentLimit;

    const query: any = {};
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(currentLimit),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / currentLimit);
    return {
      data: users.map(toUserResponse),
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages,
      },
    };
  },

  async adminGetUserById(id: string): Promise<UserResponseDTO> {
    const user = await User.findById(id);
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }
    return toUserResponse(user);
  },

  async adminCreateUser(dto: AdminCreateUserDTO): Promise<UserResponseDTO> {
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      const err: any = new Error("An account with this email already exists");
      err.status = 409;
      throw err;
    }

    const user = await User.create({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      password: dto.password,
      role: dto.role ?? "user",
    });

    return toUserResponse(user);
  },

  async adminUpdateUser(id: string, dto: AdminUpdateUserDTO): Promise<UserResponseDTO> {
    const user = await User.findById(id).select("+password");
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    // Email uniqueness check
    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: dto.email.toLowerCase() });
      if (emailExists) {
        const err: any = new Error("Email already in use");
        err.status = 409;
        throw err;
      }
      user.email = dto.email.toLowerCase();
    }

    if (dto.fullName) user.fullName = dto.fullName;
    if (dto.role) user.role = dto.role;
    if (dto.password) user.password = dto.password; // model pre-save hook will hash it

    await user.save();
    return toUserResponse(user);
  },

  async adminDeleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }
  },
};
