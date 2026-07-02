import { Request, Response } from "express";
import { recommendationService } from "../services/recommendation.service";

export const recommendationController = {
  async getRecommendations(req: Request, res: Response) {
    const userId = (req as any).userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 8, 20);

    const products = await recommendationService.getRecommendations(userId, limit);

    return res.status(200).json({
      success: true,
      data: products,
    });
  },
};
