import { Router } from "express";
import { adminAnalyticsController } from "../../controllers/admin/analytics.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../middleware/error.middleware";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/", asyncHandler(adminAnalyticsController.getAnalytics));

export default router;
