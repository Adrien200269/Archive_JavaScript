import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { chatService } from "../services/chat.service";
import { JwtPayload } from "../types/user.type";

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let userId: string | null = null;
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as JwtPayload;
        userId = decoded.id;
      } catch {
        // Invalid token, continue without user context
      }
    }

    const reply = await chatService.handleMessage(userId, message.trim());

    return res.status(200).json({
      success: true,
      data: { reply },
    });
  },
};
