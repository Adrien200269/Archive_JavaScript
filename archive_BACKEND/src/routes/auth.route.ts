import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { oauthController } from "../controllers/oauth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));
router.post("/forgot-password", asyncHandler(authController.forgotPassword));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.get("/whoami", authenticate, asyncHandler(authController.whoami));
router.put("/update", authenticate, upload.single("avatar"), asyncHandler(authController.update));

// OAuth routes
router.get("/google", oauthController.googleAuth);
router.get("/google/callback", oauthController.googleCallback);

export default router;
