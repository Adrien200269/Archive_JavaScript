/**
 * Payment Routes
 * Base path: /api/v1/payments
 *
 * POST /create                   — Create an order and initiate a Khalti payment session (auth required).
 * GET  /khalti/callback           — Khalti redirect callback after user completes payment (public).
 * POST /verify                    — Manually verify a payment by PIDX (auth required).
 * GET  /order/:orderId/status     — Check the payment status of a specific order (auth required).
 */
import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.post("/create", authenticate, asyncHandler(paymentController.createOrderWithPayment));
router.get("/khalti/callback", asyncHandler(paymentController.khaltiCallback));
router.post("/verify", authenticate, asyncHandler(paymentController.verifyPayment));
router.get("/order/:orderId/status", authenticate, asyncHandler(paymentController.orderPaymentStatus));

export default router;
