/**
 * Order Routes
 * Base path: /api/v1/orders
 * All routes require authentication via the `authenticate` middleware.
 *
 * POST /     — Create a new order from the user's current cart.
 * GET  /my   — Retrieve all orders belonging to the current user.
 * DELETE /:id — Cancel and remove a specific order by ID.
 */
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
