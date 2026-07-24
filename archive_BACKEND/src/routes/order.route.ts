import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.use(authenticate);

router.post("/", asyncHandler(orderController.createOrder));
router.get("/my", asyncHandler(orderController.getMyOrders));
router.delete("/:id", asyncHandler(orderController.deleteOrder));

export default router;
