import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/", authenticate, requireAdmin, upload.single("image"), asyncHandler(productController.addProduct));
router.get("/", asyncHandler(productController.getProducts));
router.put("/:id", authenticate, requireAdmin, upload.single("image"), asyncHandler(productController.updateProduct));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(productController.deleteProduct));
router.patch("/:id/favorite", asyncHandler(productController.toggleFavorite));

export default router;
