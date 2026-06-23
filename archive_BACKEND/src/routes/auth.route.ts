import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));
router.get("/whoami", authenticate, asyncHandler(authController.whoami));
router.put("/update", authenticate, upload.single("avatar"), asyncHandler(authController.update));

export default router;
