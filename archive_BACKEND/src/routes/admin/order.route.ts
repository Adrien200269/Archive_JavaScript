import { Router } from "express";
import { adminOrderController } from "../../controllers/admin/order.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../middleware/error.middleware";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/", asyncHandler(adminOrderController.getAllOrders));
router.patch("/:id/status", asyncHandler(adminOrderController.updateOrderStatus));

export default router;
