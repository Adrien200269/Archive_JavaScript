import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { asyncHandler } from "../middleware/error.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/", upload.single("image"), asyncHandler(productController.addProduct));
router.get("/", asyncHandler(productController.getProducts));

export default router;
