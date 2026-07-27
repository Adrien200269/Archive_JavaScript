/**
 * Recommendation Routes
 * Base path: /api/v1/recommendations
 *
 * GET / — Retrieve personalised product recommendations.
 *          Requires authentication. Results are tailored to the user's order history.
 */
import { Router } from "express";
import { recommendationController } from "../controllers/recommendation.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get("/", authenticate, asyncHandler(recommendationController.getRecommendations));

export default router;
