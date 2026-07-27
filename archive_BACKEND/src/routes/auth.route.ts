/**
 * Authentication Routes
 * Base path: /api/v1/auth
 *
 * POST /register          — Create a new user account.
 * POST /login             — Log in and receive a JWT cookie.
 * POST /logout            — Clear the auth cookie.
 * POST /forgot-password   — Send a password-reset OTP to the user's email.
 * POST /reset-password    — Reset password using the OTP.
 * GET  /whoami            — Return the authenticated user's profile.
 * PUT  /update            — Update profile info or avatar (requires auth).
 * GET  /google            — Initiate Google OAuth flow.
 * GET  /google/callback   — Handle Google OAuth callback.
 * POST /google/mobile     — Authenticate using a Google ID token (mobile).
 */
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
router.post("/google/mobile", asyncHandler(oauthController.googleMobile));

export default router;
