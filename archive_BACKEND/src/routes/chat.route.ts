import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.post("/", asyncHandler(chatController.sendMessage));

export default router;
