import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.post("/create", authenticate, asyncHandler(paymentController.createOrderWithPayment));
router.get("/khalti/callback", asyncHandler(paymentController.khaltiCallback));
router.post("/verify", authenticate, asyncHandler(paymentController.verifyPayment));

export default router;
