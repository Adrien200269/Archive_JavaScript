import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { RegisterDTO, LoginDTO, UserResponseDTO } from "../dtos/user.dto";
import { JwtPayload } from "../types/user.type";

// Strip the password and reshape the Mongoose doc into a safe client response.
const toUserResponse = (user: IUser): UserResponseDTO => ({
  id: (user._id as any).toString(),
  fullName: user.fullName,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

const signToken = (user: IUser): string => {
  const payload: JwtPayload = { id: (user._id as any).toString(), email: user.email };
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
    });

    return toUserResponse(user);
  },

  // LOGIN: verify password, then generate a JWT.
  async login(
    dto: LoginDTO
  ): Promise<{ token: string; user: UserResponseDTO }> {
    // password has select:false, so explicitly ask for it
    const user = await User.findOne({ email: dto.email.toLowerCase() }).select(
      "+password"
    );

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
};
