import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// The document interface (what a User looks like in the DB).
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  age?: number;
  role: "user" | "admin";
  provider: "local" | "google" | "facebook";
  providerId?: string;
  resetPasswordCode?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // don't return the hash by default
    },
    avatar: {
      type: String,
    },
    age: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    providerId: {
      type: String,
    },
    resetPasswordCode: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash the password automatically before saving (only if it changed).
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to verify a password at login time.
userSchema.methods.comparePassword = function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
