/**
 * Chat Routes
 * Base path: /api/v1/chat
 *
 * POST / — Send a message to the AI shopping assistant.
 *           Authentication is optional; logged-in users receive personalised responses.
 */
import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.post("/", asyncHandler(chatController.sendMessage));

export default router;
