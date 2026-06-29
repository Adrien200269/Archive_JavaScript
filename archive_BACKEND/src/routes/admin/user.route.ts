import { Router } from "express";
import { adminUserController } from "../../controllers/admin/user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../middleware/error.middleware";

const router = Router();

// All routes in this file require authentication AND admin role.
router.use(authenticate, requireAdmin);

// GET    /api/v1/admin/users          - paginated list with optional search
router.get("/", asyncHandler(adminUserController.getAllUsers));

// GET    /api/v1/admin/users/:id      - single user detail
router.get("/:id", asyncHandler(adminUserController.getUserById));

// POST   /api/v1/admin/users          - create a user
router.post("/", asyncHandler(adminUserController.createUser));

// PUT    /api/v1/admin/users/:id      - update a user
router.put("/:id", asyncHandler(adminUserController.updateUser));

// DELETE /api/v1/admin/users/:id      - delete a user
router.delete("/:id", asyncHandler(adminUserController.deleteUser));

export default router;
