import { Router } from "express";
import { inventoryController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

// Products
router.get("/products", asyncHandler(inventoryController.listProducts));
router.get("/products/low-stock", asyncHandler(inventoryController.getLowStock));
router.get("/products/:id", asyncHandler(inventoryController.getProduct));
router.post("/products", asyncHandler(inventoryController.createProduct));
router.put("/products/:id", asyncHandler(inventoryController.updateProduct));
router.delete("/products/:id", asyncHandler(inventoryController.deleteProduct));
router.post("/stock/update", asyncHandler(inventoryController.updateStock));

// Categories
router.get("/categories", asyncHandler(inventoryController.listCategories));
router.post("/categories", asyncHandler(inventoryController.createCategory));

export default router;
