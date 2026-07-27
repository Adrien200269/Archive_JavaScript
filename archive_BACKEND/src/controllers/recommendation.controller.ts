import { Request, Response } from "express";
import { recommendationService } from "../services/recommendation.service";

export const recommendationController = {
  /**
   * Returns a personalised list of product recommendations for the
   * currently authenticated user. Falls back to popularity-based
   * recommendations for unauthenticated users.
   *
   * @route  GET /api/v1/recommendations
   * @query  limit - Maximum number of products to return (capped at 20, default 8).
   */
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
