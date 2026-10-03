import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getProducts)
  .post(protect, authorize("admin", "manager"), createProduct);

router
  .route("/:id")
  .get(protect, getProductById)
  .put(protect, authorize("admin", "manager"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

export default router;
